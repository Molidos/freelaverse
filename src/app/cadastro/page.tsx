"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiDollarSign,
  FiGlobe,
  FiMail,
  FiPhone,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";

const areaOptions = [
  "Design & Motion",
  "Desenvolvimento Web",
  "Mobile",
  "Dados & IA",
  "Marketing Digital",
  "Conteúdo & Redação",
  "Suporte & CX",
];

const segmentos = [
  "Tecnologia",
  "E-commerce",
  "Educação",
  "Saúde",
  "Entretenimento",
  "Finanças",
  "Indústria",
];

export default function CadastroPage() {
  const [role, setRole] = useState<"cliente" | "profissional">("cliente");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleAreaToggle = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((item) => item !== area) : [...prev, area]
    );
  };

  const professionalInfo = useMemo(
    () => (
      <div className="space-y-6" aria-live="polite">
        <div className="space-y-2">
          <p className="font-semibold">Áreas de atuação</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {areaOptions.map((area) => (
              <label
                key={area}
                className={`rounded-2xl border px-4 py-3 text-sm cursor-pointer transition ${
                  selectedAreas.includes(area)
                    ? "border-white/40 bg-white/5 text-white"
                    : "border-white/10 text-(--muted-foreground)"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedAreas.includes(area)}
                  onChange={() => handleAreaToggle(area)}
                />
                {area}
              </label>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="experience">
              Tempo de experiência
            </label>
            <div className="glass-liquid">
              <div className="glass-liquid-inner">
                <input
                  id="experience"
                  name="experience"
                  type="text"
                  placeholder="Ex: 5 anos em UX/UI"
                  className="w-full bg-transparent border-none outline-none"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="rate">
              Faixa de cobrança/hora (BRL)
            </label>
            <div className="glass-liquid">
              <div className="glass-liquid-inner flex items-center gap-2">
                <FiDollarSign className="text-(--muted-foreground)" />
                <input
                  id="rate"
                  name="rate"
                  type="text"
                  placeholder="Ex: 120"
                  className="w-full bg-transparent border-none outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="portfolio">
            Portfólio ou site profissional
          </label>
          <div className="glass-liquid">
            <div className="glass-liquid-inner flex items-center gap-2">
              <FiGlobe className="text-(--muted-foreground)" />
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                placeholder="https://"
                className="w-full bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="bio">
            Bio profissional
          </label>
          <div className="glass-liquid">
            <div className="glass-liquid-inner">
              <textarea
                id="bio"
                name="bio"
                rows={4}
                placeholder="Conte rapidamente como você trabalha, cases recentes e diferenciais."
                className="w-full bg-transparent border-none outline-none resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    ),
    [selectedAreas]
  );

  const clientInfo = (
    <div className="space-y-6" aria-live="polite">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="company">
            Nome da empresa
          </label>
          <div className="glass-liquid">
            <div className="glass-liquid-inner">
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Ex: Nebula Labs"
                className="w-full bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="site">
            Site ou rede principal
          </label>
          <div className="glass-liquid">
            <div className="glass-liquid-inner flex items-center gap-2">
              <FiGlobe className="text-(--muted-foreground)" />
              <input
                id="site"
                name="site"
                type="url"
                placeholder="https://"
                className="w-full bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="segment">
            Segmento
          </label>
          <div className="glass-liquid">
            <div className="glass-liquid-inner">
              <select id="segment" name="segment" className="bg-transparent w-full outline-none border-none">
                <option value="">Selecione...</option>
                {segmentos.map((seg) => (
                  <option key={seg} value={seg}>
                    {seg}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="budget">
            Orçamento médio mensal
          </label>
          <div className="glass-liquid">
            <div className="glass-liquid-inner flex items-center gap-2">
              <FiDollarSign className="text-(--muted-foreground)" />
              <input
                id="budget"
                name="budget"
                type="text"
                placeholder="Ex: R$ 30.000"
                className="w-full bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="needs">
          Descreva suas necessidades
        </label>
        <div className="glass-liquid">
          <div className="glass-liquid-inner">
            <textarea
              id="needs"
              name="needs"
              rows={4}
              placeholder="Quais tipos de profissionais você precisa? Qual o próximo projeto?"
              className="w-full bg-transparent border-none outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="relative min-h-screen pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto section-block space-y-8">
        <div className="space-y-3 text-center">
          <p className="pill mx-auto">Cadastro</p>
          <h1 className="text-3xl md:text-4xl font-bold">Crie sua conta no Freelaverse</h1>
          <p className="text-(--muted-foreground)">
            Escolha como deseja participar do ecossistema: conectando talentos ou oferecendo suas habilidades.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4" role="tablist" aria-label="Tipo de cadastro">
          {[
            { id: "cliente", label: "Sou cliente", desc: "Publicar e gerenciar projetos" },
            { id: "profissional", label: "Sou profissional", desc: "Oferecer serviços e fechar jobs" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={role === tab.id}
              onClick={() => setRole(tab.id as typeof role)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                role === tab.id
                  ? "border-white/30 bg-white/5 text-white shadow-[0_15px_40px_rgba(4,6,20,0.5)]"
                  : "border-white/10 text-(--muted-foreground)"
              }`}
            >
              <p className="font-semibold">{tab.label}</p>
              <p className="text-xs text-(--muted-foreground)">{tab.desc}</p>
            </button>
          ))}
        </div>

        <form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="name">
                Nome completo
              </label>
              <div className="glass-liquid">
                <div className="glass-liquid-inner flex items-center gap-2">
                  <FiUser className="text-(--muted-foreground)" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome"
                    className="w-full bg-transparent border-none outline-none"
                    required
                  />
                </div>
              </div>
            </div>
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="phone">
                Telefone/WhatsApp
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
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-(--muted-foreground)" htmlFor="password">
                Crie uma senha
              </label>
              <div className="glass-liquid">
                <div className="glass-liquid-inner">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    className="w-full bg-transparent border-none outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {role === "profissional" ? professionalInfo : clientInfo}

          <button type="submit" className="liquid-button w-full justify-center">
            <span>
              <FiUserPlus /> Finalizar cadastro como {role === "cliente" ? "Cliente" : "Profissional"}
            </span>
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-4 text-sm text-(--muted-foreground)">
          <div className="flex items-start gap-2">
            <FiCheckCircle className="text-(--brand) mt-1" />
            <p>Clientes têm curadoria dedicada para encontrar os talentos ideais.</p>
          </div>
          <div className="flex items-start gap-2">
            <FiCheckCircle className="text-(--brand) mt-1" />
            <p>Profissionais recebem briefings completos e pagamentos garantidos pelo escrow.</p>
          </div>
        </div>

        <p className="text-center text-sm text-(--muted-foreground)">
          Já possui conta?{" "}
          <Link href="/login" className="text-(--brand) font-semibold hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}



