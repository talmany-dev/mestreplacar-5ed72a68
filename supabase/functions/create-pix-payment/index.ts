import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14.21.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    const body = await req.json().catch(() => ({}));
    const poolId = typeof body?.pool_id === "string" ? body.pool_id : null;
    if (!poolId) {
      return new Response(JSON.stringify({ error: "pool_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: member, error: memberErr } = await admin
      .from("pool_members")
      .select("id, payment_status, pool_id, user_id")
      .eq("pool_id", poolId)
      .eq("user_id", userId)
      .maybeSingle();

    if (memberErr || !member) {
      return new Response(JSON.stringify({ error: "Not a member of this pool" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (member.payment_status !== "pending") {
      return new Response(JSON.stringify({ already_paid: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: pool, error: poolErr } = await admin
      .from("pools")
      .select("id, name, entry_fee_cents, owner_id")
      .eq("id", poolId)
      .maybeSingle();

    if (poolErr || !pool) {
      return new Response(JSON.stringify({ error: "Pool not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-06-20",
    });

    const origin = req.headers.get("origin") ?? "https://mestredoplacar.com.br";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["pix"],
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: `Entrada no bolão "${pool.name}"`,
              description: "Mestre do Placar",
            },
            unit_amount: pool.entry_fee_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/pay/${pool.id}?status=success`,
      cancel_url: `${origin}/pay/${pool.id}?status=cancel`,
      metadata: {
        member_id: member.id,
        pool_id: pool.id,
        user_id: userId,
      },
      payment_intent_data: {
        metadata: {
          member_id: member.id,
          pool_id: pool.id,
          user_id: userId,
        },
      },
    });

    await admin
      .from("pool_members")
      .update({ stripe_session_id: session.id })
      .eq("id", member.id);

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-pix-payment error", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
