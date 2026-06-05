import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14.21.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const sig = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!sig || !webhookSecret) {
    return new Response("Missing signature", { status: 400 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2024-06-20",
  });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("Signature verification failed", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  /**
   * Mark a pool_members row as paid.
   * Requires both memberId AND sessionId so we always cross-check that the
   * stripe_session_id stored on the row matches the event — prevents a forged
   * or misrouted metadata from promoting an arbitrary member.
   */
  const markPaid = async (memberId: string | undefined, sessionId: string) => {
    if (!memberId || !sessionId) return;
    const { error } = await admin
      .from("pool_members")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        stripe_session_id: sessionId,
      })
      .eq("id", memberId)
      .eq("stripe_session_id", sessionId)   // cross-check: must match the stored session
      .eq("payment_status", "pending");
    if (error) console.error("Failed to mark paid", error);
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === "paid") {
          await markPaid(session.metadata?.member_id, session.id);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markPaid(session.metadata?.member_id, session.id);
        break;
      }
      // payment_intent.succeeded is intentionally omitted: for PIX the
      // checkout.session.async_payment_succeeded event is the canonical signal.
      // Handling payment_intent.succeeded separately would require a session
      // lookup to get the session ID for the cross-check, and the checkout
      // session events already cover all Pix payment outcomes.
      default:
        break;
    }
  } catch (err) {
    console.error("Handler error", err);
    return new Response(`Handler Error: ${(err as Error).message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
