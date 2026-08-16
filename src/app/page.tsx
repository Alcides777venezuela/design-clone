"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Globe, Sparkles, Image, Layout, Type,
  Smartphone, Share2, ArrowRight, Check, Star, ChevronRight, Search
} from "lucide-react";

/* ================================================================
   DATA
   ================================================================ */
const NAV_ITEMS = [
  { label: "Plantillas", href: "#" },
  { label: "Características", href: "#features" },
  { label: "Precios", href: "#" },
  { label: "Blog", href: "#" },
];

const FEATURES = [
  { icon: <Layout className="w-6 h-6" />, title: "Plantillas personalizables", desc: "Miles de plantillas diseñadas por profesionales para tu link en bio." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Optimizado para celular", desc: "Se ve perfecto en cualquier dispositivo, sin complicaciones." },
  { icon: <Share2 className="w-6 h-6" />, title: "Comparte al instante", desc: "Un solo enlace para todas tus redes sociales, súper fácil." },
  { icon: <Image className="w-6 h-6" />, title: "Multimedia enriquecida", desc: "Agrega fotos, videos y enlaces a tu página personalizada." },
  { icon: <Type className="w-6 h-6" />, title: "Tipografía personalizada", desc: "Elige entre cientos de fuentes para darle tu estilo único." },
  { icon: <Sparkles className="w-6 h-6" />, title: "IA integrada", desc: "Crea tu link en bio automáticamente con inteligencia artificial." },
];

const CATEGORIES = [
  { name: "Portadas de Instagram", icon: "📸" },
  { name: "Historias de Facebook", icon: "📘" },
  { name: "Banners de Twitter", icon: "🐦" },
  { name: "Portadas de YouTube", icon: "▶️" },
  { name: "Fotos de perfil LinkedIn", icon: "💼" },
  { name: "Tarjetas de visita", icon: "💳" },
];

const LANG_ITEMS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español", active: true },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
];

/* ================================================================
   COMPONENTS
   ================================================================ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-white text-lg hidden sm:block">
              design<span className="text-[#3f59f6]">.com</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1 px-3 py-2">
                Productos <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            {NAV_ITEMS.slice(1).map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors px-2 py-1.5 text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>ES</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl glass py-2 shadow-xl"
                  >
                    {LANG_ITEMS.map((l) => (
                      <button key={l.code} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 ${l.active ? "text-[#3f59f6]" : "text-white/70"}`}>
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="#" className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
              Iniciar sesión
            </a>
            <a href="#" className="btn-primary text-white text-sm px-5 py-2 rounded-lg font-medium">
              Registrarse
            </a>

            <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#0f1117]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} className="block py-2 text-white/70 hover:text-white">{item.label}</a>
              ))}
              <hr className="border-white/10 my-2" />
              <a href="#" className="block py-2 text-white/70 hover:text-white">Iniciar sesión</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-grid pt-20 overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3f59f6]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-white/70 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#3f59f6]" />
            <span>Potenciado por <span className="text-[#3f59f6] font-semibold">IA</span></span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Diseña tu{" "}
            <span className="text-gradient">link en bio</span>
            <br />
            en segundos
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/50 max-w-xl mx-auto mb-8"
          >
            Crea tu propio link en la bio con nuestras plantillas profesionales.
            Comparte todo en un solo lugar con estilo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            <a href="#" className="btn-primary text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
              Crear enlace gratis <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#" className="glass text-white/80 px-8 py-3 rounded-xl font-medium hover:bg-white/5 transition-colors">
              Ver plantillas
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-8 sm:gap-12 text-center"
          >
            {[
              { value: "10M+", label: "Creadores" },
              { value: "50K+", label: "Plantillas" },
              { value: "4.8★", label: "Valoración" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#0b0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Crea, personaliza y comparte tu enlace biográfico con herramientas profesionales.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-xl p-6 card-hover group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#3f59f6]/10 flex items-center justify-center text-[#6c7bff] mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Categories ---------- */
function Categories() {
  return (
    <section className="py-20 bg-[#0f1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Palabras clave populares</h2>
          <p className="text-white/50 mb-8">Explora nuestras categorías más buscadas</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.name}
              href="#"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-4 text-center card-hover group"
            >
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{cat.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="py-20 bg-[#0b0d12]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 sm:p-12 border border-[#3f59f6]/10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para crear tu link en bio?
          </h2>
          <p className="text-white/50 max-w-md mx-auto mb-8">
            Únete a más de 10 millones de creadores que ya usan Design.com.
          </p>
          <a href="#" className="btn-primary text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2">
            Crear enlace gratis <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const FOOTER_LINKS = [
    { title: "Productos", links: ["Generador de logos IA", "Creador de sitios web", "Tarjetas de visita", "Enlace en bio"] },
    { title: "Recursos", links: ["Blog", "Plantillas", "Tutoriales", "API"] },
    { title: "Empresa", links: ["Sobre nosotros", "Contacto", "Prensa", "Empleo"] },
    { title: "Legal", links: ["Privacidad", "Términos", "Cookies", "GDPR"] },
  ];

  return (
    <footer className="py-16 border-t border-white/5 bg-[#0b0d12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-semibold text-white">design<span className="text-[#3f59f6]">.com</span></span>
            </div>
            <p className="text-sm text-white/40 max-w-xs">
              Crea diseños profesionales en minutos con la herramienta de diseño online #1.
            </p>
          </div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <Globe className="w-3 h-3" />
            <span>Español</span>
          </div>
          <div className="text-xs text-white/30">
            © {new Date().getFullYear()} Design.com. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f1117] text-white">
      <Navbar />
      <Hero />
      <Features />
      <Categories />
      <CTA />
      <Footer />
    </main>
  );
}