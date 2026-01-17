"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiAlertTriangle, FiCheckCircle, FiMail } from "react-icons/fi";
import api from "@/src/lib/api";
import MainNavHeader from "@/src/components/MainNavHeader";

function ConfirmarEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Digite o código de 6 dígitos que enviamos para seu email."
  );
  const [loading, setLoading] = useState(false);
  const codeDigits = useMemo(
    () => code.padEnd(6, " ").slice(0, 6).split(""),
    [code]
  );

  const updateDigit = (idx: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 1);
    const chars = code.split("");
    chars[idx] = sanitized;
    const next = chars.join("");
    setCode(next);
  };

  const handlePasteCode = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
  };

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  const handleConfirm = async () => {
    setStatus("idle");
    setMessage("Validando código...");
    if (!email || code.length !== 6) {
      setStatus("error");
      setMessage("Informe o email e o código de 6 dígitos.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/Auth/confirm-email", { email, code });
      setStatus("success");
      setMessage(
        res?.data?.message ||
          "Email confirmado com sucesso. Agora você pode fazer login."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível confirmar seu email. Tente novamente.";
      setStatus("error");
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainNavHeader withoutNavbar={true} />
      <main className="min-h-screen flex items-center justify-center px-4 py-6 pt-20">
        <div className="w-full max-w-2xl">
          <div className="glass-liquid">
            <div className="glass-liquid-inner space-y-5 text-center">
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full border flex items-center justify-center ${
                    status === "success"
                      ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                      : status === "error"
                      ? "bg-amber-500/10 border-amber-400/40 text-amber-200"
                      : "border-white/10 text-(--muted-foreground)"
                  }`}
                >
                  {status === "success" ? (
                    <FiCheckCircle className="text-3xl" />
                  ) : status === "error" ? (
                    <FiAlertTriangle className="text-3xl" />
                  ) : (
                    <FiMail className="text-2xl" />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">Confirmação de email</h1>
                <p className="text-(--muted-foreground)">{message}</p>
              </div>

              <div className="space-y-3 text-left">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-(--muted-foreground)">
                    Email
                  </label>
                  <div className="glass-liquid">
                    <div className="glass-liquid-inner flex items-center gap-2">
                      <input
                        type="email"
                        className="w-full bg-transparent border-none outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@freelaverse.com"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-(--muted-foreground)">
                    Código de 6 dígitos
                  </label>
                  <div className="flex gap-2 justify-center">
                    {codeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className={`w-12 h-12 rounded-lg text-center text-lg font-semibold bg-white/5 border outline-none focus:border-(--brand) transition ${
                          status === "success"
                            ? "border-emerald-400/60 text-emerald-300"
                            : status === "error"
                            ? "border-red-400/60 text-red-200"
                            : "border-white/10 text-white"
                        }`}
                        value={digit.trim()}
                        onChange={(e) => {
                          updateDigit(idx, e.target.value);
                          if (e.target.value && idx < 5) {
                            const next = document.getElementById(`code-${idx + 1}`) as HTMLInputElement | null;
                            next?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !digit && idx > 0) {
                            const prev = document.getElementById(`code-${idx - 1}`) as HTMLInputElement | null;
                            prev?.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          handlePasteCode(e.clipboardData.getData("text"));
                        }}
                        id={`code-${idx}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-center gap-3 flex-wrap pt-1">
                  <button
                    type="button"
                    className="liquid-button px-4"
                    onClick={handleConfirm}
                    disabled={loading}
                  >
                    {loading ? "Validando..." : "Confirmar código"}
                  </button>
                  <Link
                    href="/cadastro"
                    className="liquid-button liquid-button--ghost"
                  >
                    Voltar ao cadastro
                  </Link>
                  <Link href="/login" className="text-sm text-white hover:underline">
                    Ir para login
                  </Link>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-(--muted-foreground)">
                <FiMail />
                <span>
                  Caso não encontre o email, verifique sua caixa de spam ou
                  promoções.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center px-4 py-6 pt-20">
          <p className="text-(--muted-foreground)">Carregando...</p>
        </main>
      }
    >
      <ConfirmarEmailContent />
    </Suspense>
  );
}
