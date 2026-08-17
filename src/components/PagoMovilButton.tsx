"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";

interface PagoMovilButtonProps {
  planName: string;
  price: number;
  annual: boolean;
  className?: string;
}

// ================================================================
// DATOS DE PAGO — TUS DATOS REALES
// ================================================================
const PAYMENT_INFO = {
  phone: "584120687007",            // Tu WhatsApp
  pagoMovilPhone: "04120687007",    // Tu número de Pago Móvil
  pagoMovilBank: "Banco Nacional de Crédito (BNC)", // Tu banco
  pagoMovilCedula: "V-20107451",    // Tu cédula
  bankAccount: "PIDE TU NÚMERO DE CUENTA", // Tu cuenta (dime el número y lo pongo)
  bankName: "Banco Nacional de Crédito (BNC)",
};

export default function PagoMovilButton({ planName, price, annual, className = "" }: PagoMovilButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [tasa, setTasa] = useState<number | null>(null);

  // Obtener la tasa BCV automáticamente
  useEffect(() => {
    fetch("https://ve.dolarapi.com/v1/dolares/bcv")
      .then(r => r.json())
      .then(d => setTasa(d.promedio))
      .catch(() => setTasa(45)) // fallback si no carga
  }, []);

  const total = annual ? Math.round(price * 0.8 * 12) : price;
  const period = annual ? "año" : "mes";
  const usd = total;
  const bsf = tasa ? Math.round(usd * tasa) : 0;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola! 👋 Quiero pagar el plan *${planName}* (${annual ? "anual" : "mensual"})\n\n` +
    `💵 Monto: $${usd} USD (${period})\n\n` +
    `📲 Pago Móvil:\n` +
    `   Teléfono: ${PAYMENT_INFO.pagoMovilPhone}\n` +
    `   Banco: ${PAYMENT_INFO.pagoMovilBank}\n` +
    `   Cédula: ${PAYMENT_INFO.pagoMovilCedula}\n\n` +
    `o transferencia a:\n` +
    `   Banco: ${PAYMENT_INFO.bankName}\n` +
    `   Cuenta: ${PAYMENT_INFO.bankAccount}\n\n` +
    `Mi nombre: [TU NOMBRE]\n` +
    `Mi cédula: [TU CÉDULA]`
  );

  const waUrl = `https://wa.me/${PAYMENT_INFO.phone}?text=${whatsappMessage}`;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full py-3 rounded-xl font-medium text-sm text-center block transition-all ${className}`}
      >
        {open ? "Ocultar datos de pago" : `Pagar $${usd} con Pago Móvil`}
      </button>

      {open && (
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="text-center mb-2">
            <div className="text-lg font-bold">Plan {planName}</div>
            <div className="text-sm text-white/60">${usd} USD ({period}) {tasa ? <>≈ Bs. {bsf.toLocaleString()}</> : null}</div>
            {tasa && <div className="text-[10px] text-white/30 mt-1">Tasa BCV: Bs. {tasa.toFixed(2)}/$</div>}
          </div>

          {/* Pago Móvil */}
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60 uppercase">📲 Pago Móvil</span>
              <button onClick={() => copyToClipboard(`${PAYMENT_INFO.pagoMovilPhone} ${PAYMENT_INFO.pagoMovilBank} ${PAYMENT_INFO.pagoMovilCedula}`, "pm")} className="text-white/40 hover:text-white">
                {copied === "pm" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div><span className="text-white/40">Teléfono:</span> <span className="font-mono">{PAYMENT_INFO.pagoMovilPhone}</span></div>
              <div><span className="text-white/40">Banco:</span> {PAYMENT_INFO.pagoMovilBank}</div>
              <div><span className="text-white/40">Cédula:</span> {PAYMENT_INFO.pagoMovilCedula}</div>
            </div>
          </div>

          {/* Cuenta bancaria */}
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/60 uppercase">🏦 Transferencia</span>
              <button onClick={() => copyToClipboard(PAYMENT_INFO.bankAccount, "bank")} className="text-white/40 hover:text-white">
                {copied === "bank" ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="space-y-1 text-sm">
              <div><span className="text-white/40">Banco:</span> {PAYMENT_INFO.bankName}</div>
              <div><span className="text-white/40">Cuenta:</span> <span className="font-mono text-xs">{PAYMENT_INFO.bankAccount}</span></div>
            </div>
          </div>

          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl bg-[#25D366] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#25D366]/25 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Enviar comprobante por WhatsApp
          </a>
          <p className="text-[10px] text-white/30 text-center">
            Al pagar, envíanos el comprobante por WhatsApp y activamos tu plan al instante
          </p>
        </div>
      )}
    </div>
  );
}