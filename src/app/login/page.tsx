\"use client\";

import Link from \"next/link\";
import { useState } from \"react\";
import { FiLock, FiLogIn, FiMail, FiUser } from \"react-icons/fi\";

const accessModes = [
  { id: \"cliente\", label: \"Sou cliente\", description: \"Entrar para publicar projetos\" },
  { id: \"profissional\", label: \"Sou profissional\", description: \"Entrar para gerenciar jobs\" },
];

export default function LoginPage() {
  const [mode, setMode] = useState<\"cliente\" | \"profissional\">(\"cliente\");

  return (
    <main className=\"relative min-h-screen pt-32 pb-16 px-6\">
      <div className=\"max-w-4xl mx-auto section-block\">
        <div className=\"flex flex-col gap-8\">
          <div className=\"space-y-3 text-center\">
            <p className=\"pill mx-auto\">Bem-vindo de volta</p>
            <h1 className=\"text-3xl md:text-4xl font-bold\">Faça login no Freelaverse</h1>
            <p className=\"text-(--muted-foreground)\">
              Acesse seus projetos em andamento, acompanhe propostas e continue explorando novas possibilidades.
            </p>
          </div>

          <div className=\"grid sm:grid-cols-2 gap-4\" role=\"tablist\" aria-label=\"Escolha seu perfil\">
            {accessModes.map((item) => (
              <button
                key={item.id}
                type=\"button\"
                role=\"tab\"
                aria-selected={mode === item.id}
                onClick={() => setMode(item.id as typeof mode)}
                className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                  mode === item.id
                    ? \"border-white/30 bg-white/5 text-white shadow-[0_15px_35px_rgba(4,6,20,0.45)]\"
                    : \"border-white/10 bg-white/0 text-(--muted-foreground)\"
                }`}
              >
                <p className=\"font-semibold\">{item.label}</p>
                <p className=\"text-xs text-(--muted-foreground)\">{item.description}</p>
              </button>
            ))}
          </div>

          <form className=\"space-y-4\">
            <div className=\"space-y-2\">
              <label className=\"text-sm font-semibold text-(--muted-foreground)\" htmlFor=\"email\">
                E-mail
              </label>
              <div className=\"glass-liquid\">
                <div className=\"glass-liquid-inner flex items-center gap-3 py-3 px-4\">
                  <FiMail className=\"text-(--muted-foreground)\" />
                  <input
                    id=\"email\"
                    name=\"email\"
                    type=\"email\"
                    placeholder=\"voce@freelaverse.com\"
                    className=\"w-full bg-transparent border-none outline-none text-base\"
                    required
                  />
                </div>
              </div>
            </div>

            <div className=\"space-y-2\">
              <label className=\"text-sm font-semibold text-(--muted-foreground)\" htmlFor=\"password\">
                Senha
              </label>
              <div className=\"glass-liquid\">
                <div className=\"glass-liquid-inner flex items-center gap-3 py-3 px-4\">
                  <FiLock className=\"text-(--muted-foreground)\" />
                  <input
                    id=\"password\"
                    name=\"password\"
                    type=\"password\"
                    placeholder=\"Digite sua senha\"
                    className=\"w-full bg-transparent border-none outline-none text-base\"
                    required
                  />
                </div>
              </div>
            </div>

            <div className=\"flex flex-wrap items-center justify-between gap-3 text-sm text-(--muted-foreground)\">
              <label className=\"inline-flex items-center gap-2\">
                <input type=\"checkbox\" className=\"accent-(--brand)\" name=\"keepSigned\" />
                Manter conectado
              </label>
              <button type=\"button\" className=\"underline underline-offset-4 hover:text-foreground\">
                Esqueci minha senha
              </button>
            </div>

            <button type=\"submit\" className=\"liquid-button w-full justify-center\">
              <span>
                <FiLogIn /> Entrar como {mode === \"cliente\" ? \"Cliente\" : \"Profissional\"}
              </span>
            </button>
          </form>

          <div className=\"grid md:grid-cols-2 gap-4\">
            <div className=\"glass-liquid-inner bg-white/0 border border-white/10 rounded-2xl p-4 flex flex-col gap-1\">
              <p className=\"text-sm font-semibold flex items-center gap-2\">
                <FiUser /> Cliente
              </p>
              <p className=\"text-xs text-(--muted-foreground)\">
                Publique novos projetos, revise propostas e mantenha pagamentos sob controle.
              </p>
            </div>
            <div className=\"glass-liquid-inner bg-white/0 border border-white/10 rounded-2xl p-4 flex flex-col gap-1\">
              <p className=\"text-sm font-semibold flex items-center gap-2\">
                <FiUser /> Profissional
              </p>
              <p className=\"text-xs text-(--muted-foreground)\">
                Atualize seu portfólio, responda briefings rapidamente e acompanhe milestones.
              </p>
            </div>
          </div>

          <p className=\"text-center text-sm text-(--muted-foreground)\">
            Ainda não possui conta?{" "}
            <Link href=\"/cadastro\" className=\"text-(--brand) font-semibold hover:underline\">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}



