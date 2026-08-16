"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  Menu, X, Globe, Sparkles, Image, Layout, Type,
  Smartphone, Share2, ArrowRight, Star
} from "lucide-react";

/* ================================================================
   3D PHONE MOCKUP
   ================================================================ */
function Phone3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.05 : 1}
        >
          <boxGeometry args={[1.2, 2.2, 0.1]} />
          <MeshDistortMaterial
            color="#3f59f6"
            emissive="#6c7bff"
            emissiveIntensity={0.1}
            roughness={0.3}
            metalness={0.1}
            distort={0.1}
            speed={2}
          />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.05, 1.85]} />
          <meshBasicMaterial color="#1a1d27" />
        </mesh>
        {/* Screen content mockup */}
        <mesh position={[0, 0.3, 0.07]}>
          <planeGeometry args={[0.8, 0.05]} />
          <meshBasicMaterial color="#3f59f6" />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[0.85, 0.7]} />
          <meshBasicMaterial color="#242734" />
        </mesh>
        {[0.25, 0.1, -0.05, -0.2, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0.07]}>
            <planeGeometry args={[0.75, 0.04]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#3f59f6" : "#6c7bff"} opacity={0.6} transparent />
          </mesh>
        ))}
        {/* Camera dot */}
        <mesh position={[0, 1.0, 0.07]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#1a1d27" />
        </mesh>
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
        <Suspense fallback={null}>
          <Phone3D />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ================================================================
   ANIMATED COUNTER
   ================================================================ */
function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const numeric = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

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

  return <div ref={ref}>{count}{suffix}</div>;
}

/* ================================================================
   MAGNETIC BUTTON
   ================================================================ */
function MagneticButton({ children, className = "", href = "#" }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      setPos({ x, y });
    }
  };
  const reset = () => setPos({ x: 0, y: 0 });

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

/* ================================================================
   NAVBAR
   ================================================================ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-blur border-b border-white/5" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </motion.div>
            <span className="font-semibold text-white text-lg hidden sm:block">
              design<span className="text-[#3f59f6]">.com</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {["Plantillas", "Características", "Precios", "Blog"].map((item) => (
              <a key={item} href={item === "Características" ? "#features" : "#"} className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="hidden sm:block text-sm text-white/70 hover:text-white transition-colors px-3 py-2">Iniciar sesión</a>
            <MagneticButton className="btn-primary text-white text-sm px-5 py-2 rounded-lg font-medium">
              Registrarse
            </MagneticButton>
            <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-white/10 bg-[#0f1117]/95 backdrop-blur-xl">
            <div className="px-4 py-4 space-y-2">
              {["Plantillas", "Características", "Precios", "Blog"].map((item) => (
                <a key={item} href="#" className="block py-2 text-white/70 hover:text-white">{item}</a>
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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center bg-grid pt-20 overflow-hidden">
      {/* Animated orbs */}
      <motion.div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#3f59f6]/20 to-transparent blur-[120px]" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#6c7bff]/15 to-transparent blur-[120px]" animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <motion.div style={{ y, opacity }} className="absolute inset-0 bg-gradient-to-b from-[#3f59f6]/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-white/70 mb-6">
              <Sparkles className="w-4 h-4 text-[#3f59f6]" />
              <span>Potenciado por <span className="text-[#3f59f6] font-semibold">IA</span></span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-white">Diseña tu </span>
              <span className="text-gradient">link en bio</span>
              <br />
              <span className="text-white">en segundos</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg text-white/50 max-w-lg mb-8">
              Crea tu propio link en la bio con nuestras plantillas profesionales. Comparte todo en un solo lugar con estilo.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 mb-16">
              <MagneticButton className="btn-primary text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center gap-2 group">
                Crear link gratis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton className="glass text-white/80 px-8 py-3 rounded-xl font-medium">
                Ver plantillas
              </MagneticButton>
            </motion.div>

            {/* Marquee Stats */}
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

          {/* Right - 3D Phone */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }} className="hidden lg:block">
            <Scene3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   BENTO FEATURES (with images)
   ================================================================ */
