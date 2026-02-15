"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiCheckCircle } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import api from "../../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data } = await api.post("/Auth/login", { email, password });

      // Fallbacks para token e userType conforme possíveis respostas da API
      const token = data?.token ?? data?.accessToken ?? data?.authToken;
      const userTypeRaw = data?.userType ?? data?.user?.userType ?? data?.user?.type ?? data?.type;
      const userType = typeof userTypeRaw === "number" ? String(userTypeRaw) : userTypeRaw;
      const userId = data?.user?.id ?? data?.userId ?? data?.id;

      console.log("Dados recebidos no login:", data);

      setSuccess("Login realizado com sucesso! Redirecionando...");

      // Persiste token, tipo e id em cookies para futuras requisições
      if (token) {
        document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      if (userType) {
        document.cookie = `userType=${encodeURIComponent(userType)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      if (userId) {
        document.cookie = `userId=${encodeURIComponent(userId)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      // Redireciona para dashboard conforme userType (1 cliente, 2 profissional)
      if (userType === "1") {
        router.push("/client");
      } else if (userType === "2") {
        router.push("/professional");
      } else if (!userType) {
        setError("Não foi possível identificar o tipo de usuário. Tente novamente.");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || "Não foi possível fazer login.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center px-6">
      <div className="max-w-5xl mx-auto section-block grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="pill">Login</p>
          <h1 className="text-3xl md:text-4xl font-bold">Entre no Freelaverse</h1>
          <p className="text-(--muted-foreground)">
            Acesse seu painel para continuar propostas, conversar com clientes e acompanhar pagamentos em tempo real.
          </p>
          <div className="space-y-2 text-(--muted-foreground)">
            <div className="inline-flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" /> Segurança com sessões protegidas
            </div>
            <div className="inline-flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" /> Alertas instantâneos sobre milestones
            </div>
            <div className="inline-flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" /> Experiência otimizada para desktop e mobile
            </div>
          </div>
          <div className="text-sm text-(--muted-foreground)">
            Novo por aqui?{" "}
            <Link href="/cadastro" className="text-(--brand) font-semibold hover:underline">
              Crie sua conta em minutos
            </Link>
          </div>
        </div>

        <div className="glass-liquid">
          <div className="glass-liquid-inner space-y-6">
            {error && (
              <div className="glass-liquid border border-red-500/30">
                <div className="glass-liquid-inner text-sm text-red-200">{error}</div>
              </div>
            )}
            

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="email">
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
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="password">
                  Senha
                </label>
                <div className="glass-liquid">
                  <div className="glass-liquid-inner flex items-center gap-2">
                    <FiLock className="text-(--muted-foreground)" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="w-full bg-transparent border-none outline-none"
                      required
                    />
                    <button
                      type="button"
                      className="text-(--muted-foreground) hover:text-foreground transition"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              </div>

              
              <div className="flex items-center justify-between text-sm text-(--muted-foreground)">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" className="accent-(--brand)" />
                  Lembrar de mim
                </label>
                <Link href="/recuperar" className="text-(--brand) font-semibold hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              {success && (
                <div className="glass-liquid border border-emerald-500/30">
                  <div className="glass-liquid-inner text-sm text-emerald-200">{success}</div>
                </div>
              )}
              <button type="submit" className="liquid-button w-full justify-center" disabled={loading} aria-busy={loading}>
                <FiLogIn className="text-lg" /> {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <div className="space-y-3">
              <div className="text-center text-xs uppercase tracking-[0.3em] text-(--muted-foreground)">
                ou
              </div>
              <button type="button" className="liquid-button liquid-button--ghost w-full justify-center">
                <FaGoogle /> Entrar com Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

