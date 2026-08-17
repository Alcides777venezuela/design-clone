"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, ExternalLink, Link2, BarChart3,
  LogOut, Copy, Check, ArrowLeft, Sparkles
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface BioLink {
  id: string;
  title: string;
  url: string;
  clicks: number;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [links, setLinks] = useState<BioLink[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);

  // Cargar links del usuario
  useEffect(() => {
    if (user) {
      loadLinks();
      loadProfile();
    }
  }, [user]);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  const loadLinks = async () => {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLinks(data as BioLink[]);
  };

  const loadProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();
    if (!error && data) setProfile(data);
  };

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !url.trim()) return;
    setAdding(true);

    // Normalizar URL
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    const { error } = await supabase.from("links").insert({
      user_id: user.id,
      title: title.trim(),
      url: finalUrl,
    });

    if (!error) {
      setTitle("");
      setUrl("");
      loadLinks();
    }
    setAdding(false);
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (!error) loadLinks();
  };

  const copyLink = async (id: string) => {
    const link = links.find((l) => l.id === id);
    if (!link) return;
    // URL pública del link en bio
    const publicUrl = `${window.location.origin}/bio/${id}`;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-2 border-[#3f59f6] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0b0d12]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3f59f6] to-[#6c7bff] flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold">Mi Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{profile?.full_name || user?.email?.split("@")[0] || "Usuario"}</div>
              <div className="text-xs text-white/40">{user?.email}</div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 text-[#3f59f6] mb-2"><Link2 className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Links</span></div>
            <div className="text-3xl font-bold">{links.length}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 text-green-400 mb-2"><BarChart3 className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Clicks</span></div>
            <div className="text-3xl font-bold">{links.reduce((acc, l) => acc + l.clicks, 0)}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-[#6c7bff] mb-2"><Sparkles className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Plan</span></div>
            <div className="text-3xl font-bold">Gratis</div>
          </motion.div>
        </div>

        {/* Formulario nuevo link */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Agregar nuevo link</h2>
          <form onSubmit={addLink} className="grid sm:grid-cols-[1fr_2fr_auto] gap-3">
            <input
              type="text"
              placeholder="Título (ej: Mi Instagram)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/30 focus:outline-none focus:border-[#3f59f6]/50 transition-colors text-white"
              required
            />
            <input
              type="text"
              placeholder="URL (ej: instagram.com/miperfil)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-white/30 focus:outline-none focus:border-[#3f59f6]/50 transition-colors text-white"
              required
            />
            <button
              type="submit"
              disabled={adding}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3f59f6] to-[#6c7bff] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#3f59f6]/25 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </form>
        </motion.div>

        {/* Lista de links */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mb-4">Tus links ({links.length})</h2>
          {links.length === 0 && (
            <div className="glass rounded-xl p-12 text-center text-white/40">
              <Link2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No tienes links todavía. Agrega tu primero arriba ☝️</p>
            </div>
          )}
          <AnimatePresence>
            {links.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-xl p-5 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#3f59f6]/10 flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5 text-[#3f59f6]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{link.title}</div>
                    <div className="text-sm text-white/40 truncate">{link.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-white/40 px-2 py-1 rounded-full bg-white/5">{link.clicks} clicks</span>
                  <button
                    onClick={() => copyLink(link.id)}
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                    title="Copiar link público"
                  >
                    {copied === link.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}