"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiHome,
  FiImage,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import api from "@/src/lib/api";
import MainNavHeader from "@/src/components/MainNavHeader";

type UserType = 1 | 2; // 1 = cliente, 2 = profissional

type FormData = {
  userName: string;
  email: string;
  password: string;
  userType: UserType;
  profileImageUrl: string;
  street: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  phone: string;
  userProfessionalArea: string[];
};

type ProfessionalArea = {
  id: string;
  name: string;
};

const steps = ["Conta", "Contato e Endereço", "Preferências"];

export default function CadastroUsuarioPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [confirmFeedback, setConfirmFeedback] = useState<string | null>(null);
  const [areaInput, setAreaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [data, setData] = useState<FormData>({
    userName: "",
    email: "",
    password: "",
    userType: 1,
    profileImageUrl: "",
    street: "",
    number: "",
    complement: "",
    zipCode: "",
    city: "",
    state: "",
    phone: "",
    userProfessionalArea: [],
  });
  const [areas, setAreas] = useState<ProfessionalArea[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [areasError, setAreasError] = useState<string | null>(null);
  const [confirmStatus, setConfirmStatus] = useState<"idle" | "success" | "error">("idle");
  const codeDigits = confirmationCode.padEnd(6, " ").slice(0, 6).split("");

  const updateDigit = (idx: number, value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 1);
    const chars = confirmationCode.split("");
    chars[idx] = sanitized;
    const next = chars.join("");
    setConfirmationCode(next);
  };

  const handlePasteCode = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 6);
    setConfirmationCode(digits);
  };

  useEffect(() => {
    if (!completed || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [completed, secondsLeft]);

  const resetCountdown = () => setSecondsLeft(60);

  const formatSeconds = (value: number) =>
    new Date(value * 1000).toISOString().substring(14, 19);

  const isProfessional = useMemo(() => data.userType === 2, [data.userType]);

  const handleChange = (
    field: keyof FormData,
    value: string | UserType | string[]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (field === "userType" && value === 1) {
      setData((prev) => ({ ...prev, userProfessionalArea: [] }));
    }
  };

  const handleAddArea = () => {
    const trimmed = areaInput.trim();
    if (!trimmed) return;
    if (data.userProfessionalArea.includes(trimmed)) return;
    handleChange("userProfessionalArea", [
      ...data.userProfessionalArea,
      trimmed,
    ]);
    setAreaInput("");
  };

  useEffect(() => {
    const fetchAreas = async () => {
      setLoadingAreas(true);
      setAreasError(null);
      try {
        const res = await api.get<ProfessionalArea[]>("/ProfessionalAreas");
        setAreas(res.data);
      } catch (err: any) {
        const message =
          err?.response?.data?.message || "Não foi possível carregar as áreas.";
        setAreasError(message);
      } finally {
        setLoadingAreas(false);
      }
    };

    if (isProfessional && areas.length === 0) {
      fetchAreas();
    }
  }, [isProfessional, areas.length]);

  const validateStep = () => {
    setError(null);
    switch (step) {
      case 0:
        if (!data.userName || !data.email || !data.password)
          return setError("Preencha nome, e-mail e senha."), false;
        if (data.password.length < 8)
          return setError("A senha deve ter pelo menos 8 caracteres."), false;
        if (data.password !== confirmPassword)
          return setError("As senhas não coincidem."), false;
        return true;
      case 1:
        if (
          !data.phone ||
          !data.street ||
          !data.number ||
          !data.zipCode ||
          !data.city ||
          !data.state
        ) {
          return (
            setError(
              "Preencha telefone, endereço completo, CEP, cidade e estado."
            ),
            false
          );
        }
        return true;
      case 2:
        if (isProfessional && data.userProfessionalArea.length === 0) {
          return setError("Adicione pelo menos uma área profissional."), false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...data,
        userProfessionalArea: isProfessional ? data.userProfessionalArea : [],
      };
      await api.post("/Auth/register", payload);
      setSuccess(null);
      setConfirmationEmail(data.email);
      setCompleted(true);
      setConfirmStatus("idle");
      setConfirmFeedback(
        "Enviamos um código de 6 dígitos para seu email. Ele é válido por 1 minuto. Confirme para finalizar o cadastro."
      );
      setConfirmationCode("");
      resetCountdown();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Não foi possível concluir o cadastro.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loginAfterConfirm = async () => {
    const email = confirmationEmail || data.email;
    const password = data.password;
    if (!email || !password) {
      setConfirmFeedback("Email confirmado! Agora você pode fazer login.");
      setConfirmStatus("success");
      return;
    }

    try {
      const { data: loginData } = await api.post("/Auth/login", {
        email,
        password,
      });

      const token =
        loginData?.token ?? loginData?.accessToken ?? loginData?.authToken;
      const userTypeRaw =
        loginData?.userType ??
        loginData?.user?.userType ??
        loginData?.user?.type ??
        loginData?.type;
      const userType =
        typeof userTypeRaw === "number" ? String(userTypeRaw) : userTypeRaw;
      const userId = loginData?.user?.id ?? loginData?.userId ?? loginData?.id;

      if (token) {
        document.cookie = `authToken=${encodeURIComponent(
          token
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      if (userType) {
        document.cookie = `userType=${encodeURIComponent(
          userType
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      if (userId) {
        document.cookie = `userId=${encodeURIComponent(
          userId
        )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      setConfirmFeedback(
        "Email confirmado e login realizado! Redirecionando para o painel..."
      );
      setConfirmStatus("success");

      if (userType === "1") {
        router.push("/client");
      } else if (userType === "2") {
        router.push("/professional");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Email confirmado, mas login falhou.";
      setConfirmFeedback(msg);
      setConfirmStatus("error");
    }
  };

  const handleResendCode = async () => {
    if (!confirmationEmail) {
      setConfirmStatus("error");
      setConfirmFeedback("Informe o email para reenviar o código.");
      return;
    }
    try {
      setResending(true);
      setConfirmStatus("idle");
      setConfirmFeedback("Enviando novo código...");
      const res = await api.post("/Auth/resend-email-confirmation", {
        email: confirmationEmail,
      });
      setConfirmationCode("");
      resetCountdown();
      setConfirmFeedback(
        res?.data?.message ?? "Novo código enviado. Verifique seu email."
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Não foi possível reenviar o código. Tente novamente.";
      setConfirmStatus("error");
      setConfirmFeedback(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
    <MainNavHeader withoutNavbar={true}/>
    <main className="min-h-screen flex items-center justify-center px-4 py-6 pt-20">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center mb-3 space-y-2">
          <p className="pill mx-auto">Siga as etapas do cadastro abaixo</p>
        </div>

        {completed ? (
          <div className="glass-liquid">
            <div className="glass-liquid-inner flex flex-col items-center gap-4 text-center">
              <div
                className={`w-16 h-16 rounded-full border flex items-center justify-center ${
                  confirmStatus === "success"
                    ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-300"
                    : confirmStatus === "error"
                    ? "bg-red-500/10 border-red-400/40 text-red-200"
                    : "border-white/15 text-(--muted-foreground)"
                }`}
              >
                <FiCheckCircle className="text-3xl" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  Confirme seu email para concluir
                </h2>
                <p className="text-(--muted-foreground)">
                  Enviamos um código de 6 dígitos para seu email. Digite abaixo
                  para ativar sua conta. Só depois você poderá fazer login.
                </p>
              </div>
              <div className="w-full max-w-md space-y-3 text-left">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-(--muted-foreground)">
                    Email
                  </label>
                  <div className="glass-liquid">
                    <div className="glass-liquid-inner flex items-center gap-2">
                      <input
                        type="email"
                        className="w-full bg-transparent border-none outline-none"
                        value={confirmationEmail}
                        onChange={(e) => setConfirmationEmail(e.target.value)}
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
                          confirmStatus === "success"
                            ? "border-emerald-400/60 text-emerald-300"
                            : confirmStatus === "error"
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
                {confirmFeedback && (
                  <div
                    className={`text-sm ${
                      confirmStatus === "success"
                        ? "text-emerald-200"
                        : confirmStatus === "error"
                        ? "text-red-200"
                        : "text-(--muted-foreground)"
                    }`}
                  >
                    {confirmFeedback}
                  </div>
                )}
                <div className="flex gap-3 flex-wrap items-center">
                  <button
                    type="button"
                    className="liquid-button px-4"
                    onClick={async () => {
                      setConfirmFeedback(null);
                      setConfirmStatus("idle");
                      if (!confirmationEmail || confirmationCode.length !== 6) {
                        setConfirmFeedback(
                          "Informe o email e o código de 6 dígitos."
                        );
                        setConfirmStatus("error");
                        return;
                      }
                      try {
                        setConfirming(true);
                        const res = await api.post("/Auth/confirm-email", {
                          email: confirmationEmail,
                          code: confirmationCode,
                        });
                        setConfirmFeedback(
                          res?.data?.message ||
                            "Email confirmado! Agora você pode fazer login."
                        );
                        setConfirmStatus("success");
                        await loginAfterConfirm();
                      } catch (err: any) {
                        const msg =
                          err?.response?.data?.message ||
                          "Não foi possível confirmar o email.";
                        setConfirmFeedback(msg);
                        setConfirmStatus("error");
                      } finally {
                        setConfirming(false);
                      }
                    }}
                    disabled={confirming}
                  >
                    {confirming ? "Confirmando..." : "Confirmar código"}
                  </button>
                  <button
                    type="button"
                    className="liquid-button liquid-button--ghost px-4"
                    onClick={handleResendCode}
                    disabled={resending || secondsLeft > 0}
                  >
                    {secondsLeft > 0
                      ? `Reenviar em ${formatSeconds(secondsLeft)}`
                      : resending
                      ? "Enviando..."
                      : "Reenviar código"}
                  </button>
                  <Link href="/login" className="liquid-button liquid-button--ghost">
                    Ir para login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center gap-3 text-sm text-(--muted-foreground)">
              {steps.map((label, index) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                      index === step
                        ? "border-(--brand) bg-(--brand)/20 text-(--brand)"
                        : "border-white/10 text-(--muted-foreground)"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={index === step ? "text-white font-semibold" : ""}
                  >
                    {label}
                  </span>
                  {index < steps.length - 1 && (
                    <span className="w-8 h-px bg-white/10" />
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="glass-liquid border border-red-500/30">
                <div className="glass-liquid-inner text-sm text-red-200">
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className="glass-liquid border border-emerald-500/30">
                <div className="glass-liquid-inner text-sm text-emerald-200">
                  {success}
                </div>
              </div>
            )}

            <div className="glass-liquid max-h-[82vh] overflow-hidden">
              <div className="glass-liquid-inner space-y-5 max-h-[80vh] overflow-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{steps[step]}</h2>
                </div>

                {step === 0 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="userName"
                        >
                          Nome completo
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiUser className="text-(--muted-foreground)" />
                            <input
                              id="userName"
                              name="userName"
                              type="text"
                              placeholder="Seu nome"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.userName}
                              onChange={(e) =>
                                handleChange("userName", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="email"
                        >
                          E-mail
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiMail className="text-(--muted-foreground)" />
                            <input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="voce@freelaverse.com"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.email}
                              onChange={(e) =>
                                handleChange("email", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="password"
                        >
                          Senha
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiLock className="text-(--muted-foreground)" />
                            <input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 8 caracteres"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.password}
                              onChange={(e) =>
                                handleChange("password", e.target.value)
                              }
                              required
                            />
                            <button
                              type="button"
                              className="text-(--muted-foreground) hover:text-foreground transition"
                              onClick={() => setShowPassword((prev) => !prev)}
                              aria-label={
                                showPassword ? "Ocultar senha" : "Mostrar senha"
                              }
                            >
                              {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="confirmPassword"
                        >
                          Confirmar senha
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiLock className="text-(--muted-foreground)" />
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirm ? "text" : "password"}
                              placeholder="Repita a senha"
                              className="w-full bg-transparent border-none outline-none"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              required
                            />
                            <button
                              type="button"
                              className="text-(--muted-foreground) hover:text-foreground transition"
                              onClick={() => setShowConfirm((prev) => !prev)}
                              aria-label={
                                showConfirm
                                  ? "Ocultar confirmação"
                                  : "Mostrar confirmação"
                              }
                            >
                              {showConfirm ? <FiEyeOff /> : <FiEye />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-sm font-semibold text-(--muted-foreground)">
                        Tipo de conta
                      </p>
                      <div
                        className="grid md:grid-cols-2 gap-3"
                        role="radiogroup"
                      >
                        {[
                          {
                            id: 1 as UserType,
                            label: "Cliente",
                            desc: "Publicar projetos",
                          },
                          {
                            id: 2 as UserType,
                            label: "Profissional",
                            desc: "Oferecer serviços",
                          },
                        ].map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={data.userType === option.id}
                            onClick={() => handleChange("userType", option.id)}
                            className={`rounded-2xl border px-4 py-3 text-left transition ${
                              data.userType === option.id
                                ? "border-white/30 bg-white/5 text-white shadow-[0_12px_30px_rgba(4,6,20,0.4)]"
                                : "border-white/10 text-(--muted-foreground)"
                            }`}
                          >
                            <p className="font-semibold">{option.label}</p>
                            <p className="text-xs text-(--muted-foreground)">
                              {option.desc}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="phone"
                        >
                          Telefone
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiPhone className="text-(--muted-foreground)" />
                            <input
                              id="phone"
                              name="phone"
                              type="tel"
                              placeholder="(11) 99999-0000"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.phone}
                              onChange={(e) =>
                                handleChange("phone", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="zipCode"
                        >
                          CEP
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiMapPin className="text-(--muted-foreground)" />
                            <input
                              id="zipCode"
                              name="zipCode"
                              type="text"
                              placeholder="00000-000"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.zipCode}
                              onChange={(e) =>
                                handleChange("zipCode", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="space-y-1.5 md:col-span-2">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="street"
                        >
                          Rua / Avenida
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <FiHome className="text-(--muted-foreground)" />
                            <input
                              id="street"
                              name="street"
                              type="text"
                              placeholder="Ex: Rua das Estrelas"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.street}
                              onChange={(e) =>
                                handleChange("street", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="number"
                        >
                          Número
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <input
                              id="number"
                              name="number"
                              type="text"
                              placeholder="123"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.number}
                              onChange={(e) =>
                                handleChange("number", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="complement"
                        >
                          Complemento
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <input
                              id="complement"
                              name="complement"
                              type="text"
                              placeholder="Apto, bloco, referência"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.complement}
                              onChange={(e) =>
                                handleChange("complement", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="city"
                        >
                          Cidade
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <input
                              id="city"
                              name="city"
                              type="text"
                              placeholder="São Paulo"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.city}
                              onChange={(e) =>
                                handleChange("city", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          className="text-sm font-semibold text-(--muted-foreground)"
                          htmlFor="state"
                        >
                          Estado
                        </label>
                        <div className="glass-liquid">
                          <div className="glass-liquid-inner flex items-center gap-2">
                            <input
                              id="state"
                              name="state"
                              type="text"
                              placeholder="SP"
                              className="w-full bg-transparent border-none outline-none"
                              value={data.state}
                              onChange={(e) =>
                                handleChange("state", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-3">
                    {!isProfessional ? (
                      <div className="text-(--muted-foreground) text-sm">
                        Como cliente, siga para concluir o cadastro.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-(--muted-foreground)">
                              Áreas profissionais
                            </p>
                            {loadingAreas && (
                              <span className="text-xs text-(--muted-foreground)">
                                Carregando...
                              </span>
                            )}
                          </div>
                          {areasError && (
                            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                              {areasError}
                            </div>
                          )}
                          <div className="grid md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 scroll-soft">
                            {areas.map((area) => {
                              const selected =
                                data.userProfessionalArea.includes(area.id);
                              return (
                                <button
                                  key={area.id}
                                  type="button"
                                  onClick={() =>
                                    handleChange(
                                      "userProfessionalArea",
                                      selected
                                        ? data.userProfessionalArea.filter(
                                            (id) => id !== area.id
                                          )
                                        : [
                                            ...data.userProfessionalArea,
                                            area.id,
                                          ]
                                    )
                                  }
                                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                                    selected
                                      ? "border-(--brand) bg-(--brand)/15 text-white"
                                      : "border-white/10 text-(--muted-foreground)"
                                  }`}
                                >
                                  <p className="font-semibold">{area.name}</p>
                                </button>
                              );
                            })}
                            {loadingAreas && areas.length === 0 && (
                              <div className="col-span-2 text-sm text-(--muted-foreground)">
                                Buscando áreas...
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-(--muted-foreground)">
                          Selecione pelo menos uma área.
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    className="liquid-button liquid-button--ghost px-4"
                    onClick={prevStep}
                    disabled={step === 0}
                    aria-disabled={step === 0}
                  >
                    <FiArrowLeft /> Voltar
                  </button>

                  <Link
                    href="/login"
                    className="text-sm text-white hover:underline"
                  >
                    Já possui uma conta? Faça login
                  </Link>

                  {step < steps.length - 1 ? (
                    <button
                      type="button"
                      className="liquid-button px-4"
                      onClick={nextStep}
                    >
                      Próximo <FiArrowRight />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="liquid-button px-4"
                      onClick={handleSubmit}
                      disabled={loading}
                      aria-busy={loading}
                    >
                      {loading ? "Enviando..." : "Concluir cadastro"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
    </>
  );
}
