"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import api from "@/src/lib/api";
import MainNavHeader from "@/src/components/MainNavHeader";

type Step = "request" | "code" | "done";

function RecuperarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Informe seu email para receber um código de recuperação."
  );
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const autoSentRef = useRef(false);

  const codeDigits = useMemo(
    () => code.padEnd(6, " ").slice(0, 6).split(""),
    [code]
  );

  const updateDigit = (idx: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 1);
    const chars = code.split("");
    chars[idx] = sanitized;
    setCode(chars.join(""));
  };

  const handlePasteCode = (text: string) => {
    setCode(text.replace(/\D/g, "").slice(0, 6));
  };

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const resetCountdown = () => setSecondsLeft(300);

  const formatSeconds = (value: number) => {
    const m = Math.floor(value / 60);
    const s = value % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ── Solicitar código ── */
  const handleRequestCode = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Informe o email.");
      return;
    }

    try {
      setLoading(true);
      setStatus("idle");
      setMessage("Enviando código de recuperação...");
      const res = await api.post("/Auth/request-password-reset", { email });
      resetCountdown();
      setCode("");
      setStep("code");
      setMessage(
        res?.data?.message ??
          "Enviamos um código para seu email. Ele expira em 5 minutos."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível enviar o código. Tente novamente.";
      setStatus("error");
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Reenviar código ── */
  const handleResend = async () => {
    if (!email) return;
    try {
      setLoading(true);
      setStatus("idle");
      setMessage("Reenviando código...");
      const res = await api.post("/Auth/request-password-reset", { email });
      resetCountdown();
      setCode("");
      setMessage(
        res?.data?.message ?? "Novo código enviado. Verifique seu email."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível reenviar o código. Tente novamente.";
      setStatus("error");
      setMessage(msg);
      setSecondsLeft(0);
    } finally {
      setLoading(false);
    }
  };

  /* ── Redefinir senha ── */
  const handleResetPassword = async () => {
    setStatus("idle");

    if (!email || code.length !== 6) {
      setStatus("error");
      setMessage("Informe o email e o código de 6 dígitos.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setStatus("error");
      setMessage("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Redefinindo senha...");
      const res = await api.post("/Auth/reset-password", {
        email,
        code,
        newPassword,
      });
      setStatus("success");
      setMessage(
        res?.data?.message ??
          "Senha redefinida com sucesso! Redirecionando para login..."
      );
      setStep("done");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível redefinir a senha. Tente novamente.";
      setStatus("error");
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const iconCls =
    status === "success"
      ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
      : status === "error"
      ? "bg-amber-500/10 border-amber-400/40 text-amber-200"
      : "border-white/10 text-(--muted-foreground)";

  return (
    <>
      <MainNavHeader withoutNavbar={true} />
      <main className="min-h-screen flex items-center justify-center px-4 py-6 pt-20">
        <div className="w-full max-w-2xl">
          <div className="glass-liquid">
            <div className="glass-liquid-inner space-y-5 text-center">
              {/* Ícone */}
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full border flex items-center justify-center ${iconCls}`}
                >
                  {status === "success" ? (
                    <FiCheckCircle className="text-3xl" />
                  ) : status === "error" ? (
                    <FiAlertTriangle className="text-3xl" />
                  ) : (
                    <FiLock className="text-2xl" />
                  )}
                </div>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">
                  {step === "done"
                    ? "Senha redefinida"
                    : "Recuperação de senha"}
                </h1>
                <p className="text-(--muted-foreground)">{message}</p>
              </div>

              <div className="space-y-3 text-left">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-(--muted-foreground)">
                    Email
                  </label>
                  <div className="glass-liquid">
                    <div className="glass-liquid-inner flex items-center gap-2">
                      <FiMail className="text-(--muted-foreground)" />
                      <input
                        type="email"
                        className="w-full bg-transparent border-none outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@freelaverse.com"
                        disabled={step === "code" || step === "done"}
                      />
                    </div>
                  </div>
                </div>

                {/* Etapa 1: botão de enviar código */}
                {step === "request" && (
                  <div className="flex justify-center gap-3 flex-wrap pt-2">
                    <button
                      type="button"
                      className="liquid-button px-6"
                      onClick={handleRequestCode}
                      disabled={loading}
                    >
                      {loading ? "Enviando..." : "Enviar código"}
                    </button>
                    <Link
                      href="/login"
                      className="liquid-button liquid-button--ghost"
                    >
                      Voltar ao login
                    </Link>
                  </div>
                )}

                {/* Etapa 2: código + nova senha */}
                {step === "code" && (
                  <>
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
                                const next = document.getElementById(
                                  `reset-code-${idx + 1}`
                                ) as HTMLInputElement | null;
                                next?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !digit &&
                                idx > 0
                              ) {
                                const prev = document.getElementById(
                                  `reset-code-${idx - 1}`
                                ) as HTMLInputElement | null;
                                prev?.focus();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              handlePasteCode(
                                e.clipboardData.getData("text")
                              );
                            }}
                            id={`reset-code-${idx}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-(--muted-foreground)">
                        Nova senha
                      </label>
                      <div className="glass-liquid">
                        <div className="glass-liquid-inner flex items-center gap-2">
                          <FiLock className="text-(--muted-foreground)" />
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-transparent border-none outline-none"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres"
                          />
                          <button
                            type="button"
                            className="text-(--muted-foreground) hover:text-foreground transition"
                            onClick={() => setShowPassword((p) => !p)}
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-(--muted-foreground)">
                        Confirme a nova senha
                      </label>
                      <div className="glass-liquid">
                        <div className="glass-liquid-inner flex items-center gap-2">
                          <FiLock className="text-(--muted-foreground)" />
                          <input
                            type={showConfirm ? "text" : "password"}
                            className="w-full bg-transparent border-none outline-none"
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(e.target.value)
                            }
                            placeholder="Repita a nova senha"
                          />
                          <button
                            type="button"
                            className="text-(--muted-foreground) hover:text-foreground transition"
                            onClick={() => setShowConfirm((p) => !p)}
                          >
                            {showConfirm ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 flex-wrap pt-2">
                      <button
                        type="button"
                        className="liquid-button px-6"
                        onClick={handleResetPassword}
                        disabled={loading}
                      >
                        {loading ? "Redefinindo..." : "Redefinir senha"}
                      </button>
                      <button
                        type="button"
                        className="liquid-button liquid-button--ghost px-4"
                        onClick={handleResend}
                        disabled={loading || secondsLeft > 0}
                      >
                        {secondsLeft > 0
                          ? `Reenviar em ${formatSeconds(secondsLeft)}`
                          : loading
                          ? "Enviando..."
                          : "Reenviar código"}
                      </button>
                    </div>
                  </>
                )}

                {/* Etapa 3: concluído */}
                {step === "done" && (
                  <div className="flex justify-center gap-3 flex-wrap pt-2">
                    <Link href="/login" className="liquid-button px-6">
                      Ir para login
                    </Link>
                  </div>
                )}
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

export default function RecuperarSenhaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center px-4 py-6 pt-20">
          <p className="text-(--muted-foreground)">Carregando...</p>
        </main>
      }
    >
      <RecuperarContent />
    </Suspense>
  );
}
