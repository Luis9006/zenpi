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

  const links = ["Qué es", "Servicios", "Método", "FAQ", "Contacto"];
  const anchors = ["que-es", "servicios", "metodo", "faq", "contacto"];

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

        {/* Desktop links */}
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
            Pedir demo
          </a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: colors.text, fontSize: 24, padding: 4 }}
          className="mobile-menu-open" aria-label="Menú">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
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
          }}>Pedir demo</a>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "100px 5% 60px", textAlign: "center", position: "relative", overflow: "hidden",
      background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(123,92,245,0.18) 0%, transparent 70%), ${colors.bg}`,
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, background: "rgba(123,92,245,0.06)", borderRadius: "50%", filter: "blur(80px)", animation: "float 6s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 250, height: 250, background: "rgba(0,212,170,0.06)", borderRadius: "50%", filter: "blur(80px)", animation: "float 8s ease-in-out infinite 2s" }} />

      <div style={{ maxWidth: 760, position: "relative", animation: "fadeUp 0.8s ease forwards" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(123,92,245,0.12)", border: `1px solid ${colors.cardBorder}`,
          borderRadius: 20, padding: "6px 16px", marginBottom: 28,
          animation: "pulse 3s ease-in-out infinite",
        }}>
          <span style={{ width: 6, height: 6, background: colors.mint, borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: colors.purpleLight, fontWeight: 500 }}>IA aplicada para tu negocio</span>
        </div>

        <h1 style={{
          fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 800, lineHeight: 1.1,
          marginBottom: 24, letterSpacing: "-2px",
        }}>
          Tu negocio trabajando{" "}
          <span style={{ background: `linear-gradient(135deg, ${colors.purple}, ${colors.mint})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            solo, mientras tú creces
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: colors.textMuted, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Sitios web, chatbots y automatizaciones con IA para emprendedores que quieren vender sin complicaciones.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#contacto" style={{
            background: `linear-gradient(135deg, ${colors.purple}, #5B3FD4)`,
            color: "#fff", padding: "14px 32px", borderRadius: 10,
            textDecoration: "none", fontSize: 16, fontWeight: 700,
            boxShadow: "0 4px 24px rgba(123,92,245,0.4)", transition: "all 0.25s",
            animation: "glow 3s ease-in-out infinite",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(123,92,245,0.5)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(123,92,245,0.4)"; }}>
            Pedir demo gratis →
          </a>
          <a href="#servicios" style={{
            background: "transparent", color: colors.text,
            padding: "14px 32px", borderRadius: 10, textDecoration: "none",
            fontSize: 16, fontWeight: 600, border: `1px solid ${colors.cardBorder}`,
            transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = colors.purpleLight; e.target.style.color = colors.purpleLight; }}
            onMouseLeave={e => { e.target.style.borderColor = colors.cardBorder; e.target.style.color = colors.text; }}>
            Ver paquetes
          </a>
        </div>

        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 56, flexWrap: "wrap" }}>
          {[["+50", "negocios digitalizados"], ["48h", "tiempo de entrega"], ["3 paquetes", "para cada etapa"]].map(([n, l]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: colors.purpleLight }}>{n}</div>
              <div style={{ fontSize: 13, color: colors.textMuted }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── QUÉ ES ────────────────────────────────────────────────────────────────
function QueEs() {
  const pillars = [
    { icon: "🧠", title: "Sistemas que piensan", desc: "No solo diseñamos sitios: construimos flujos con IA que captan leads, responden preguntas y agendan citas automáticamente." },
    { icon: "⚡", title: "IA sin fricción", desc: "Cada automatización que integramos puede explicarse en una frase. Si tú no lo entiendes, no lo usas — y si no lo usas, no te sirve." },
    { icon: "🤝", title: "Enfoque humano", desc: "Trabajamos contigo desde la claridad de tu meta hasta la entrega del sistema. Sin tecnicismos. Con guía, soporte y autonomía real." },
  ];

  return (
    <section id="que-es" style={{ padding: "100px 5%", background: colors.bgAlt }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Qué es Zenpi</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            No somos solo diseñadores
          </h2>
          <p style={{ fontSize: 18, color: colors.textMuted, maxWidth: 520, margin: "0 auto" }}>
            Somos constructores de sistemas simples que trabajan por ti — incluso cuando duermes.
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
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: colors.text }}>{p.title}</h3>
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
function Servicios() {
  const paquetes = [
    {
      name: "Zenpi Start", price: "$250", tag: null,
      desc: "Para emprendedores que quieren lanzar rápido y bien.",
      features: ["Landing de 1 página", "Chatbot básico de captura", "Formulario → email automático", "Guía de uso incluida", "Entrega en 48–72h"],
    },
    {
      name: "Zenpi Web", price: "$450–$600", tag: "Más popular",
      desc: "Para negocios listos para convertir visitas en clientes.",
      features: ["Sitio completo hasta 5 secciones", "Chatbot personalizado (FAQ o captación)", "Automatización de seguimiento", "Agendamiento integrado", "Soporte 15 días post entrega"],
    },
    {
      name: "Zenpi Flow", price: "$750–$900", tag: null,
      desc: "Para negocios que quieren escalar con sistemas completos.",
      features: ["Web + chatbot + embudo completo", "Email de bienvenida + agendamiento", "Integración con CRM (HubSpot / Google Sheets)", "SEO básico optimizado", "Soporte 30 días post entrega"],
    },
  ];

  return (
    <section id="servicios" style={{ padding: "100px 5%", background: colors.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 13, color: colors.mint, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Paquetes</p>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
            Elige tu punto de partida
          </h2>
          <p style={{ fontSize: 18, color: colors.textMuted }}>Sin letra pequeña. Sin costos ocultos.</p>
        </AnimatedSection>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {paquetes.map((p, i) => (
            <AnimatedSection key={p.name} className={`fade-up-delay-${i + 1}`}>
              <div style={{
                background: p.tag ? `linear-gradient(160deg, rgba(123,92,245,0.15), rgba(26,26,46,0.9))` : colors.cardBg,
                border: p.tag ? `1px solid ${colors.purple}` : `1px solid ${colors.cardBorder}`,
                borderRadius: 16, padding: "36px 28px", height: "100%",
                display: "flex", flexDirection: "column", position: "relative",
                transition: "transform 0.3s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                {p.tag && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${colors.purple}, ${colors.mint})`,
                    color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 18px", borderRadius: 20,
                    whiteSpace: "nowrap",
                  }}>{p.tag}</div>
                )}
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: p.tag ? colors.purpleLight : colors.text }}>{p.name}</h3>
                  <div style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, color: colors.text, marginBottom: 8 }}>{p.price}</div>
                  <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 28, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 32, flex: 1 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12, fontSize: 14, color: colors.textMuted }}>
                      <span style={{ color: colors.mint, fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contacto" style={{
                  display: "block", textAlign: "center",
                  background: p.tag ? `linear-gradient(135deg, ${colors.purple}, #5B3FD4)` : "transparent",
                  color: p.tag ? "#fff" : colors.purpleLight,
                  border: p.tag ? "none" : `1px solid ${colors.purple}`,
                  padding: "12px 24px", borderRadius: 10,
                  textDecoration: "none", fontSize: 15, fontWeight: 700,
                  transition: "all 0.25s",
                }}
                  onMouseEnter={e => { e.target.style.opacity = "0.85"; e.target.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }}>
                  Quiero este paquete
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MÉTODO ────────────────────────────────────────────────────────────────
function Metodo() {
  const etapas = [
    { n: "01", name: "Claridad esencial", desc: "Entrevista breve para definir tu meta digital prioritaria. Sin rodeos." },
    { n: "02", name: "Diseño funcional", desc: "Construimos la estructura del sitio, contenido y chatbot con IA." },
    { n: "03", name: "IA sin fricción", desc: "Automatizaciones simples: formularios, seguimiento, chats." },
    { n: "04", name: "Entrega con autonomía", desc: "Recibes acceso completo + entrenamiento grabado o guía PDF." },
    { n: "05", name: "Ciclo Zenpi", desc: "Seguimiento opcional para escalar, mejorar y crecer." },
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
            Cinco etapas para pasar de "tengo una idea" a "tengo un sistema que vende".
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
                <div style={{ paddingBottom: i < etapas.length - 1 ? 0 : 0 }}>
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
    { q: "¿Necesito saber de tecnología para usar lo que construyen?", a: "No. Todo lo que entregamos viene con acceso simplificado, guía grabada o PDF, y soporte. Si puedes usar WhatsApp, puedes usar lo que hacemos." },
    { q: "¿Cuánto tiempo tarda la entrega?", a: "Zenpi Start: 48–72 horas. Zenpi Web: 5–7 días hábiles. Zenpi Flow: 10–14 días hábiles. Los tiempos dependen de que nos compartas el brief completo al inicio." },
    { q: "¿Qué pasa si quiero cambios después de la entrega?", a: "Cada paquete incluye un período de soporte (15 o 30 días). Durante ese tiempo, cambios menores son sin costo. Para cambios más grandes o proyectos nuevos, lo cotizamos." },
    { q: "¿Trabajan con cualquier tipo de negocio?", a: "Trabajamos mejor con emprendedores y negocios pequeños que están listos para digitalizar o escalar. Si tienes una meta clara, nosotros construimos el sistema." },
    { q: "¿Los chatbots entienden preguntas en español?", a: "Sí. Los chatbots que configuramos están entrenados en español y personalizados con la información de tu negocio. Pueden responder FAQs, capturar datos y agendar citas." },
    { q: "¿Qué incluye el soporte post entrega?", a: "Respuesta por correo o WhatsApp en horario hábil. Ajustes menores al chatbot, textos o flujos. Orientación para que uses el sistema con total autonomía." },
    { q: "¿Puedo empezar con el paquete básico y luego subir?", a: "Absolutamente. Muchos clientes empiezan con Zenpi Start para validar, y luego escalan a Web o Flow. Diseñamos todo pensando en esa continuidad." },
    { q: "¿Hacen integraciones con herramientas que ya uso?", a: "Sí, especialmente en Zenpi Flow. Integramos con HubSpot, Google Sheets, Calendly, WhatsApp Business, y más. Cuéntanos tu stack y lo evaluamos." },
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
                  overflow: "hidden", maxHeight: open === i ? 200 : 0,
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
  const [form, setForm] = useState({ nombre: "", email: "", sitio: "", automatizar: "", contacto: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Tu nombre es necesario";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email válido, por favor";
    if (!form.automatizar.trim()) e.automatizar = "Cuéntanos qué quieres automatizar";
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
            Hablemos de tu proyecto
          </h2>
          <p style={{ fontSize: 16, color: colors.textMuted, lineHeight: 1.75, marginBottom: 36 }}>
            Cuéntanos qué quieres lograr. En menos de 24 horas te respondemos con un plan claro.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              ["📍", "Demo gratuita incluida", "Sin compromiso ni tecnicismos"],
              ["⚡", "Respuesta en menos de 24h", "Respondemos rápido, siempre"],
              ["🔒", "Tu información es tuya", "Sin spam, sin venta de datos"],
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
              <label style={labelStyle}>¿Qué te gustaría automatizar? *</label>
              <textarea placeholder="Ej: responder preguntas frecuentes, agendar citas, capturar leads..." value={form.automatizar} style={{ ...inputStyle("automatizar"), resize: "vertical", minHeight: 100 }}
                onChange={e => { setForm({ ...form, automatizar: e.target.value }); setErrors({ ...errors, automatizar: "" }); }}
                onFocus={e => e.target.style.borderColor = colors.purple}
                onBlur={e => e.target.style.borderColor = errors.automatizar ? "#F87171" : colors.cardBorder} />
              {errors.automatizar && <p style={{ fontSize: 12, color: "#F87171", marginTop: 4 }}>{errors.automatizar}</p>}
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
              IA aplicada para emprendedores que quieren crecer sin complicaciones.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Servicios</p>
            {["Zenpi Start", "Zenpi Web", "Zenpi Flow"].map(s => (
              <a key={s} href="#servicios" style={{ display: "block", color: colors.textMuted, textDecoration: "none", fontSize: 14, marginBottom: 10, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = colors.text}
                onMouseLeave={e => e.target.style.color = colors.textMuted}>{s}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>Navegación</p>
            {[["Qué es Zenpi", "que-es"], ["El Método", "metodo"], ["FAQ", "faq"], ["Contacto", "contacto"]].map(([l, a]) => (
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
          <p style={{ fontSize: 13, color: colors.textMuted }}>Hecho con IA · Para negocios que piensan en grande</p>
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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
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
      {/* WhatsApp SVG icon */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      {/* Label que aparece al hacer hover */}
      <span style={{
        color: "#fff", fontWeight: 700, fontSize: 14,
        maxWidth: hovered ? 160 : 0,
        opacity: hovered ? 1 : 0,
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}>
        ¡Escríbenos!
      </span>
    </a>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
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
        <Servicios />
        <Metodo />
        <FAQ />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