function BentoFeatures() {
  const images = [
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400&h=300&fit=crop",
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#0b0d12] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#3f59f6]/3 via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Todo lo que necesitas</h2>
          <p className="text-white/50 max-w-lg mx-auto">Crea, personaliza y comparte tu link en bio con herramientas profesionales.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Feature 1 - Hero card with image */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2 lg:row-span-2 glass rounded-2xl overflow-hidden card-hover group relative">
            <div className="h-48 overflow-hidden">
              <img src={images[0]} alt="Plantillas" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
            </div>
            <div className="p-6 relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 flex items-center justify-center text-blue-400 mb-4">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Plantillas personalizables</h3>
              <p className="text-sm text-white/50">Miles de plantillas diseñadas por profesionales para tu link en bio.</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass rounded-2xl overflow-hidden card-hover group relative">
            <div className="h-32 overflow-hidden">
              <img src={images[1]} alt="Mobile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
            </div>
            <div className="p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center text-green-400 mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Optimizado para celular</h3>
              <p className="text-xs text-white/50">Se ve perfecto en cualquier dispositivo.</p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="glass rounded-2xl overflow-hidden card-hover group relative">
            <div className="h-32 overflow-hidden">
              <img src={images[2]} alt="Share" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
            </div>
            <div className="p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center text-purple-400 mb-3">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Comparte al instante</h3>
              <p className="text-xs text-white/50">Un enlace para todas tus redes.</p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="glass rounded-2xl overflow-hidden card-hover group relative">
            <div className="h-32 overflow-hidden">
              <img src={images[3]} alt="Multimedia" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
            </div>
            <div className="p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 flex items-center justify-center text-orange-400 mb-3">
                <Image className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Multimedia</h3>
              <p className="text-xs text-white/50">Fotos, videos y enlaces.</p>
            </div>
          </motion.div>

          {/* Feature 5 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="glass rounded-2xl overflow-hidden card-hover group relative">
            <div className="h-32 overflow-hidden">
              <img src={images[4]} alt="Typography" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
            </div>
            <div className="p-5 relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/10 flex items-center justify-center text-rose-400 mb-3">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">Tipografía</h3>
              <p className="text-xs text-white/50">Cientos de fuentes únicas.</p>
            </div>
          </motion.div>

          {/* Feature 6 */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass rounded-2xl overflow-hidden card-hover group relative">
            <div className="h-32 overflow-hidden">
              <img src={images[5]} alt="AI" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-transparent to-transparent" />
            </div>
            <div className="p-5 relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/10 flex items-center justify-center text-cyan-400 shrink-0">
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
   CATEGORIES - Magnetic hover
   ================================================================ */
function Categories() {
  const cats = [
    { name: "Portadas Instagram", icon: "📸" },
    { name: "Historias Facebook", icon: "📘" },
    { name: "Banners Twitter", icon: "🐦" },
    { name: "Portadas YouTube", icon: "▶️" },
    { name: "Fotos LinkedIn", icon: "💼" },
    { name: "Tarjetas visita", icon: "💳" },
    { name: "Logos IA", icon: "🤖" },
    { name: "Sitios web", icon: "🌐" },
  ];

  return (
    <section className="py-20 bg-[#0f1117] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Palabras clave populares</h2>
          <p className="text-white/50 mb-8">Explora nuestras categorías más buscadas</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {cats.map((cat, i) => (
            <MagneticButton key={cat.name} className="glass rounded-xl p-5 text-center card-hover group relative overflow-hidden">
              <motion.span className="text-3xl mb-2 block" whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }}>
                {cat.icon}
              </motion.span>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">{cat.name}</span>
            </MagneticButton>
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
        <motion.div style={{ scale }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="glass rounded-2xl p-8 sm:p-12 border border-[#3f59f6]/10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#3f59f6]/20 rounded-full blur-[60px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#6c7bff]/20 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">¿Listo para crear tu link en bio?</h2>
            <p className="text-white/50 max-w-md mx-auto mb-8">Únete a más de 10 millones de creadores que ya usan Design.com.</p>
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
            <p className="text-sm text-white/40 max-w-xs">Crea diseños profesionales en minutos con la herramienta de diseño online #1.</p>
          </div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{link}</a></li>
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
  return (
    <main className="min-h-screen bg-[#0f1117] text-white">
      <Navbar />
      <Hero />
      <BentoFeatures />
      <Categories />
      <CTA />
      <Footer />
    </main>
  );
}