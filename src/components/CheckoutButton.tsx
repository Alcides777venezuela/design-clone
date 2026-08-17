"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  planName: string;
  priceId: string;
  price: number;
  annual: boolean;
  className?: string;
}

export default function CheckoutButton({ planName, priceId, price, annual, className = "" }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      // Obtener email del usuario si está logueado
      let email: string | undefined;
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data } = await supabase.auth.getUser();
        email = data.user?.email;
      } catch {}

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, planName, email, annual }),
      });

      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.demo) {
        setError("⚠️ Stripe aún no está configurado con claves reales.");
      } else {
        setError(data.error || "Error al iniciar el pago.");
      }
    } catch (err: any) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-medium text-sm text-center block transition-all disabled:opacity-50 ${className}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Procesando...
          </span>
        ) : (
          "Pagar con tarjeta"
        )}
      </button>
      {error && <p className="text-xs text-amber-400 mt-2 text-center">{error}</p>}
    </div>
  );
}