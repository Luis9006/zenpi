import { useState, useEffect, useRef } from "react";

const colors = {
  bg: "#0D0D1A",
  bgAlt: "#1A1A2E",
  purple: "#7B5CF5",
  purpleLight: "#A78BFA",
  mint: "#00D4AA",
  text: "#F4F4FF",
  textMuted: "#9CA3AF",
  cardBorder: "rgba(123, 92, 245, 0.25)",
  cardBg: "rgba(26, 26, 46, 0.8)",
};

const styles = {
  global: `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { background: ${colors.bg}; color: ${colors.text}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; overflow-x: hidden; }
    ::selection { background: ${colors.purple}; color: #fff; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${colors.bg}; }
    ::-webkit-scrollbar-thumb { background: ${colors.purple}; border-radius: 3px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(123,92,245,0.3); }
      50% { box-shadow: 0 0 40px rgba(123,92,245,0.6); }
    }

    .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .fade-up-delay-1 { transition-delay: 0.1s; }
    .fade-up-delay-2 { transition-delay: 0.2s; }
    .fade-up-delay-3 { transition-delay: 0.3s; }
    .fade-up-delay-4 { transition-delay: 0.4s; }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .mobile-menu-open { display: flex !important; }
      .wa-btn { bottom: 20px !important; right: 20px !important; padding: 16px !important; }
      .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
      .growth-system-grid { grid-template-columns: 1fr !important; }
      .growth-system-price { text-align: left !important; min-width: unset !important; }
    }
    @media (prefers-reduced-motion: reduce) {
      .fade-up { opacity: 1; transform: none; transition: none; }
      * { animation: none !important; }
    }
  `,
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function AnimatedSection({ children, className = "", style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className={`fade-up${visible ? " visible" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Soluciones", "Cómo trabajamos", "Método", "FAQ", "Contacto"];
  const anchors = ["soluciones", "como-trabajamos", "metodo", "faq", "contacto"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(13,13,26,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${colors.cardBorder}` : "none",
      transition: "all 0.3s ease",
      padding: "0 5%",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <a href="#hero" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: colors.purpleLight, letterSpacing: "-0.5px" }}>
            zen<span style={{ color: colors.mint }}>pi</span>
          </span>
        </a>

        <div className="hide-mobile" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l, i) => (
            <a key={l} href={`#${anchors[i]}`} style={{ color: colors.textMuted, textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = colors.text}
              onMouseLeave={e => e.target.style.color = colors.textMuted}>
              {l}
            </a>
          ))}
          <a href="#contacto" style={{
            background: colors.purple, color: "#fff", padding: "8px 20px", borderRadius: 8,
            textDecoration: "none", fontSize: 14, fontWeight: 600, transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = colors.purpleLight; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = colors.purple; e.target.style.transform = "translateY(0)"; }}>
            Hablemos
          </a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: colors.text, fontSize: 24, padding: 4 }}
          className="mobile-menu-open" aria-label="Menú">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: "rgba(13,13,26,0.98)", padding: "1rem 5% 1.5rem", borderTop: `1px solid ${colors.cardBorder}` }}>
          {links.map((l, i) => (
            <a key={l} href={`#${anchors[i]}`} onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: colors.text, textDecoration: "none", padding: "10px 0", fontSize: 16, borderBottom: `1px solid ${colors.cardBorder}` }}>
              {l}
            </a>
          ))}
          <a href="#contacto" onClick={() => setMenuOpen(false)} style={{
            display: "block", background: colors.purple, color: "#fff", padding: "12px 20px",
            borderRadius: 8, textDecoration: "none", fontSize: 15, fontWeight: 600,
            textAlign: "center", marginTop: 16,
          }}>Hablemos</a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ILLUSTRATION ─────────────────────────────────────────────────────
