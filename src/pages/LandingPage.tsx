import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.png";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Trophy, Target, Users, Star, Zap, Shield, ChevronDown, Youtube,
  Crown, TrendingUp, MessageCircle, Smartphone, Lock
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
      {/* Header — glassmorphism */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-gold/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mestre do Placar" className="h-10 w-10 rounded-lg" />
            <span className="font-display text-xl text-gradient-gold">MESTRE DO PLACAR</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => navigate("/login")}>
              Entrar
            </Button>
            <Button variant="gold" size="sm" onClick={() => navigate("/signup")}>
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="container relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div>
              <ScrollReveal>
                <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-[1.05]">
                  <span className="text-foreground">ONDE A </span>
                  <span className="text-gradient-gold">RESENHA</span>
                  <br />
                  <span className="text-foreground">VIRA </span>
                  <span className="text-gradient-gold">JOGO</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <p className="mt-6 text-lg md:text-xl text-foreground max-w-lg">
                  O bolão da Copa do Mundo mais completo. Aposte nos placares, acompanhe ao vivo e prove que você é o verdadeiro mestre.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button variant="hero" size="xl" className="shadow-gold-glow" onClick={() => navigate("/signup")}>
                    <Trophy className="mr-2 h-5 w-5" />
                    Criar Meu Bolão
                  </Button>
                  <Button variant="outline" size="lg" className="border-gold/20 text-gold hover:bg-gold/5 hover:text-gold" onClick={() => {
                    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                    Como funciona
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — logo with glow + phone mockup */}
            <div className="relative flex items-center justify-center">
              <ScrollReveal delay={150}>
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-gold/10 rounded-full scale-150" />
                  <img src={logo} alt="Mestre do Placar" className="relative h-40 w-40 md:h-52 md:w-52 drop-shadow-2xl animate-float" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* World Cup Summary */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-radial-glow-bottom" />
        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Copa do Mundo 2026</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                O <span className="text-gradient-gold">Maior Torneio</span> da História
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
                <div className="bg-card rounded-xl p-5 text-center border border-gold/10 card-hover">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-gold" />
                  <p className="text-3xl font-display font-bold text-foreground">{stat.num}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Como Funciona</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Simples, Rápido e <span className="text-gradient-gold">Viciante</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Trophy, title: "Faça Sua Aposta", desc: "Escolha o placar exato ou o resultado para cada jogo. Use o 'Aposta Instantânea' se quiser arriscar!", step: "01" },
              { icon: Lock, title: "Jogo Dourado", desc: "Escolha um jogo por rodada para dobrar seus pontos. A estratégia faz diferença!", step: "02" },
              { icon: MessageCircle, title: "Suba no Ranking", desc: "Acompanhe ao vivo sua posição. Lute para subir de Série e conquistar o título de Mestre!", step: "03" },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 100}>
                <div className="relative bg-card rounded-xl p-6 border border-gold/10 group h-full card-hover">
                  <span className="absolute -top-3 -left-2 font-display text-5xl font-bold text-gold/8">{item.step}</span>
                  <item.icon className="h-8 w-8 text-gold mb-4" />
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Mestre do Placar */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="container relative">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                POR QUE O <span className="text-gradient-gold">MESTRE DO PLACAR</span>?
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Trophy, title: "Ranking em Tempo Real", desc: "Placar atualizado gol a gol com latência " },
              { icon: Users, title: "Bolões Multi-Grupo", desc: "Crie e participe de vários bolões simultaneamente" },
              { icon: Zap, title: "Jogo de Ouro", desc: "Escolha um jogo por rodada para dobrar seus pontos" },
              { icon: Shield, title: "Divisões Dinâmicas", desc: "Suba de série com promoção/rebaixamento semanal" },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 80}>
                <div className="flex items-start gap-4 bg-card rounded-xl p-5 border border-gold/10 h-full card-hover">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring Table */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="container max-w-2xl relative">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Pontuação</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Cada <span className="text-gradient-gold">Acerto</span> Conta
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="bg-card rounded-xl border border-gold/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary border-b border-gold/10">
                    <th className="text-left px-5 py-3 font-semibold text-foreground">Acerto</th>
                    <th className="text-right px-5 py-3 font-semibold text-foreground">Pontos</th>
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
                      <td className="px-5 py-3.5 text-right font-display font-bold text-lg text-gold">{row.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="container max-w-3xl relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">Planos</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Para Todo Tamanho de <span className="text-gradient-gold">Resenha</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0}>
              <div className="bg-card rounded-xl p-6 border border-gold/10 h-full flex flex-col card-hover">
                <p className="text-sm font-semibold text-grass uppercase tracking-wider">Gratuito</p>
                <p className="mt-3 font-display text-4xl font-bold text-foreground">R$ 0</p>
                <p className="text-sm text-muted-foreground mt-1">Para até 10 participantes</p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground flex-1">
                  {["Até 10 membros", "Todas as funcionalidades", "Ranking ao vivo", "Jogo Dourado"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Target className="h-4 w-4 text-grass shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-6 border-gold/20 text-foreground hover:bg-secondary hover:text-foreground" onClick={() => navigate("/signup")}>
                  Começar Grátis
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="bg-card rounded-xl p-6 border-2 border-gold/30 h-full flex flex-col relative overflow-hidden shadow-gold-glow card-hover">
                <div className="absolute top-0 right-0 bg-gold-gradient text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
                <p className="text-sm font-semibold text-gold uppercase tracking-wider">Pro</p>
                <p className="mt-3 font-display text-4xl font-bold text-foreground">
                  R$ 9,99
                  <span className="text-base font-sans font-normal text-muted-foreground">/participante</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">10+ participantes</p>
                <ul className="mt-6 space-y-3 text-sm text-muted-foreground flex-1">
                  {["Membros ilimitados", "Painel administrativo", "Regras personalizáveis", "Convites por link", "Divisões e promoções"].map((f) => (
                    <li key={f} className="flex items-center gap-2"><Star className="h-4 w-4 text-gold shrink-0" />{f}</li>
                  ))}
                </ul>
                <Button variant="hero" className="mt-6 shadow-gold-glow" onClick={() => navigate("/signup")}>
                  Assinar Agora
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
        <div className="container max-w-2xl relative">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-2">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Perguntas <span className="text-gradient-gold">Frequentes</span>
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
                <AccordionItem key={item.q} value={item.q} className="bg-card rounded-xl border border-gold/10 px-4">
                  <AccordionTrigger className="text-left text-sm font-medium py-4 hover:no-underline text-foreground">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gold/10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Mestre do Placar" className="h-8 w-8 rounded" />
            <span className="font-display text-sm text-gradient-gold">MESTRE DO PLACAR</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Mestre do Placar. Onde a resenha vira jogo.</p>
          <a href="https://youtube.com/@CazsTV" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Youtube className="h-4 w-4" /> CazéTV
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
