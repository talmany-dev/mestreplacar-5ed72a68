import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Trophy, Target, Users, Star, Zap, Shield, ChevronDown, Youtube,
  Crown, TrendingUp, MessageCircle, Smartphone
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy-dark/95 backdrop-blur-sm border-b border-gold/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mestre do Placar" className="h-10 w-10 rounded-lg" />
            <span className="font-display text-xl text-gold">MESTRE DO PLACAR</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-gold/80 hover:text-gold hover:bg-navy-light/50" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button variant="gold" size="sm" onClick={() => navigate("/signup")}>
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(140_50%_25%/0.15),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="container relative text-center">
          <ScrollReveal>
            <img src={logo} alt="Mestre do Placar" className="mx-auto h-28 w-28 md:h-36 md:w-36 mb-6 drop-shadow-2xl" />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.05]">
              <span className="text-gradient-gold">ONDE A RESENHA</span>
              <br />
              <span className="text-primary-foreground/90">VIRA JOGO</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/60 max-w-lg mx-auto">
              O bolão da Copa do Mundo mais completo. Aposte nos placares, acompanhe ao vivo e prove que você é o verdadeiro mestre.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="xl" onClick={() => navigate("/signup")}>
                <Trophy className="mr-2 h-5 w-5" />
                Começar Agora
              </Button>
              <Button variant="outline" size="lg" className="border-gold/30 text-gold hover:bg-gold/10 hover:text-gold" onClick={() => {
                document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
              }}>
                Como funciona
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* World Cup Summary */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-grass mb-2">Copa do Mundo 2026</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                O Maior Torneio da História
              </h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                48 seleções, 104 jogos, 3 países-sede. A Copa de 2026 nos EUA, Canadá e México será épica.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "48", label: "Seleções", icon: Shield },
              { num: "104", label: "Jogos", icon: Target },
              { num: "16", label: "Cidades-Sede", icon: Star },
              { num: "3", label: "Países", icon: TrendingUp },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <div className="bg-card rounded-xl p-5 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-grass" />
                  <p className="text-3xl font-display font-bold text-foreground">{stat.num}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-16 md:py-24 bg-navy">
        <div className="container">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Como Funciona</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground/90">
                Simples, Rápido e Viciante
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Smartphone, title: "Faça Sua Aposta", desc: "Escolha o placar exato ou o resultado (vitória/empate/derrota) para cada jogo. Use o 'Aposta Instantânea' se quiser arriscar!", step: "01" },
              { icon: Zap, title: "Jogo Dourado", desc: "Escolha um jogo por rodada para dobrar seus pontos. A estratégia faz diferença!", step: "02" },
              { icon: Crown, title: "Suba no Ranking", desc: "Acompanhe ao vivo sua posição. Lute para subir de Série e conquistar o título de Mestre!", step: "03" },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className="relative bg-navy-light/40 rounded-xl p-6 border border-gold/10 hover:border-gold/30 transition-colors duration-300">
                  <span className="absolute -top-3 -left-2 font-display text-5xl font-bold text-gold/10">{item.step}</span>
                  <item.icon className="h-8 w-8 text-gold mb-4" />
                  <h3 className="font-display text-xl font-semibold text-primary-foreground/90 mb-2">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/50 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Table */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-grass mb-2">Pontuação</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Cada Acerto Conta
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy text-primary-foreground/80">
                    <th className="text-left px-5 py-3 font-semibold">Acerto</th>
                    <th className="text-right px-5 py-3 font-semibold">Pontos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { action: "Placar Exato", pts: "25", highlight: true },
                    { action: "Vencedor + Saldo de Gols", pts: "18", highlight: false },
                    { action: "Vencedor / Empate", pts: "10", highlight: false },
                    { action: "Gols de um Time", pts: "5", highlight: false },
                    { action: "Previsão de Campeão (Bônus)", pts: "50", highlight: true },
                  ].map((row) => (
                    <tr key={row.action} className={row.highlight ? "bg-gold/5" : ""}>
                      <td className="px-5 py-3.5 text-foreground">{row.action}</td>
                      <td className="px-5 py-3.5 text-right font-display font-bold text-lg text-gold-dark">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="container max-w-3xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Planos</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground/90">
                Para Todo Tamanho de Resenha
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0}>
              <div className="bg-navy-light/40 rounded-xl p-6 border border-primary-foreground/10 h-full flex flex-col">
                <p className="text-sm font-semibold text-grass uppercase tracking-wider">Gratuito</p>
                <p className="mt-3 font-display text-4xl font-bold text-primary-foreground/90">R$ 0</p>
                <p className="text-sm text-primary-foreground/40 mt-1">Para até 10 participantes</p>
                <ul className="mt-6 space-y-3 text-sm text-primary-foreground/60 flex-1">
                  {["Até 10 membros", "Todas as funcionalidades", "Ranking ao vivo", "Jogo Dourado"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Target className="h-4 w-4 text-grass shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-6 border-primary-foreground/20 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => navigate("/signup")}>
                  Começar Grátis
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="bg-navy-light/40 rounded-xl p-6 border-2 border-gold/40 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gold-gradient text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
                <p className="text-sm font-semibold text-gold uppercase tracking-wider">Pro</p>
                <p className="mt-3 font-display text-4xl font-bold text-primary-foreground/90">
                  R$ 9,99
                  <span className="text-base font-sans font-normal text-primary-foreground/40">/participante</span>
                </p>
                <p className="text-sm text-primary-foreground/40 mt-1">10+ participantes</p>
                <ul className="mt-6 space-y-3 text-sm text-primary-foreground/60 flex-1">
                  {["Membros ilimitados", "Painel administrativo", "Regras personalizáveis", "Convites por link", "Divisões e promoções"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Star className="h-4 w-4 text-gold shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button variant="hero" className="mt-6" onClick={() => navigate("/signup")}>
                  Assinar Agora
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-grass mb-2">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Perguntas Frequentes
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <Accordion type="single" collapsible className="space-y-2">
              {[
                { q: "Como funciona o Jogo Dourado?", a: "Você pode selecionar um jogo por rodada como 'Jogo Dourado'. Se acertar, seus pontos naquele jogo são dobrados! É uma ótima estratégia para ultrapassar os rivais." },
                { q: "Quando minha aposta é bloqueada?", a: "Sua aposta é bloqueada 30 minutos antes do início da partida. Após isso, não é possível alterar o palpite." },
                { q: "O que são as Séries A, B e C?", a: "Os participantes são divididos em divisões. A cada rodada, os melhores sobem e os piores descem — como um campeonato de verdade!" },
                { q: "Posso usar no celular?", a: "Sim! O Mestre do Placar foi desenvolvido mobile-first. A experiência no celular é otimizada com navegação por abas e input via drawer." },
                { q: "Como assisto aos jogos?", a: "Cada partida tem um link direto para a CazéTV no YouTube, para você assistir ao vivo enquanto acompanha seus palpites." },
              ].map((item) => (
                <AccordionItem key={item.q} value={item.q} className="bg-card rounded-lg border px-4">
                  <AccordionTrigger className="text-left text-sm font-medium py-4 hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-8 border-t border-gold/10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Mestre do Placar" className="h-8 w-8 rounded" />
            <span className="font-display text-sm text-gold/70">MESTRE DO PLACAR</span>
          </div>
          <p className="text-xs text-primary-foreground/30">© 2026 Mestre do Placar. Onde a resenha vira jogo.</p>
          <a href="https://youtube.com/@CazsTV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
            <Youtube className="h-4 w-4" /> CazéTV
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
