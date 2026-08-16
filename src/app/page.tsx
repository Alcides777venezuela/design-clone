"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, ChevronDown, Globe, Sparkles, Image, Layout, Type,
  Smartphone, Share2, ArrowRight, Star
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
  { icon: <Layout className="w-6 h-6" />, title: "Plantillas personalizables", desc: "Miles de plantillas diseñadas por profesionales para tu link en bio.", color: "from-blue-500/20 to-indigo-500/10" },
  { icon: <Smartphone className="w-6 h-6" />, title: "Optimizado para celular", desc: "Se ve perfecto en cualquier dispositivo, sin complicaciones.", color: "from-green-500/20 to-emerald-500/10" },
  { icon: <Share2 className="w-6 h-6" />, title: "Comparte al instante", desc: "Un solo enlace para todas tus redes sociales, súper fácil.", color: "from-purple-500/20 to-pink-500/10" },
  { icon: <Image className="w-6 h-6" />, title: "Multimedia enriquecida", desc: "Agrega fotos, videos y enlaces a tu página personalizada.", color: "from-orange-500/20 to-amber-500/10" },
  { icon: <Type className="w-6 h-6" />, title: "Tipografía personalizada", desc: "Elige entre cientos de fuentes para darle tu estilo único.", color: "from-rose-500/20 to-red-500/10" },
  { icon: <Sparkles className="w-6 h-6" />, title: "IA integrada", desc: "Crea tu link en bio automáticamente con inteligencia artificial.", color: "from-cyan-500/20 to-sky-500/10" },
];

const CATEGORIES = [
  { name: "Portadas Instagram", icon: "📸" },
  { name: "Historias Facebook", icon: "📘" },
  { name: "Banners Twitter", icon: "🐦" },
  { name: "Portadas YouTube", icon: "▶️" },
  { name: "Fotos LinkedIn", icon: "💼" },
  { name: "Tarjetas visita", icon: "💳" },
  { name: "Logos IA", icon: "🤖" },
  { name: "Sitios web", icon: "🌐" },
];

/* ================================================================
   ANIMATED COUNTER
   ================================================================ */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const numeric = parseInt(value.replace(/[^0-9]/g, ""));
  const suffixChar = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = numeric;
          const duration = 2000;
          const step = Math.ceil(end / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) { start = end; clearInterval(timer); }
            setCount(start);
          }, duration / 60);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric]);

  return <div ref={ref}>{count}{suffixChar}{suffix}</div>;
}

/* ================================================================
   CUSTOM CURSOR
   ================================================================ */
function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor]")) setHovering(true);
      else setHovering(false);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[999] mix-blend-difference"
      animate={{ x: pos.x - 16, y: pos.y - 16, scale: hovering ? 1.5 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <div className={`w-8 h-8 rounded-full bg-white transition-opacity duration-300 ${hovering ? "opacity-30" : "opacity-10"}`} />
    </motion.div>
  );
}

/* ================================================================
   NAVBAR
   ================================================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">D</span>
            </motion.div>
            <span className="font-semibold text-white text-lg hidden sm:block">
              design<span className="text-[#3f59f6]">.com</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="relative text-sm text-white/70 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors px-3 py-2">
              Iniciar sesión
            </a>
            <motion.a
              href="#"
              className="btn-primary text-white text-sm px-5 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Registrarse
            </motion.a>
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

/* ================================================================
   HERO
   ================================================================ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center bg-grid pt-20 overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#3f59f6]/20 to-transparent blur-[100px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#6c7bff]/15 to-transparent blur-[100px]"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div style={{ y, opacity }} className="absolute inset-0 bg-gradient-to-b from-[#3f59f6]/5 via-transparent to-transparent" />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Diseña tu </span>
            <span className="text-gradient">link en bio</span>
            <br />
            <span className="text-white">en segundos</span>
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
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          >
            <motion.a
              href="#"
              className="btn-primary text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear link gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a
              href="#"
              className="glass text-white/80 px-8 py-3 rounded-xl font-medium hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver plantillas
            </motion.a>
          </motion.div>

          {/* Stats animados */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 sm:gap-12 text-center"
          >
            {[
              { value: "10M+", label: "Creadores" },
              { value: "50K+", label: "Plantillas" },
              { value: "4.9★", label: "Valoración" },
            ].map((s) => (
              <motion.div
                key={s.label}
                className="relative"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-xs text-white/40">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ================================================================
   BENTO FEATURES GRID
   ================================================================ */
function BentoFeatures() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-[#0b0d12] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3f59f6]/3 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Crea, personaliza y comparte tu link en bio con herramientas profesionales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Feature 1 - grande */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 lg:row-span-2 glass rounded-2xl p-8 card-hover group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                <Layout className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Plantillas personalizables</h3>
              <p className="text-white/50">Miles de plantillas diseñadas por profesionales para tu link en bio. Encuentra tu estilo perfecto.</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 card-hover group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Optimizado para celular</h3>
              <p className="text-sm text-white/50">Se ve perfecto en cualquier dispositivo, sin complicaciones.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl p-6 card-hover group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Comparte al instante</h3>
              <p className="text-sm text-white/50">Un solo enlace para todas tus redes sociales, súper fácil.</p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 card-hover group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Image className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Multimedia enriquecida</h3>
              <p className="text-sm text-white/50">Agrega fotos, videos y enlaces a tu página personalizada.</p>
            </div>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-6 card-hover group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/10 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <Type className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Tipografía personalizada</h3>
              <p className="text-sm text-white/50">Elige entre cientos de fuentes para darle tu estilo único.</p>
            </div>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass rounded-2xl p-6 card-hover group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">IA integrada</h3>
                <p className="text-sm text-white/50">Crea tu link en bio automáticamente con inteligencia artificial.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CATEGORIES
   ================================================================ */
function Categories() {
  return (
    <section className="py-20 bg-[#0f1117] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Palabras clave populares</h2>
          <p className="text-white/50 mb-8">Explora nuestras categorías más buscadas</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.a
              key={cat.name}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="glass rounded-xl p-5 text-center card-hover group relative overflow-hidden"
            >
              <motion.span
                className="text-3xl mb-2 block"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {cat.icon}
              </motion.span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{cat.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CTA
   ================================================================ */
function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  return (
    <section ref={ref} className="py-20 bg-[#0b0d12] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#3f59f6]/10 via-transparent to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
        <motion.div
          style={{ scale }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 sm:p-12 border border-[#3f59f6]/10 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3f59f6]/20 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#6c7bff]/20 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Listo para crear tu link en bio?
            </h2>
            <p className="text-white/50 max-w-md mx-auto mb-8">
              Únete a más de 10 millones de creadores que ya usan Design.com.
            </p>
            <motion.a
              href="#"
              className="btn-primary text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Crear link gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  const FOOTER_LINKS = [
    { title: "Productos", links: ["Generador de logos IA", "Creador de sitios web", "Tarjetas de visita", "Link en bio"] },
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
            <span>Español (Colombia)</span>
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
  const lenisRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-[#0f1117] text-white cursor-none">
      <CustomCursor />
      <Navbar />
      <Hero />
      <BentoFeatures />
      <Categories />
      <CTA />
      <Footer />
    </main>
  );
}