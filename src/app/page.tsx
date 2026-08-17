"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  Menu, X, Globe, Sparkles, Image, Layout, Type,
  Smartphone, Share2, ArrowRight, Star, Sun, Moon,
  ChevronDown, Plus, Quote, Check, Shield
} from "lucide-react";
import AuthModal from "@/components/AuthModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import CheckoutButton from "@/components/CheckoutButton";

/* ================================================================
   3D PHONE
   ================================================================ */
function Phone3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });
  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={meshRef}><boxGeometry args={[1.2, 2.2, 0.1]} /><MeshDistortMaterial color="#3f59f6" emissive="#6c7bff" emissiveIntensity={0.1} roughness={0.3} metalness={0.1} distort={0.1} speed={2} /></mesh>
        <mesh position={[0, 0, 0.06]}><planeGeometry args={[1.05, 1.85]} /><meshBasicMaterial color="#1a1d27" /></mesh>
        <mesh position={[0, 0.3, 0.07]}><planeGeometry args={[0.8, 0.05]} /><meshBasicMaterial color="#3f59f6" /></mesh>
        {[0.25, 0.1, -0.05, -0.2, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0.07]}><planeGeometry args={[0.75, 0.04]} /><meshBasicMaterial color={i % 2 === 0 ? "#3f59f6" : "#6c7bff"} opacity={0.6} transparent /></mesh>
        ))}
      </Float>
    </group>
  );
}

function Scene3D() {
  return (
    <div className="w-full h-[400px] lg:h-[500px]">
      <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#6c7bff" />
        <Suspense fallback={null}><Phone3D /></Suspense>
      </Canvas>
    </div>
  );
}

/* ================================================================
   ANIMATED COUNTER
   ================================================================ */
function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0); const ref = useRef<HTMLDivElement>(null);
  const numeric = parseInt(value.replace(/[^0-9]/g, "")); const suffix = value.replace(/[0-9]/g, "");
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0; const end = numeric; const step = Math.ceil(end / 60);
        const timer = setInterval(() => { start += step; if (start >= end) { start = end; clearInterval(timer); } setCount(start); }, 33);
      }
    }, { threshold: 0.5 });
    observer.observe(el); return () => observer.disconnect();
  }, [numeric]);
  return <div ref={ref}>{count}{suffix}</div>;
}

/* ================================================================
   MAGNETIC BUTTON
   ================================================================ */
