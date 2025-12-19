import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import {
  FiLogIn,
  FiUserPlus,
  FiBriefcase,
  FiUsers,
  FiGlobe,
  FiSmartphone,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaRocket,
  FaApple,
  FaGooglePlay,
  FaPalette,
  FaCode,
  FaMobileAlt,
  FaBullhorn,
  FaPenFancy,
  FaVideo,
  FaDatabase,
  FaHeadset,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import Reveal from "../components/Reveal";
import logoSquare from "../assets/img/logoQuadradoFundo.png";
import logoSmall from "../assets/img/logores.png";

const heroStats = [
  { value: "+4.5k", label: "Projetos publicados" },
  { value: "2.1k", label: "Profissionais ativos" },
  { value: "98%", label: "Satisfação média" },
];

const howItWorks = [
  {
    title: "Monte seu perfil",
    desc: "Compartilhe habilidades, portfolio e disponibilidade em menos de 5 minutos.",
    icon: FiUserPlus,
  },
  {
    title: "Faça matching inteligente",
    desc: "Receba oportunidades alinhadas ao seu estilo de trabalho e orçamento.",
    icon: FiBriefcase,
  },
  {
    title: "Colabore e entregue",
    desc: "Use chat integrado, checkpoints e pagamentos seguros direto na plataforma.",
    icon: FiCheckCircle,
  },
];

const testimonials = [
  {
    quote: "Conseguimos montar um squad remoto completo em apenas 48h. O fluxo de contratação é muito fluido.",
    author: "Letícia Monteiro",
    role: "COO, Aurora Labs",
  },
  {
    quote: "Como designer, encontro briefings claros e clientes confiáveis. O sistema de avaliações ajuda muito.",
    author: "Thiago Garcia",
    role: "Product Designer",
  },
];

const trustedBy = ["NebulaPay", "OrbitBank", "Nova Studio", "Quasar Cloud", "Zenith Labs"];

const featuredCategories = [
  {
    title: "Branding & Motion",
    desc: "Animações, identidades e pacotes completos para redes sociais.",
    icon: FaPalette,
    accent: "linear-gradient(135deg, rgba(248,113,113,0.7), rgba(217,70,239,0.5))",
  },
  {
    title: "Engenharia Front-end",
    desc: "Interfaces ricas, microinterações e experiências responsivas.",
    icon: FaCode,
    accent: "linear-gradient(135deg, rgba(59,130,246,0.7), rgba(14,165,233,0.5))",
  },
  {
    title: "Experiências Mobile",
    desc: "Apps nativos, híbridos e PWAs com performance máxima.",
    icon: FaMobileAlt,
    accent: "linear-gradient(135deg, rgba(94,234,212,0.7), rgba(16,185,129,0.4))",
  },
  {
    title: "Vídeo & Realidade",
    desc: "Produções 3D, realidade aumentada e motion para campanhas.",
    icon: FaVideo,
    accent: "linear-gradient(135deg, rgba(129,140,248,0.7), rgba(37,99,235,0.45))",
  },
];

const floatingOrbs = [
  { size: 420, top: "8%", left: "6%", color: "rgba(7, 7, 34, 0.93)" },
  { size: 360, top: "35%", left: "78%", color: "rgba(74, 71, 237, 0.93)" },
  { size: 520, top: "68%", left: "12%", color: "rgba(167,139,250,0.3)" },
  { size: 450, top: "120%", left: "70%", color: "rgba(74, 71, 237, 0.93)" },
  { size: 360, top: "150%", left: "30%", color: "rgba(248,113,113,0.24)" },
  { size: 520, top: "190%", left: "78%", color: "rgba(34,197,94,0.2)" },
];

const starDots = [
  { top: "6%", left: "25%", size: 4, delay: 0 },
  { top: "12%", left: "70%", size: 3, delay: 200 },
  { top: "20%", left: "45%", size: 2, delay: 400 },
  { top: "32%", left: "15%", size: 3, delay: 600 },
  { top: "38%", left: "82%", size: 4, delay: 800 },
  { top: "50%", left: "60%", size: 2, delay: 1000 },
  { top: "58%", left: "32%", size: 3, delay: 1200 },
  { top: "65%", left: "12%", size: 2, delay: 1400 },
  { top: "72%", left: "78%", size: 4, delay: 1600 },
  { top: "80%", left: "42%", size: 2, delay: 1800 },
  { top: "88%", left: "20%", size: 3, delay: 2000 },
  { top: "95%", left: "66%", size: 2, delay: 2200 },
  { top: "110%", left: "35%", size: 3, delay: 2400 },
  { top: "125%", left: "82%", size: 4, delay: 2600 },
  { top: "140%", left: "10%", size: 2, delay: 2800 },
  { top: "155%", left: "55%", size: 3, delay: 3000 },
  { top: "170%", left: "25%", size: 2, delay: 3200 },
  { top: "185%", left: "72%", size: 4, delay: 3400 },
  { top: "200%", left: "45%", size: 3, delay: 3600 },
];

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {floatingOrbs.map((orb, index) => (
        <span
          key={`orb-${index}`}
          className="star-orb"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
          }}
        />
      ))}
      {starDots.map((dot, index) => (
        <span
          key={`dot-${index}`}
          className="star-dot"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            animationDelay: `${dot.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

function SectionDivider() {
  return <div className="section-divider" />;
}

function HeroIllustration() {
  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="absolute w-72 h-72 md:w-80 md:h-80 rounded-full bg-linear-to-br from-[#60a5fa] via-[#a855f7] to-transparent blur-3xl opacity-70" />
      <div className="absolute w-40 h-40 rounded-full bg-[#f472b6]/30 blur-2xl -top-6 -right-4" />
      <div className="absolute w-24 h-24 rounded-full bg-[#34d399]/25 blur-2xl bottom-4 left-6" />
      <div className="relative w-full max-w-xs md:max-w-sm rounded-[2.5rem] border border-white/20 bg-linear-to-br from-[#0f172a] via-[#0b1021] to-[#1e1b4b] p-6 shadow-[0_25px_80px_rgba(3,7,18,0.65)]">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/30" />
        <Image src={logoSquare} alt="Freelaverse Planeta" className="w-full" priority />
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <div className="text-xs uppercase tracking-widest text-(--muted-foreground)">
            Matching inteligente
          </div>
          <div className="text-xs uppercase tracking-widest text-(--muted-foreground)">
            Pagamento seguro
          </div>
        </div>
      </div>
    </div>
  );
}

function LaunchIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square flex items-center justify-center">
      <div className="absolute inset-0 bg-linear-to-br from-[#f472b6]/50 via-[#fbbf24]/30 to-transparent blur-3xl opacity-80" />
      <div className="absolute inset-6 rounded-full bg-[#020617]/70 border border-white/10 backdrop-blur-3xl" />
      <div className="relative w-60 h-60 rounded-full border border-white/25 flex items-center justify-center bg-linear-to-br from-[#312e81] via-[#1e1b4b] to-[#111827] shadow-[0_35px_90px_rgba(4,6,20,0.65)]">
        <FaRocket className="text-6xl text-white drop-shadow-[0_10px_30px_rgba(59,130,246,0.4)]" />
        <span className="absolute w-16 h-16 rounded-full bg-[#60a5fa]/30 -top-4 left-6 blur-2xl" />
        <span className="absolute w-10 h-10 rounded-full bg-[#fbbf24]/40 bottom-6 right-10 blur-xl" />
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-full max-w-xs md:max-w-sm mx-auto">
      <div className="absolute -inset-6 bg-linear-to-br from-[#60a5fa]/60 via-transparent to-transparent blur-3xl opacity-70" />
      <div className="relative rounded-[2.5rem] border border-white/20 bg-linear-to-br from-[#1f2937] via-[#0f172a] to-[#111827] p-4 shadow-[0_35px_70px_rgba(3,7,18,0.65)]">
        <div className="rounded-4xl bg-[#030712] h-[460px] px-5 py-6 flex flex-col gap-4 border border-white/10">
          <div className="w-16 h-1 rounded-full bg-white/20 mx-auto" />
          <div className="flex flex-col gap-3">
            <div className="text-sm text-white/70 uppercase tracking-[0.3em]">Feed</div>
          <div className="rounded-2xl p-4 bg-linear-to-br from-[#312e81] to-[#1f2937] border border-white/10 text-sm text-white/90">
              Chat com <span className="text-[#a5b4fc] font-semibold">Aurora Labs</span> em 05:45 · milestone entregue
            </div>
            <div className="rounded-2xl p-4 bg-[#0f172a] border border-white/5 text-sm text-white/70">
              Pagamento liberado para <span className="text-white">Sprint Design</span>
            </div>
          </div>
          <div className="mt-auto rounded-2xl p-4 bg-linear-to-br from-[#14b8a6] to-[#2563eb] text-white text-center font-semibold">
            Receba notificações instantâneas
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Glows de fundo */}
      <div
        className="glow glow--brand w-160 h-160 rounded-full -z-10"
        style={{ top: "-10rem", left: "-10rem" }}
      />
      <div
        className="glow glow--accent w-xl h-xl rounded-full -z-10"
        style={{ bottom: "-10rem", right: "-12rem" }}
      />
      <BackgroundOrbs />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="header-glass flex items-center justify-between gap-4 px-5 md:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image
              src={logoSmall}
              alt="Freelaverse Logo"
              className="rounded-md"
              width={36}
              height={36}
              priority
            />
            <span className="text-xl font-semibold tracking-wide">Freelaverse</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-(--muted-foreground)">
            <a href="#servicos" className="hover:text-foreground transition-colors">
              Serviços
            </a>
            <a href="#como-funciona" className="hover:text-foreground transition-colors">
              Como funciona
            </a>
            <a href="#categorias" className="hover:text-foreground transition-colors">
              Categorias
            </a>
            <a href="#depoimentos" className="hover:text-foreground transition-colors">
              Cases
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="liquid-button liquid-button--ghost text-sm">
              <FiLogIn /> Entrar
            </Link>
            <Link href="/cadastro" className="liquid-button text-sm">
              <FiUserPlus /> Cadastrar
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto pb-20 pt-20">
        <div className="relative grid lg:grid-cols-2 gap-12 items-center overflow-hidden  md:px-12 py-12">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--brand)_15%,transparent_65%)] opacity-40" />
          <span className="absolute w-48 h-48 bg-[#f472b6]/35 blur-3xl -top-6 left-10" />
          <span className="absolute w-56 h-56 bg-[#38bdf8]/30 blur-[80px] bottom-0 right-4" />
          <Reveal className="space-y-6 relative z-10">
            <span className="pill bg-opacity-20 bg-(--brand)">
              Freelaverse · universo de serviços on-demand
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Encontre talentos incríveis e acelere seus projetos em um{" "}
              <span className="text-gradient">universo ilimitado</span>.
              <span className="text-gradient font-bold text-5xl">BRANCH DEVELOP</span>.
            </h1>
            <p className="text-lg text-(--muted-foreground) max-w-xl">
              Conecte clientes e freelancers com tecnologia, curadoria e suporte 24/7. Experiência moderna,
              segura e inspirada na estética gamer que você já ama!
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/cadastro" className="liquid-button">
                <FiUserPlus className="text-xl" /> Criar conta gratuita
              </Link>
              <Link href="/login" className="liquid-button liquid-button--ghost">
                <FiLogIn className="text-xl" /> Fazer login
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-(--muted-foreground)">
              <span className="inline-flex items-center gap-2">
                <FiGlobe /> Plataforma Web
              </span>
              <span className="inline-flex items-center gap-2">
                <FiSmartphone /> Apps em desenvolvimento
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              {heroStats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <p className="text-2xl font-bold text-(--brand)">{stat.value}</p>
                  <p className="text-sm text-(--muted-foreground)">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <HeroIllustration />
        </div>
      </section>

      <SectionDivider />

      {/* Marcas parceiras */}
      <section className="container mx-auto px-6 pb-20">
        <div className="section-block flex flex-col md:flex-row items-center gap-6">
          <Reveal className="flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="text-xs uppercase tracking-[0.3em] text-(--muted-foreground)">
              Confiado por equipes que constroem o futuro
            </div>
            <div className="flex flex-wrap justify-center gap-6 flex-1">
              {trustedBy.map((brand) => (
                <span key={brand} className="trusted-logo">
                  {brand}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />
      {/* Serviços da plataforma */}
      <section className="container mx-auto px-6 pb-24" id="servicos">
        <div className="section-block">
          <Reveal className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Serviços oferecidos</h2>
            <p className="text-(--muted-foreground) mt-2">
              Do design à implantação — encontre especialistas para cada etapa do seu projeto.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <FaPalette />, title: "Design & UI/UX", desc: "Identidade visual, interfaces e protótipos." },
              { icon: <FaCode />, title: "Desenvolvimento Web", desc: "Sites, dashboards e APIs." },
              { icon: <FaMobileAlt />, title: "Apps Mobile", desc: "iOS, Android e cross-platform." },
              { icon: <FaBullhorn />, title: "Marketing Digital", desc: "Tráfego, SEO e social media." },
              { icon: <FaPenFancy />, title: "Redação & Conteúdo", desc: "Copy, blogs e roteiros." },
              { icon: <FaVideo />, title: "Vídeo & Motion", desc: "Edição, animação e 3D." },
              { icon: <FaDatabase />, title: "Dados & IA", desc: "ETL, modelos e dashboards." },
              { icon: <FaHeadset />, title: "Suporte & CX", desc: "Atendimento e sucesso do cliente." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="card p-5 h-full">
                  <div className="text-2xl mb-3 text-(--brand)">{s.icon}</div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm mt-1 text-(--muted-foreground)">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="flex items-center justify-center mt-10 gap-3 flex-wrap">
            <Link href="/cadastro" className="liquid-button">
              Veja mais opções
            </Link>
            <Link href="/login" className="liquid-button liquid-button--ghost">
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Como funciona */}
      <section className="container mx-auto px-6 pb-24" id="como-funciona">
        <div className="section-block">
          <Reveal className="max-w-2xl">
            <p className="pill">Fluxo inteligente</p>
            <h2 className="text-3xl font-bold mt-4">Do briefing ao pagamento sem fricção</h2>
            <p className="text-(--muted-foreground) mt-2">
              Nosso pipeline guia clientes e profissionais por cada etapa, garantindo transparência e entregas sem
              surpresas.
            </p>
          </Reveal>
          <div className="timeline mt-10">
            {howItWorks.map((step, index) => (
              <Reveal key={step.title} delay={index * 120}>
                <div className="timeline-step">
                  <div className="timeline-icon">
                    <step.icon />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                      Etapa {index + 1}
                    </p>
                    <h3 className="text-xl font-semibold mt-1">{step.title}</h3>
                    <p className="text-(--muted-foreground) mt-2 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Categorias em destaque */}
      <section className="container mx-auto px-6 pb-24" id="categorias">
        <Reveal className="text-center mb-10">
          <p className="pill mx-auto">Explorar galáxias</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-3">Escolha o universo ideal para o seu projeto</h2>
          <p className="text-(--muted-foreground) max-w-2xl mx-auto mt-2">
            Combine especialistas com as skills perfeitas e monte squads sob demanda com qualidade premium.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-5">
          {featuredCategories.map((category, index) => (
            <Reveal key={category.title} delay={index * 90}>
              <article className="category-card" style={{ background: category.accent }}>
                <div className="category-card-inner">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-(--brand)/10 text-(--brand)">
                    <category.icon />
                  </div>
                  <h3 className="text-2xl font-semibold">{category.title}</h3>
                  <p className="text-(--muted-foreground) text-sm leading-relaxed flex-1">{category.desc}</p>
                  <span className="text-xs uppercase tracking-widest text-(--muted-foreground)">
                    Curadoria em tempo real · freelancers verificados
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Decole sua carreira */}
      <section className="container mx-auto px-6 pb-24" id="depoimentos">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <Reveal className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold">
              Decole sua carreira no Freelaverse
            </h2>
            <p className="text-(--muted-foreground) mt-2">
              Mostre seu portfólio, receba propostas certas e alcance novos horizontes com
              nossa comunidade e ferramentas feitas para impulsionar você.
            </p>
            <ul className="mt-4 space-y-2 text-(--muted-foreground)">
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Destaque de perfil e avaliações
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Chat moderno e propostas rápidas
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Pagamentos seguros
              </li>
            </ul>
            <Link href="/cadastro" className="mt-5 liquid-button">
              Começar como Profissional
            </Link>
          </Reveal>
          <div className="order-1 md:order-2">
            <LaunchIllustration />
          </div>
        </div>
      </section>

      {/* Baixe o aplicativo */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-bold">Tenha o Freelaverse no bolso</h2>
            <p className="text-(--muted-foreground) mt-2 max-w-xl">
              Acompanhe seus projetos e converse com clientes de qualquer lugar.
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <a className="liquid-button" href="https://apps.apple.com/app/id0000000000" target="_blank" rel="noreferrer">
                <FaApple className="text-xl" /> App Store
              </a>
              <a
                className="liquid-button liquid-button--ghost"
                href="https://play.google.com/store/apps/details?id=com.freelaverse.app"
                target="_blank"
                rel="noreferrer"
              >
                <FaGooglePlay className="text-xl" /> Google Play
              </a>
            </div>
          </Reveal>
          <div>
            <PhoneMockup />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Depoimentos */}
      <section className="container mx-auto px-6 pb-24">
        <Reveal className="text-center mb-10">
          <p className="pill">Histórias reais</p>
          <h2 className="text-3xl font-bold mt-4">Quem já faz parte do Freelaverse</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <Reveal key={item.author}>
              <div className="glass-liquid h-full">
                <div className="glass-liquid-inner flex flex-col gap-4 h-full">
                  <p className="text-lg leading-relaxed">“{item.quote}”</p>
                  <div>
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-(--muted-foreground) text-sm">{item.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Seção de papéis */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <article className="card p-6 hover:translate-y-[-2px] transition-transform">
            <div className="flex items-center gap-2 text-(--brand) font-semibold">
              <FiUsers /> Para Clientes
            </div>
            <h3 className="text-2xl font-bold mt-2">Encontre o especialista certo</h3>
            <ul className="mt-4 space-y-2 text-(--muted-foreground)">
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Publique projetos com briefing claro
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Compare propostas e portfólios
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Acompanhe entregas e pagamentos
              </li>
            </ul>
            <Link href="/cadastro" className="mt-5 liquid-button">
              Começar como Cliente
            </Link>
          </article>

          <article className="card p-6 hover:translate-y-[-2px] transition-transform">
            <div className="flex items-center gap-2 text-(--accent) font-semibold">
              <FiBriefcase /> Para Profissionais
            </div>
            <h3 className="text-2xl font-bold mt-2">Mostre seu talento e feche jobs</h3>
            <ul className="mt-4 space-y-2 text-(--muted-foreground)">
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Perfis com habilidades e certificações
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Propostas rápidas e chat moderno
              </li>
              <li className="inline-flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" /> Avaliações que impulsionam sua carreira
              </li>
            </ul>
            <Link href="/cadastro" className="mt-5 liquid-button">
              Começar como Profissional
            </Link>
          </article>
        </div>
      </section>

      <SectionDivider />

      {/* Chamada final */}
      <section className="container mx-auto px-6 pb-16">
        <div className="glass-liquid">
          <div className="glass-liquid-inner text-center space-y-4">
          <p className="pill mx-auto">Pronto para decolar?</p>
          <h2 className="text-3xl font-bold">Junte-se ao Freelaverse hoje mesmo</h2>
          <p className="text-(--muted-foreground) max-w-2xl mx-auto">
            Cadastre-se gratuitamente, publique um projeto ou crie seu perfil profissional. Nossa equipe acompanha
            cada etapa para garantir o melhor match entre ideias e talentos.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/cadastro" className="liquid-button">
              Começar agora
            </Link>
            <Link href="/login" className="liquid-button liquid-button--ghost">
              Falar com especialistas
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mt-4 border-t"
        style={{
          backgroundColor: "var(--footer)",
          color: "var(--footer-foreground)",
          borderColor: "color-mix(in oklab, var(--footer-foreground) 12%, transparent)",
        }}
      >
        <div className="container mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2">
              <Image src={logoSmall} alt="Freelaverse" width={28} height={28} />
              <span className="font-semibold">Freelaverse</span>
            </div>
            <p className="text-sm mt-3 text-(--muted-foreground)">
              Um universo de possibilidades para clientes e profissionais.
            </p>
            <div className="flex items-center gap-3 mt-4 text-(--muted-foreground)">
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Produto</h4>
            <ul className="space-y-2 text-sm text-(--muted-foreground)">
              <li><a href="#">Explorar serviços</a></li>
              <li><a href="#">Como funciona</a></li>
              <li><a href="#">Segurança</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm text-(--muted-foreground)">
              <li><a href="#">Sobre</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-(--muted-foreground)">
              <li><a href="#">Termos</a></li>
              <li><a href="#">Privacidade</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 pb-8 text-xs text-(--muted-foreground)">
          © {new Date().getFullYear()} Freelaverse. Todos os direitos reservados.
        </div>
      </footer>
    </main>
  );
}