function ZenpiSystemCard() {
  const steps = [
    { label: "Atrae", sub: "Encuentra oportunidades", icon: "◎" },
    { label: "Convierte", sub: "Captura y organiza leads", icon: "◈" },
    { label: "Automatiza", sub: "Da seguimiento", icon: "◉" },
  ];
  return (
    <div aria-hidden="true" style={{
      position: "relative", width: "100%", maxWidth: 420,
      margin: "0 auto",
    }}>
      {/* Background glow orb */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 320, height: 320,
        background: `radial-gradient(circle, rgba(123,92,245,0.14) 0%, rgba(0,212,170,0.06) 60%, transparent 80%)`,
        borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Main card */}
      <div style={{
        position: "relative",
        background: "rgba(26,26,46,0.85)",
        border: `1px solid rgba(123,92,245,0.35)`,
        borderRadius: 20,
        padding: "28px 24px",
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 48px rgba(123,92,245,0.15), 0 2px 8px rgba(0,0,0,0.4)",
        animation: "float 5s ease-in-out infinite",
      }}>
        {/* Card header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.text, letterSpacing: 0.3 }}>Sistema Zenpi</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: colors.mint,
              boxShadow: `0 0 6px ${colors.mint}`,
              animation: "pulse 2.5s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 11, color: colors.mint, fontWeight: 600 }}>Flujo conectado</span>
          </div>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s.label}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "rgba(123,92,245,0.07)",
                border: `1px solid rgba(123,92,245,0.18)`,
                borderRadius: 12, padding: "14px 16px",
                animation: `fadeUp 0.6s ease ${0.1 + i * 0.15}s both`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: i === 0
                    ? "rgba(123,92,245,0.2)"
                    : i === 1
                      ? "rgba(99,102,241,0.2)"
                      : "rgba(0,212,170,0.15)",
                  border: `1px solid ${i === 0 ? "rgba(123,92,245,0.4)" : i === 1 ? "rgba(99,102,241,0.4)" : "rgba(0,212,170,0.3)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                  color: i === 0 ? colors.purpleLight : i === 1 ? "#818CF8" : colors.mint,
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: colors.textMuted }}>{s.sub}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ marginLeft: "auto", color: "rgba(123,92,245,0.5)", fontSize: 14 }}>→</div>
                )}
                {i === steps.length - 1 && (
                  <div style={{ marginLeft: "auto" }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", background: colors.mint,
                      boxShadow: `0 0 8px ${colors.mint}`,
                    }} />
                  </div>
                )}
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  width: 1, height: 12, margin: "0 auto",
                  background: `linear-gradient(to bottom, rgba(123,92,245,0.4), rgba(0,212,170,0.2))`,
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom label */}
        <div style={{
          marginTop: 20, paddingTop: 16,
          borderTop: "1px solid rgba(123,92,245,0.15)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: `linear-gradient(to right, ${colors.purple}, #6366F1, ${colors.mint})` }} />
          <span style={{ fontSize: 11, color: colors.textMuted, whiteSpace: "nowrap" }}>sistema conectado</span>
        </div>
      </div>
    </div>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "88vh", display: "flex", alignItems: "center",
      padding: "100px 5% 60px", position: "relative", overflow: "hidden",
      background: `radial-gradient(ellipse 70% 60% at 30% 20%, rgba(123,92,245,0.14) 0%, transparent 65%), ${colors.bg}`,
    }}>
      {/* Subtle bg orbs */}
      <div style={{ position: "absolute", top: "15%", left: "5%", width: 280, height: 280, background: "rgba(123,92,245,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 220, height: 220, background: "rgba(0,212,170,0.05)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

      {/* Two-column grid */}
      <div style={{
        maxWidth: 1180, margin: "0 auto", width: "100%",
        display: "grid",
        gridTemplateColumns: "55% 45%",
        gap: "40px 60px",
        alignItems: "center",
      }}
        className="hero-grid">
        {/* LEFT — content */}
        <div style={{ animation: "fadeUp 0.7s ease forwards" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(123,92,245,0.12)", border: `1px solid ${colors.cardBorder}`,
            borderRadius: 20, padding: "6px 16px", marginBottom: 28,
            animation: "pulse 3s ease-in-out infinite",
          }}>
            <span style={{ width: 6, height: 6, background: colors.mint, borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontSize: 13, color: colors.purpleLight, fontWeight: 500 }}>Growth, web y automatización</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(48px, 5vw, 68px)", fontWeight: 800,
            lineHeight: 1.06, letterSpacing: "-2px", marginBottom: 24,
          }}>
            <span style={{ color: colors.text, display: "block" }}>Más oportunidades.</span>
            <span style={{ color: colors.text, display: "block" }}>Mejor conversión.</span>
            <span style={{
              display: "block",
              background: `linear-gradient(135deg, ${colors.purple}, #6366F1, ${colors.mint})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Menos trabajo manual.</span>
          </h1>

          {/* Subcopy */}
          <p style={{
            fontSize: "clamp(16px, 1.6vw, 18px)", color: colors.textMuted,
            marginBottom: 36, maxWidth: 560, lineHeight: 1.7,
          }}>
            Conectamos estrategia, web y automatización para ayudarte a crecer con un sistema claro y fácil de operar.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#contacto" style={{
              background: `linear-gradient(135deg, ${colors.purple}, #5B3FD4)`,
              color: "#fff", padding: "14px 28px", borderRadius: 10,
              textDecoration: "none", fontSize: 15, fontWeight: 700,
              boxShadow: "0 4px 24px rgba(123,92,245,0.4)", transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(123,92,245,0.5)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(123,92,245,0.4)"; }}>
              Cuéntanos qué quieres mejorar →
            </a>
            <a href="#soluciones" style={{
              background: "transparent", color: colors.textMuted,
              padding: "14px 24px", borderRadius: 10, textDecoration: "none",
              fontSize: 15, fontWeight: 600, border: `1px solid ${colors.cardBorder}`,
              transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = colors.purpleLight; e.target.style.color = colors.purpleLight; }}
              onMouseLeave={e => { e.target.style.borderColor = colors.cardBorder; e.target.style.color = colors.textMuted; }}>
              Ver soluciones
            </a>
          </div>
        </div>

        {/* RIGHT — illustration */}
        <div style={{ animation: "fadeUp 0.9s ease 0.2s forwards", opacity: 0 }}>
          <ZenpiSystemCard />
        </div>
      </div>


    </section>
  );
}

// ─── QUÉ ES ZENPI ──────────────────────────────────────────────────────────
function QueEs() {
  const pillars = [
    {
      icon: "📈",
      title: "Growth Marketing",
      claim: "Encuentra dónde crecer y qué priorizar.",
      desc: "Analizamos tu negocio, clientes, canales y recorrido de compra para identificar oportunidades de adquisición, conversión y crecimiento que realmente vale la pena trabajar.",
    },
    {
      icon: "🌐",
      title: "Web & Conversión",
      claim: "Convierte atención en oportunidades.",
      desc: "Creamos sitios y landing pages alrededor de una acción concreta: captar contactos, vender, agendar o convertir mejor el tráfico que ya tienes.",
    },
    {
      icon: "⚡",
      title: "Automatización & IA",
      claim: "Da seguimiento sin sumar trabajo manual.",
      desc: "Conectamos formularios, CRM, email, WhatsApp y herramientas de IA para organizar oportunidades, responder mejor y reducir tareas repetitivas.",
    },
  ];

  return (
    <section id="que-es" style={{ padding: "100px 5%", background: colors.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Qué es Zenpi</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Crecimiento conectado, no herramientas sueltas
          </h2>
          <p style={{ fontSize: 18, color: colors.textMuted, maxWidth: 580, margin: "0 auto" }}>
            No necesitas sumar herramientas porque sí. Identificamos qué está frenando tu crecimiento y trabajamos las piezas necesarias para resolverlo: estrategia, web, conversión, CRM y automatización.
          </p>
        </AnimatedSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {pillars.map((p, i) => (
            <AnimatedSection key={p.title} className={`fade-up-delay-${i + 1}`}>
              <div style={{
                background: colors.cardBg, border: `1px solid ${colors.cardBorder}`,
                borderRadius: 16, padding: "36px 28px",
                transition: "all 0.3s ease", cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.purple; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.cardBorder; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: colors.text }}>{p.title}</h3>
                <p style={{ fontSize: 14, fontWeight: 600, color: colors.mint, marginBottom: 12 }}>{p.claim}</p>
                <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICIOS ─────────────────────────────────────────────────────────────
// Precios centralizados — un solo lugar para actualizar
const prices = {
  growth:   { colombia: "Desde $1.800.000 COP", international: "Desde US$600" },
  web:      { colombia: "Desde $1.500.000 COP", international: "Desde US$500" },
  auto:     { colombia: "Desde $1.500.000 COP", international: "Desde US$500" },
  system:   { colombia: "Desde $3.500.000 COP", international: "Desde US$1.200" },
  partner:  { colombia: "Desde $1.800.000 COP / mes", international: "Desde US$600 / mes" },
};

function Servicios({ market, setMarket }) {

  const servicios = [
    {
      key: "growth",
      name: "Growth Marketing",
      tag: null,
      priceNote: "Estrategia y prioridades para identificar dónde crecer y qué trabajar primero.",
      desc: "Para negocios que necesitan claridad sobre dónde crecer y qué acciones priorizar.",
      features: [
        "Diagnóstico de crecimiento",
        "Audiencia y recorrido del cliente",
        "Estrategia de adquisición",
        "SEO y oportunidades de búsqueda",
        "Estrategia de contenidos y campañas",
        "Funnel y conversión",
        "Métricas, experimentos y prioridades",
      ],
      cta: "Quiero trabajar Growth",
    },
    {
      key: "web",
      name: "Web & Conversión",
      tag: "Más solicitado",
      priceNote: "Landing pages y experiencias digitales orientadas a conversión.",
      desc: "Para negocios que necesitan convertir mejor la atención que ya están generando.",
      features: [
        "Landing pages",
        "Sitios web orientados a conversión",
        "Arquitectura y recorrido del usuario",
        "Formularios y captación de leads",
        "Agendamiento",
        "Mensajes y llamadas a la acción",
        "Optimización de conversión",
      ],
      cta: "Quiero mejorar mi conversión",
    },
    {
      key: "auto",
      name: "Automatización & IA",
      tag: null,
      priceNote: "CRM, seguimiento, integraciones y automatización de procesos.",
      desc: "Para negocios que quieren organizar sus oportunidades y reducir tareas manuales.",
      features: [
        "Configuración de CRM",
        "Formularios y captura de leads",
        "Automatización de email y seguimiento",
        "WhatsApp Business y flujos",
        "Chatbots",
        "Integraciones",
        "Workflows y tareas automatizadas",
      ],
      cta: "Quiero automatizar",
    },
  ];

  const btnBase = {
    padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
    cursor: "pointer", border: "none", transition: "all 0.2s",
  };

  return (
    <section id="soluciones" style={{ padding: "100px 5%", background: colors.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Servicios</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Empieza por lo que necesitas
          </h2>
          <p style={{ fontSize: 18, color: colors.textMuted, maxWidth: 520, margin: "0 auto 32px" }}>
            Puedes resolver una necesidad puntual o combinar varias capacidades para construir un sistema de crecimiento.
          </p>

          {/* Market selector */}
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>Precios para:</span>
            <div style={{
              display: "inline-flex", background: "rgba(255,255,255,0.04)",
              border: `1px solid ${colors.cardBorder}`, borderRadius: 10, padding: 4, gap: 4,
            }} role="group" aria-label="Seleccionar mercado">
              {[["colombia", "Colombia"], ["international", "Internacional"]].map(([val, label]) => (
                <button key={val} onClick={() => setMarket(val)}
                  aria-pressed={market === val}
                  style={{
                    ...btnBase,
                    background: market === val ? colors.purple : "transparent",
                    color: market === val ? "#fff" : colors.textMuted,
                    boxShadow: market === val ? "0 2px 12px rgba(123,92,245,0.35)" : "none",
                  }}
                  onMouseEnter={e => { if (market !== val) e.target.style.color = colors.text; }}
                  onMouseLeave={e => { if (market !== val) e.target.style.color = colors.textMuted; }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {servicios.map((s, i) => (
            <AnimatedSection key={s.name} className={`fade-up-delay-${i + 1}`}>
              <div style={{
                background: s.tag ? `linear-gradient(160deg, rgba(123,92,245,0.15), rgba(26,26,46,0.9))` : colors.cardBg,
                border: s.tag ? `1px solid ${colors.purple}` : `1px solid ${colors.cardBorder}`,
                borderRadius: 16, padding: "36px 28px", height: "100%",
                display: "flex", flexDirection: "column", position: "relative",
                transition: "transform 0.3s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {s.tag && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.mint})`,
                    color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 18px", borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}>{s.tag}</div>
                )}
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: s.tag ? colors.purpleLight : colors.text }}>{s.name}</h3>
                  {/* Price */}
                  <div style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, color: colors.text, marginBottom: 4, letterSpacing: "-0.5px" }}>
                    {prices[s.key][market]}
                  </div>
                  <p style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16, lineHeight: 1.5 }}>{s.priceNote}</p>
                  <div style={{ width: "100%", height: 1, background: colors.cardBorder, marginBottom: 16 }} />
                  <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 20, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
                  {s.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10, fontSize: 14, color: colors.textMuted }}>
                      <span style={{ color: colors.mint, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contacto" style={{
                  display: "block", textAlign: "center",
                  background: s.tag ? `linear-gradient(135deg, ${colors.purple}, #5B3FD4)` : "transparent",
                  color: s.tag ? "#fff" : colors.purpleLight,
                  border: s.tag ? "none" : `1px solid ${colors.purple}`,
                  padding: "12px 24px", borderRadius: 10,
                  textDecoration: "none", fontSize: 15, fontWeight: 700,
                  transition: "all 0.25s",
                }}
                  onMouseEnter={e => { e.target.style.opacity = "0.85"; e.target.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }}>
                  {s.cta}
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Price note */}
        <AnimatedSection style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 14, color: colors.textMuted, lineHeight: 1.7 }}>
            Precios de referencia. La propuesta final depende del alcance y las necesidades del proyecto.
          </p>
          <p style={{ fontSize: 13, color: "rgba(156,163,175,0.6)", marginTop: 6, lineHeight: 1.6 }}>
            Licencias, pauta, APIs, hosting, WhatsApp API y herramientas de terceros se cotizan por separado cuando sean necesarias.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── FLEXIBLE + GROWTH SYSTEM + GROWTH PARTNER ─────────────────────────────
function FlexibleInner({ market = "colombia" }) {
  const ejemplos = [
    { necesidad: "Necesito saber dónde crecer", solucion: "Growth Marketing" },
    { necesidad: "Ya tengo oportunidades, pero el seguimiento es manual", solucion: "Automatización & IA" },
    { necesidad: "Necesito generar oportunidades y organizar todo el proceso", solucion: "Growth + Web + Automatización" },
  ];

  const partnerFeatures = [
    "Análisis y prioridades",
    "Revisión de funnel y conversión",
    "Oportunidades de SEO y contenido",
    "Experimentos",
    "Optimización de automatizaciones",
    "Reporting y sesión estratégica",
  ];

  return (
    <section style={{ padding: "80px 5%", background: colors.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Flexible por diseño</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Una necesidad puntual o un sistema completo
          </h2>
          <p style={{ fontSize: 17, color: colors.textMuted, maxWidth: 600, margin: "0 auto" }}>
            No tienes que contratar todo Zenpi. Podemos trabajar solo Growth, mejorar tu sitio o automatizar un proceso específico. Cuando el problema conecta varias áreas, construimos un sistema alrededor de un mismo objetivo.
          </p>
        </AnimatedSection>

        {/* Examples */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, marginBottom: 48 }}>
          {ejemplos.map((e, i) => (
            <AnimatedSection key={i} className={`fade-up-delay-${i + 1}`}>
              <div style={{
                background: colors.cardBg, border: `1px solid ${colors.cardBorder}`,
                borderRadius: 14, padding: "28px 24px", transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = colors.purple; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = colors.cardBorder; e.currentTarget.style.transform = "translateY(0)"; }}>
                <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 12, lineHeight: 1.6 }}>"{e.necesidad}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: colors.mint, fontSize: 16 }}>→</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: colors.purpleLight }}>{e.solucion}</span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* ATRAER → flow */}
        <AnimatedSection style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {["ATRAER", "CONVERTIR", "AUTOMATIZAR", "OPTIMIZAR"].map((step, i, arr) => (
              <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  background: `rgba(123,92,245,0.12)`, border: `1px solid ${colors.cardBorder}`,
                  borderRadius: 8, padding: "8px 18px",
                  fontSize: 13, fontWeight: 700, color: colors.purpleLight, letterSpacing: 1,
                }}>{step}</div>
                {i < arr.length - 1 && <span style={{ color: colors.mint, fontSize: 18, fontWeight: 700 }}>→</span>}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* GROWTH SYSTEM — horizontal callout */}
        <AnimatedSection style={{ marginBottom: 24 }}>
          <div style={{
            background: `linear-gradient(135deg, rgba(123,92,245,0.12), rgba(0,212,170,0.06))`,
            border: `1px solid rgba(123,92,245,0.4)`,
            borderRadius: 20, padding: "36px 40px",
            display: "grid", gridTemplateColumns: "1fr auto",
            gap: "24px 48px", alignItems: "center",
          }}
            className="growth-system-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.mint, letterSpacing: 1.5, textTransform: "uppercase" }}>Sistema combinado</span>
              </div>
              <h3 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: colors.text, marginBottom: 6, letterSpacing: "-0.5px" }}>
                Growth System
              </h3>
              <p style={{ fontSize: 14, color: colors.purpleLight, fontWeight: 600, marginBottom: 12 }}>
                Growth + conversión + automatización alrededor de un mismo objetivo.
              </p>
              <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.7, maxWidth: 520 }}>
                Para negocios que necesitan conectar varias piezas: atraer oportunidades, captarlas, organizarlas y automatizar su seguimiento.
              </p>
            </div>
            <div style={{ textAlign: "right", minWidth: 180 }} className="growth-system-price">
              <div style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 800, color: colors.text, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
                {prices.system[market]}
              </div>
              <a href="#contacto" style={{
                display: "inline-block", marginTop: 16,
                background: `linear-gradient(135deg, ${colors.purple}, #5B3FD4)`,
                color: "#fff", padding: "12px 24px", borderRadius: 10,
                textDecoration: "none", fontSize: 14, fontWeight: 700,
                boxShadow: "0 4px 16px rgba(123,92,245,0.35)", transition: "all 0.25s",
                whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(123,92,245,0.5)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 16px rgba(123,92,245,0.35)"; }}>
                Cuéntanos qué quieres mejorar →
              </a>
            </div>
          </div>
        </AnimatedSection>

        {/* GROWTH PARTNER */}
        <AnimatedSection>
          <div style={{
            background: colors.cardBg,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: 20, padding: "36px 40px",
            display: "grid", gridTemplateColumns: "1fr auto",
            gap: "24px 48px", alignItems: "start",
          }}
            className="growth-system-grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: colors.mint, boxShadow: `0 0 6px ${colors.mint}` }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: colors.mint, letterSpacing: 1.5, textTransform: "uppercase" }}>Recurrente</span>
              </div>
              <h3 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: colors.text, marginBottom: 6, letterSpacing: "-0.5px" }}>
                Growth Partner
              </h3>
              <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.7, marginBottom: 20, maxWidth: 480 }}>
                Acompañamiento continuo para analizar, priorizar, experimentar y optimizar el sistema de crecimiento.
              </p>
              <ul style={{ listStyle: "none" }}>
                {partnerFeatures.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 14, color: colors.textMuted }}>
                    <span style={{ color: colors.mint, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ textAlign: "right", minWidth: 180 }} className="growth-system-price">
              <div style={{ fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 800, color: colors.text, letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>
                {prices.partner[market]}
              </div>
              <a href="#contacto" style={{
                display: "inline-block", marginTop: 16,
                background: "transparent", color: colors.purpleLight,
                padding: "12px 24px", borderRadius: 10,
                border: `1px solid ${colors.purple}`,
                textDecoration: "none", fontSize: 14, fontWeight: 700,
                transition: "all 0.25s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.target.style.background = "rgba(123,92,245,0.1)"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.transform = "translateY(0)"; }}>
                Hablemos →
              </a>
            </div>
          </div>
        </AnimatedSection>


      </div>
    </section>
  );
}

// ─── CÓMO TRABAJAMOS ───────────────────────────────────────────────────────
function ComoTrabajamos() {
  return (
    <section id="como-trabajamos" style={{ padding: "80px 5%", background: colors.bg }}>
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
        <AnimatedSection>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Cómo trabajamos</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 20, lineHeight: 1.2 }}>
            <span style={{ display: "block", color: colors.text }}>No empezamos recomendando herramientas.</span>
            <span style={{ display: "block", background: `linear-gradient(135deg, ${colors.purple}, ${colors.mint})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Empezamos entendiendo el problema.
            </span>
          </h2>
          <p style={{ fontSize: 17, color: colors.textMuted, lineHeight: 1.75, maxWidth: 620, margin: "0 auto" }}>
            Revisamos qué quieres lograr, qué está funcionando y dónde existe la mayor oportunidad. A partir de ahí definimos si necesitas una estrategia, una pieza puntual o varias soluciones conectadas.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── MÉTODO ────────────────────────────────────────────────────────────────
function Metodo() {
  const etapas = [
    { n: "01", name: "Entender", desc: "Revisamos tu negocio, objetivos, clientes, canales y lo que ya tienes funcionando." },
    { n: "02", name: "Priorizar", desc: "Identificamos qué está frenando el crecimiento y dónde existe una oportunidad real de mejora." },
    { n: "03", name: "Construir", desc: "Creamos únicamente las piezas necesarias: estrategia, páginas, contenido, CRM o automatizaciones." },
    { n: "04", name: "Conectar", desc: "Integramos los sistemas necesarios para que la información y el seguimiento fluyan mejor." },
    { n: "05", name: "Optimizar", desc: "Medimos lo que ocurre, aprendemos y definimos qué mejorar después." },
  ];

  return (
    <section id="metodo" style={{ padding: "100px 5%", background: colors.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>El proceso</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            El Método Zenpi
          </h2>
          <p style={{ fontSize: 18, color: colors.textMuted, maxWidth: 480, margin: "0 auto" }}>
            De una necesidad concreta a un sistema que puede crecer contigo.
          </p>
        </AnimatedSection>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {etapas.map((e, i) => (
            <AnimatedSection key={e.n} className={`fade-up-delay-${(i % 4) + 1}`}>
              <div style={{
                display: "grid", gridTemplateColumns: "80px 1fr",
                gap: "0 32px", padding: "32px 0",
                borderBottom: i < etapas.length - 1 ? `1px solid ${colors.cardBorder}` : "none",
                alignItems: "start",
              }}>
                <div style={{ textAlign: "center", paddingTop: 4 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: `rgba(123,92,245,0.12)`, border: `1px solid ${colors.cardBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: colors.purpleLight, margin: "0 auto",
                  }}>{e.n}</div>
                  {i < etapas.length - 1 && (
                    <div style={{ width: 1, height: 32, background: colors.cardBorder, margin: "8px auto 0" }} />
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: colors.text }}>{e.name}</h3>
                  <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.7 }}>{e.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "¿Qué significa Growth Marketing en Zenpi?", a: "Growth Marketing significa encontrar y priorizar oportunidades para atraer mejores prospectos, convertirlos y aprender qué funciona. Según el negocio puede incluir estrategia, SEO, contenido, conversión, experimentos y medición." },
    { q: "¿Puedo contratar solo automatización o solo Growth Marketing?", a: "Sí. No necesitas contratar todo el ecosistema Zenpi. Podemos trabajar una necesidad puntual o combinar varias capacidades cuando exista una razón clara para hacerlo." },
    { q: "¿Cómo sé qué servicio necesito?", a: "No tienes que saberlo antes de hablar con nosotros. Primero entendemos qué quieres mejorar y revisamos qué está frenando el resultado. Después recomendamos el punto de partida más lógico." },
    { q: "¿Necesito cambiar las herramientas que ya uso?", a: "No necesariamente. Primero revisamos lo que ya tienes. Si una herramienta funciona, preferimos aprovecharla antes de añadir otra." },
    { q: "¿Pueden trabajar sobre mi sitio web o CRM actual?", a: "Sí. Podemos mejorar sistemas existentes o construir algo nuevo cuando realmente sea necesario." },
    { q: "¿Trabajan con cualquier tipo de negocio?", a: "Trabajamos especialmente bien con negocios de servicios, profesionales y marcas en crecimiento que quieren generar mejores oportunidades, mejorar su conversión o reducir procesos manuales." },
    { q: "¿Cuánto tarda un proyecto?", a: "El tiempo depende del problema y del alcance. Antes de comenzar definimos entregables, responsabilidades y cronograma para que sepas exactamente qué esperar." },
    { q: "¿Puedo empezar con algo pequeño y ampliar después?", a: "Sí. Preferimos empezar por la prioridad con mayor impacto y ampliar el sistema cuando los resultados y las necesidades lo justifiquen." },
    { q: "¿Hacen integraciones con herramientas que ya uso?", a: "Sí. Podemos conectar CRM, formularios, email, WhatsApp, calendarios y otras herramientas cuando aporten valor al proceso." },
  ];

  return (
    <section id="faq" style={{ padding: "100px 5%", background: colors.bg }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Preguntas frecuentes</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px" }}>
            Todo lo que necesitas saber
          </h2>
        </AnimatedSection>

        <div>
          {faqs.map((f, i) => (
            <AnimatedSection key={i}>
              <div style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "22px 0", textAlign: "left", gap: 16,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: colors.text, lineHeight: 1.4 }}>{f.q}</span>
                  <span style={{
                    color: colors.purpleLight, fontSize: 22, lineHeight: 1, flexShrink: 0,
                    transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.25s ease",
                  }}>+</span>
                </button>
                <div style={{
                  overflow: "hidden", maxHeight: open === i ? 300 : 0,
                  transition: "max-height 0.35s ease",
                }}>
                  <p style={{ fontSize: 15, color: colors.textMuted, lineHeight: 1.75, paddingBottom: 22 }}>{f.a}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACTO ──────────────────────────────────────────────────────────────
function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", sitio: "", servicio: "", mejorar: "", contacto: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Tu nombre es necesario";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email válido, por favor";
    if (!form.mejorar.trim()) e.mejorar = "Cuéntanos qué quieres mejorar";
    if (!form.contacto) e.contacto = "Selecciona cómo prefieres que te contactemos";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  const inputStyle = (field) => ({
    width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${errors[field] ? "#F87171" : colors.cardBorder}`,
    borderRadius: 10, padding: "13px 16px", color: colors.text, fontSize: 15,
    outline: "none", transition: "border-color 0.2s", fontFamily: "inherit",
  });

  const labelStyle = { display: "block", fontSize: 13, color: colors.textMuted, marginBottom: 6, fontWeight: 500 };

  if (sent) return (
    <section id="contacto" style={{ padding: "100px 5%", background: colors.bgAlt, textAlign: "center" }}>
      <div style={{ maxWidth: 500, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>¡Mensaje enviado!</h2>
        <p style={{ fontSize: 17, color: colors.textMuted, lineHeight: 1.7 }}>
          Gracias, <strong style={{ color: colors.purpleLight }}>{form.nombre}</strong>. Nos pondremos en contacto contigo en menos de 24 horas.
        </p>
      </div>
    </section>
  );

  return (
    <section id="contacto" style={{ padding: "100px 5%", background: colors.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "start" }}>
        <AnimatedSection>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Contacto</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 20 }}>
            Hablemos de lo que quieres mejorar
          </h2>
          <p style={{ fontSize: 16, color: colors.textMuted, lineHeight: 1.75, marginBottom: 36 }}>
            No necesitas saber qué servicio contratar. Cuéntanos qué está funcionando, qué te está frenando o qué quieres mejorar y te ayudaremos a identificar el mejor punto de partida.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              ["💬", "Primera conversación sin compromiso", "Entendemos tu necesidad antes de recomendar una solución."],
              ["⚡", "Proceso claro", "Alcance, tiempos y próximos pasos definidos."],
              ["🔒", "Tu información es tuya", "Sin spam ni venta de datos."],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, marginTop: 2 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 13, color: colors.textMuted }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="fade-up-delay-2">
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={labelStyle}>Nombre *</label>
              <input type="text" placeholder="Tu nombre" value={form.nombre} style={inputStyle("nombre")}
                onChange={e => { setForm({ ...form, nombre: e.target.value }); setErrors({ ...errors, nombre: "" }); }}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = errors.nombre ? "#F87171" : colors.cardBorder} />
              {errors.nombre && <p style={{ fontSize: 12, color: "#F87171", marginTop: 4 }}>{errors.nombre}</p>}
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" placeholder="tu@email.com" value={form.email} style={inputStyle("email")}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = errors.email ? "#F87171" : colors.cardBorder} />
              {errors.email && <p style={{ fontSize: 12, color: "#F87171", marginTop: 4 }}>{errors.email}</p>}
            </div>
            <div>
              <label style={labelStyle}>¿Tienes un sitio web actualmente?</label>
              <input type="text" placeholder="URL o 'No tengo'" value={form.sitio} style={inputStyle("sitio")}
                onChange={e => setForm({ ...form, sitio: e.target.value })}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = colors.cardBorder} />
            </div>
            <div>
              <label style={labelStyle}>¿En qué necesitas ayuda?</label>
              <select value={form.servicio} style={{ ...inputStyle("servicio"), cursor: "pointer" }}
                onChange={e => setForm({ ...form, servicio: e.target.value })}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = colors.cardBorder}>
                <option value="" disabled>Selecciona una opción</option>
                <option value="growth">Growth Marketing</option>
                <option value="web">Web & Conversión</option>
                <option value="automatizacion">Automatización & IA</option>
                <option value="combinar">Quiero combinar varias soluciones</option>
                <option value="noseguro">No estoy seguro</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>¿Qué quieres mejorar? *</label>
              <textarea placeholder="Ej: conseguir mejores oportunidades, mejorar mi web, organizar mis leads, automatizar seguimiento o entender qué está funcionando…" value={form.mejorar} style={{ ...inputStyle("mejorar"), resize: "vertical", minHeight: 100 }}
                onChange={e => { setForm({ ...form, mejorar: e.target.value }); setErrors({ ...errors, mejorar: "" }); }}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = errors.mejorar ? "#F87171" : colors.cardBorder} />
              {errors.mejorar && <p style={{ fontSize: 12, color: "#F87171", marginTop: 4 }}>{errors.mejorar}</p>}
            </div>
            <div>
              <label style={labelStyle}>¿Cómo prefieres ser contactado? *</label>
              <select value={form.contacto} style={{ ...inputStyle("contacto"), cursor: "pointer" }}
                onChange={e => { setForm({ ...form, contacto: e.target.value }); setErrors({ ...errors, contacto: "" }); }}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = errors.contacto ? "#F87171" : colors.cardBorder}>
                <option value="" disabled>Selecciona una opción</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="videollamada">Videollamada</option>
              </select>
              {errors.contacto && <p style={{ fontSize: 12, color: "#F87171", marginTop: 4 }}>{errors.contacto}</p>}
            </div>
            <button type="submit" disabled={loading} style={{
              background: `linear-gradient(135deg, ${colors.purple}, #5B3FD4)`,
              color: "#fff", border: "none", padding: "15px 28px", borderRadius: 10,
              fontSize: 16, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              boxShadow: "0 4px 20px rgba(123,92,245,0.35)", transition: "all 0.25s", marginTop: 4,
            }}
              onMouseEnter={e => { if (!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 28px rgba(123,92,245,0.5)"; } }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(123,92,245,0.35)"; }}>
              {loading ? "Enviando..." : "Enviar mensaje →"}
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#080812", padding: "60px 5% 32px", borderTop: `1px solid ${colors.cardBorder}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
          <div>
            <span style={{ fontSize: 24, fontWeight: 800, color: colors.purpleLight }}>
              zen<span style={{ color: colors.mint }}>pi</span>
            </span>
            <p style={{ fontSize: 14, color: colors.textMuted, marginTop: 12, lineHeight: 1.7, maxWidth: 220 }}>
              Growth Marketing, conversión y automatización para negocios de servicios y marcas en crecimiento.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Servicios</p>
            {["Growth Marketing", "Web & Conversión", "Automatización & IA"].map(s => (
              <a key={s} href="#soluciones" style={{ display: "block", color: colors.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = colors.text}
                onMouseLeave={e => e.target.style.color = colors.textMuted}>{s}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Navegación</p>
            {[["Qué es Zenpi", "que-es"], ["Cómo trabajamos", "como-trabajamos"], ["El Método", "metodo"], ["FAQ", "faq"], ["Contacto", "contacto"]].map(([l, a]) => (
              <a key={l} href={`#${a}`} style={{ display: "block", color: colors.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = colors.text}
                onMouseLeave={e => e.target.style.color = colors.textMuted}>{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Síguenos</p>
            {[["LinkedIn", "https://linkedin.com/company/zenpi"], ["Instagram", "https://instagram.com/zenpi.co"], ["WhatsApp", "https://wa.me/573180223809?text=Hola%20Zenpi%20%F0%9F%91%8B%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios."]].map(([red, url]) => (
              <a key={red} href={url} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", color: colors.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = colors.purpleLight}
                onMouseLeave={e => e.target.style.color = colors.textMuted}>{red}</a>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.cardBorder}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: colors.textMuted }}>© {year} Zenpi. Todos los derechos reservados.</p>
          <p style={{ fontSize: 13, color: colors.textMuted }}>IA que piensa. Sistemas que fluyen.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── WHATSAPP BUTTON ───────────────────────────────────────────────────────
function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const phone = "573180223809";
  const message = encodeURIComponent("Hola Zenpi 👋 Quiero más información sobre sus servicios.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="wa-btn"
      style={{
        position: "fixed", bottom: 28, right: 28, zIndex: 200,
        display: "flex", alignItems: "center", gap: 10,
        background: "#25D366", borderRadius: 50,
        padding: hovered ? "14px 20px 14px 16px" : "14px",
        boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
        textDecoration: "none", transition: "all 0.3s ease",
        overflow: "hidden", whiteSpace: "nowrap",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span style={{
        color: "#fff", fontWeight: 700, fontSize: 14,
        maxWidth: hovered ? 160 : 0, opacity: hovered ? 1 : 0,
        transition: "all 0.3s ease", overflow: "hidden",
      }}>¡Escríbenos!</span>
    </a>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [market, setMarket] = useState("colombia");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles.global;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <QueEs />
        <Servicios market={market} setMarket={setMarket} />
        <FlexibleInner market={market} />
        <ComoTrabajamos />
        <Metodo />
        <FAQ />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