function MagneticButton({ children, className = "", href = "#", onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null); const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouse = (e: React.MouseEvent) => { const rect = ref.current?.getBoundingClientRect(); if (rect) { setPos({ x: (e.clientX - rect.left - rect.width / 2) * 0.3, y: (e.clientY - rect.top - rect.height / 2) * 0.3 }); } };
  const reset = () => setPos({ x: 0, y: 0 });
  return <motion.a ref={ref} href={href} className={className} animate={{ x: pos.x, y: pos.y }} transition={{ type: "spring", stiffness: 150, damping: 15 }} onMouseMove={handleMouse} onMouseLeave={reset} onClick={onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{children}</motion.a>;
}

/* ================================================================
   DATA
   ================================================================ */
const PLANS = [
  { name: "Pro", price: 9, features: ["Links ilimitados", "Todas las plantillas", "Estadísticas avanzadas", "Soporte prioritario", "Sin marca de agua"], popular: false, stripeId: "price_pro" },
  { name: "Empresa", price: 29, features: ["Todo lo de Pro", "Múltiples equipos", "API personalizada", "Soporte 24/7", "IA avanzada", "Personalización total"], popular: true, stripeId: "price_empresa" },
];

const TESTIMONIALS = [
  { name: "María García", role: "Creadora de contenido", text: "Desde que uso Design.com mis links en bio tienen otro nivel. Las plantillas son una belleza.", rating: 5, img: "/images/testimonial-1.jpg" },
  { name: "Carlos Mendoza", role: "Emprendedor digital", text: "Increíble lo fácil que es crear un link profesional. En 5 minutos tenía todo listo.", rating: 5, img: "/images/testimonial-2.jpg" },
  { name: "Ana López", role: "Social Media Manager", text: "Mis clientes quedan fascinados con los resultados. La función de IA es un game changer.", rating: 5, img: "/images/testimonial-1.jpg" },
];

const FAQS = [
  { q: "¿Cómo creo mi link en bio?", a: "Es muy sencillo: regístrate gratis, elige una plantilla, personaliza los enlaces y comparte. Todo en menos de 5 minutos." },
  { q: "¿Puedo usar mis propias imágenes?", a: "Sí, puedes subir tus propias imágenes y personalizar cada detalle de tu página." },
  { q: "¿Funciona en Instagram y TikTok?", a: "Funciona en cualquier red social. Solo copias el enlace y lo pegas en tu bio." },
  { q: "¿Hay límite de visitas?", a: "El plan gratuito tiene visitas ilimitadas. Los planes Pro y Empresa añaden estadísticas avanzadas." },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí, sin compromisos. Cancela cuando quieras sin penalización." },
];

/* ================================================================
   NAVBAR
   ================================================================ */
function Navbar({ darkMode, toggleDark, onAuth }: { darkMode: boolean; toggleDark: () => void; onAuth: (mode: "login" | "register") => void }) {
  const [scrolled, setScrolled] = useState(false); const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return (
    <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-blur border-b border-white/5" : "bg-transparent"} ${darkMode ? "dark" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </motion.div>
            <span className={`font-semibold text-lg hidden sm:block ${darkMode ? "text-white" : "text-gray-900"}`}>design<span className="text-[#3f59f6]">.com</span></span>
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {["Plantillas", "Características", "Precios", "Blog"].map((item) => (
              <a key={item} href={item === "Características" ? "#features" : item === "Precios" ? "#pricing" : "#"} className={`text-sm transition-colors px-4 py-2 rounded-lg hover:bg-white/5 ${darkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className={`p-2 rounded-lg transition-colors ${darkMode ? "text-white/70 hover:bg-white/5" : "text-gray-600 hover:bg-gray-100"}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => onAuth("login")} className={`hidden sm:block text-sm transition-colors px-3 py-2 ${darkMode ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>Iniciar sesión</button>
            <MagneticButton onClick={() => onAuth("register")} className="btn-primary text-white text-sm px-5 py-2 rounded-lg font-medium">Registrarse</MagneticButton>
            <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
      </div>
      <AnimatePresence>{mobileOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-white/10 bg-[#0f1117]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {["Plantillas", "Características", "Precios", "Blog"].map((item) => (<a key={item} href="#" className="block py-2 text-white/70 hover:text-white">{item}</a>))}
            <hr className="border-white/10 my-2" /><a href="#" className="block py-2 text-white/70 hover:text-white">Iniciar sesión</a>
          </div>
        </motion.div>
      )}</AnimatePresence>
    </motion.nav>
  );
}

/* ================================================================
   HERO
   ================================================================ */
function Hero({ darkMode }: { darkMode: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bg = darkMode ? "bg-[#0f1117]" : "bg-white";

  return (
    <section ref={ref} className={`relative min-h-screen flex items-center bg-grid pt-20 overflow-hidden ${bg} transition-colors duration-500`}>
      <motion.div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#3f59f6]/20 to-transparent blur-[120px]" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#6c7bff]/15 to-transparent blur-[120px]" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <motion.div style={{ y, opacity }} className="absolute inset-0 bg-gradient-to-b from-[#3f59f6]/5 via-transparent to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-white/70 mb-6">
              <Sparkles className="w-4 h-4 text-[#3f59f6]" /><span>Potenciado por <span className="text-[#3f59f6] font-semibold">IA</span></span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className={darkMode ? "text-white" : "text-gray-900"}>Diseña tu </span><span className="text-gradient">link en bio</span><br /><span className={darkMode ? "text-white" : "text-gray-900"}>en segundos</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`text-lg max-w-lg mb-8 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
              Crea tu propio link en la bio con nuestras plantillas profesionales. Comparte todo en un solo lugar con estilo.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 mb-16">
              <MagneticButton className="btn-primary text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center gap-2 group">
                Crear link gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton className="glass text-white/80 px-8 py-3 rounded-xl font-medium">Ver plantillas</MagneticButton>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="overflow-hidden">
              <div className="marquee flex gap-8 py-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-8 shrink-0">
                    <div className="text-center px-6"><div className="text-2xl font-bold text-white"><AnimatedCounter value="10M+" /></div><div className="text-xs text-white/40">Creadores</div></div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center px-6"><div className="text-2xl font-bold text-white"><AnimatedCounter value="50K+" /></div><div className="text-xs text-white/40">Plantillas</div></div>
                    <div className="w-px bg-white/10" />
                    <div className="text-center px-6"><div className="text-2xl font-bold text-white"><AnimatedCounter value="4.9" />★</div><div className="text-xs text-white/40">Valoración</div></div>
                    <div className="w-px bg-white/10" />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="hidden lg:block"><Scene3D /></motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BENTO FEATURES
   ================================================================ */
function BentoFeatures({ darkMode }: { darkMode: boolean }) {
  const bg = darkMode ? "bg-[#0b0d12]" : "bg-gray-50";
  const features = [
    { icon: <Layout className="w-6 h-6" />, title: "Plantillas", desc: "Miles de plantillas profesionales.", img: "/images/feature-1.jpg", color: "from-blue-500/20 to-indigo-500/10", iconColor: "text-blue-400" },
    { icon: <Smartphone className="w-5 h-5" />, title: "Optimizado para celular", desc: "Se ve perfecto en cualquier dispositivo.", img: "/images/feature-2.jpg", color: "from-green-500/20 to-emerald-500/10", iconColor: "text-green-400" },
    { icon: <Share2 className="w-5 h-5" />, title: "Comparte al instante", desc: "Un enlace para todas tus redes.", img: "/images/feature-3.jpg", color: "from-purple-500/20 to-pink-500/10", iconColor: "text-purple-400" },
    { icon: <Image className="w-5 h-5" />, title: "Multimedia", desc: "Fotos, videos y enlaces.", img: "/images/feature-1.jpg", color: "from-orange-500/20 to-amber-500/10", iconColor: "text-orange-400" },
    { icon: <Type className="w-5 h-5" />, title: "Tipografía", desc: "Cientos de fuentes únicas.", img: "/images/feature-2.jpg", color: "from-rose-500/20 to-red-500/10", iconColor: "text-rose-400" },
    { icon: <Sparkles className="w-6 h-6" />, title: "IA integrada", desc: "Crea tu link automáticamente con IA.", img: "/images/feature-3.jpg", color: "from-cyan-500/20 to-sky-500/10", iconColor: "text-cyan-400" },
  ];
  return (
    <section id="features" className={`py-20 sm:py-28 ${bg} relative transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Todo lo que necesitas</h2>
          <p className={`max-w-lg mx-auto ${darkMode ? "text-white/50" : "text-gray-500"}`}>Crea, personaliza y comparte tu link en bio con herramientas profesionales.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`${i === 0 ? "lg:col-span-2 lg:row-span-2" : i === 5 ? "lg:col-span-2" : ""} glass rounded-2xl overflow-hidden card-hover group relative ${darkMode ? "" : "bg-white/80"}`}>
              <div className={`${i === 0 ? "h-48" : "h-32"} overflow-hidden`}>
                <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
              </div>
              <div className={`p-5 relative ${i === 0 ? "p-6" : ""}`}>
                <div className={`w-${i === 0 ? "12" : "10"} h-${i === 0 ? "12" : "10"} rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center ${f.iconColor} mb-${i === 0 ? "4" : "3"} group-hover:scale-110 transition-transform duration-300`}>{f.icon}</div>
                <h3 className={`${i === 0 ? "text-lg" : "text-base"} font-semibold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>{f.title}</h3>
                <p className={`text-${i === 0 ? "sm" : "xs"} ${darkMode ? "text-white/50" : "text-gray-500"}`}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   PRICING
   ================================================================ */
function Pricing({ darkMode }: { darkMode: boolean }) {
  const [annual, setAnnual] = useState(false);
  const bg = darkMode ? "bg-[#0f1117]" : "bg-white";
  return (
    <section id="pricing" className={`py-20 sm:py-28 ${bg} relative transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Precios simples</h2>
          <p className={`max-w-lg mx-auto mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Elige el plan perfecto para ti. Pago seguro con Stripe.</p>
          <div className="inline-flex items-center gap-3 p-1 rounded-full glass">
            <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!annual ? "btn-primary text-white" : `${darkMode ? "text-white/70" : "text-gray-600"}`}`}>Mensual</button>
            <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${annual ? "btn-primary text-white" : `${darkMode ? "text-white/70" : "text-gray-600"}`}`}>Anual <span className="text-xs opacity-70">-20%</span></button>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 card-hover ${plan.popular ? "glass border-[#3f59f6]/30 scale-105" : `glass ${darkMode ? "" : "bg-white/80"}`}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#3f59f6] text-white text-xs font-medium">Más popular</div>}
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{plan.name}</h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>${annual ? Math.round(plan.price * 0.8 * 12) : plan.price}</span>
                <span className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>/{annual ? "año" : "mes"}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" /><span className={`text-sm ${darkMode ? "text-white/70" : "text-gray-600"}`}>{f}</span></li>
                ))}
              </ul>
              <CheckoutButton
                planName={plan.name}
                priceId={plan.stripeId}
                price={plan.price}
                annual={annual}
                className={plan.popular ? "btn-primary text-white" : `glass ${darkMode ? "text-white" : "text-gray-900"}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   TESTIMONIALS
   ================================================================ */
function Testimonials({ darkMode }: { darkMode: boolean }) {
  const [current, setCurrent] = useState(0);
  const bg = darkMode ? "bg-[#0b0d12]" : "bg-gray-50";
  useEffect(() => { const timer = setInterval(() => setCurrent((p) => (p + 1) % TESTIMONIALS.length), 4000); return () => clearInterval(timer); }, []);

  return (
    <section className={`py-20 ${bg} relative transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Lo que dicen nuestros usuarios</h2>
          <p className={`max-w-lg mx-auto ${darkMode ? "text-white/50" : "text-gray-500"}`}>Más de 10 millones de creadores confían en nosotros.</p>
        </motion.div>
        <div className="relative h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }} className="absolute w-full max-w-2xl">
              <div className={`glass rounded-3xl p-8 sm:p-10 text-center ${darkMode ? "" : "bg-white/80"}`}>
                <Quote className="w-8 h-8 text-[#3f59f6]/30 mx-auto mb-4" />
                <p className={`text-lg sm:text-xl leading-relaxed mb-6 italic ${darkMode ? "text-white/80" : "text-gray-700"}`}>&ldquo;{TESTIMONIALS[current].text}&rdquo;</p>
                <div className="flex items-center justify-center gap-3">
                  <img src={TESTIMONIALS[current].img} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="text-left">
                    <div className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{TESTIMONIALS[current].name}</div>
                    <div className={`text-sm ${darkMode ? "text-white/50" : "text-gray-500"}`}>{TESTIMONIALS[current].role}</div>
                  </div>
                  <div className="flex gap-0.5 ml-4">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 text-yellow-400" fill="#facc15" />))}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-[#3f59f6]" : `${darkMode ? "bg-white/20" : "bg-gray-300"}`}`} />))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   FAQ
   ================================================================ */
function FAQ({ darkMode }: { darkMode: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const bg = darkMode ? "bg-[#0f1117]" : "bg-white";
  return (
    <section className={`py-20 ${bg} relative transition-colors duration-500`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Preguntas frecuentes</h2>
          <p className={`max-w-lg mx-auto ${darkMode ? "text-white/50" : "text-gray-500"}`}>Todo lo que necesitas saber sobre Design.com.</p>
        </motion.div>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`glass rounded-xl overflow-hidden transition-colors ${darkMode ? "" : "bg-white/80"}`}>
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}><Plus className={`w-5 h-5 ${darkMode ? "text-white/50" : "text-gray-500"}`} /></motion.div>
              </button>
              <AnimatePresence>{open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                  <p className={`px-5 pb-5 text-sm ${darkMode ? "text-white/60" : "text-gray-600"}`}>{faq.a}</p>
                </motion.div>
              )}</AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   CTA
   ================================================================ */
function CTA({ darkMode }: { darkMode: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const bg = darkMode ? "bg-[#0b0d12]" : "bg-gray-50";
  return (
    <section ref={ref} className={`py-20 ${bg} relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute inset-0 bg-gradient-radial from-[#3f59f6]/10 via-transparent to-transparent" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
        <motion.div style={{ scale }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass rounded-2xl p-8 sm:p-12 border border-[#3f59f6]/10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3f59f6]/20 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#6c7bff]/20 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>¿Listo para crear tu link en bio?</h2>
            <p className={`max-w-md mx-auto mb-8 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Únete a más de 10 millones de creadores que ya usan Design.com.</p>
            <MagneticButton className="btn-primary text-white px-8 py-3 rounded-xl font-medium inline-flex items-center gap-2 group">
              Crear link gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer({ darkMode }: { darkMode: boolean }) {
  const bg = darkMode ? "bg-[#0b0d12]" : "bg-gray-50";
  return (
    <footer className={`py-16 border-t ${darkMode ? "border-white/5 bg-[#0b0d12]" : "border-gray-200 bg-gray-50"} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center"><span className="text-white font-bold text-sm">D</span></div>
              <span className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>design<span className="text-[#3f59f6]">.com</span></span>
            </div>
            <p className={`text-sm max-w-xs ${darkMode ? "text-white/40" : "text-gray-500"}`}>Crea diseños profesionales en minutos con la herramienta #1.</p>
          </div>
          {[{ title: "Productos", links: ["Generador IA", "Sitios web", "Tarjetas", "Link en bio"] }, { title: "Recursos", links: ["Blog", "Plantillas", "Tutoriales", "API"] }, { title: "Empresa", links: ["Sobre nosotros", "Contacto", "Prensa", "Empleo"] }, { title: "Legal", links: ["Privacidad", "Términos", "Cookies", "GDPR"] }].map((col) => (
            <div key={col.title}><h4 className={`text-sm font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{col.title}</h4><ul className="space-y-2">{col.links.map((link) => (<li key={link}><a href="#" className={`text-sm transition-colors ${darkMode ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}>{link}</a></li>))}</ul></div>
          ))}
        </div>
        <div className={`border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 ${darkMode ? "border-white/5" : "border-gray-200"}`}>
          <div className={`flex items-center gap-2 text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}><Globe className="w-3 h-3" /><span>Español (Colombia)</span></div>
          <div className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>© {new Date().getFullYear()} Design.com.</div>
        </div>
      </div>
    </footer>
  );
}

/* ================================================================
   PAGE
   ================================================================ */
export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
    // Redirigir al panel después del registro/login
    router.push("/dashboard");
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0f1117] text-white" : "bg-white text-gray-900"}`}>
      <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} onAuth={openAuth} />
      <Hero darkMode={darkMode} />
      <BentoFeatures darkMode={darkMode} />
      <Pricing darkMode={darkMode} />
      <Testimonials darkMode={darkMode} />
      <FAQ darkMode={darkMode} />
      <CTA darkMode={darkMode} />
      <Footer darkMode={darkMode} />
      <WhatsAppButton />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </main>
  );
}