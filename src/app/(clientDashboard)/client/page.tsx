"use client";

import { useEffect, useState } from "react";
import {
  FiPlus,
  FiSend,
  FiMapPin,
  FiClock,
  FiTag,
  FiClipboard,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../../lib/api";

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Estados do formulário (JSON)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "",
    address: "",
  });

  const getCookie = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const fetchUserData = async () => {
    const token = getCookie("authToken");
    if (!token) return;

    try {
      const res = await api.get("/Auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
    } catch (err) {
      console.error("Erro ao buscar dados do usuário", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const token = getCookie("authToken");
    const userId = getCookie("userId");

    if (!userId || !token) {
      setMessage({
        type: "error",
        text: "Usuário não autenticado. Faça login novamente.",
      });
      setLoading(false);
      return;
    }

    const payload = {
      id: crypto.randomUUID(),
      ...form,
      status: "Pendente",
      userId: userId,
      Email: userData?.email,
      ProfileImageUrl: userData?.profileImageUrl || "teste",
    };

    try {
      await api.post("/Services", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({
        type: "success",
        text: "Pedido de serviço criado com sucesso!",
      });
      setForm({
        title: "",
        description: "",
        category: "",
        urgency: "",
        address: "",
      });
      fetchUserData(); // Recarrega a lista
    } catch (err: any) {
      console.log("Erro ao criar pedido: ", err);
      setMessage({
        type: "error",
        text: "Erro ao criar pedido. Verifique os dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
      {/* Lado Esquerdo: Form de Pedido */}
      <div className="lg:col-span-2 space-y-6">
        <div className="section-block">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-(--brand)/20 flex items-center justify-center text-(--brand)">
              <FiPlus className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Novo Pedido de Serviço</h2>
              <p className="text-sm text-(--muted-foreground)">
                Descreva o que você precisa e encontre profissionais.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-(--muted-foreground)">
                Título do Projeto
              </label>
              <div className="glass-liquid">
                <div className="glass-liquid-inner">
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Reforma de armário de cozinha"
                      className="w-full bg-transparent outline-none border-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-(--muted-foreground)">
                    Categoria
                  </label>
                  <div className="glass-liquid">
                    <div className="glass-liquid-inner flex items-center gap-2">
                      <FiTag className="text-(--muted-foreground)" />
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent outline-none border-none"
                      >
                        <option value="">Selecione...</option>
                        <option value="Design">Design</option>
                        <option value="desenvolvedor">
                          Desevolcimento de Sites e Sistemas
                        </option>
                        <option value="marcenaria">Marcenaria</option>
                        <option value="Manutenção">Manutenção</option>
                        <option value="Outros">Outros</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-(--muted-foreground)">
                    Urgência
                  </label>
                  <div className="glass-liquid">
                    <div className="glass-liquid-inner flex items-center gap-2">
                      <FiClock className="text-(--muted-foreground)" />
                      <select
                        name="urgency"
                        value={form.urgency}
                        onChange={handleChange}
                        required
                        className="w-full bg-transparent outline-none border-none"
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                        <option value="Imediata">Imediata</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-(--muted-foreground)">
                  Endereço do Serviço
                </label>
                <div className="glass-liquid">
                  <div className="glass-liquid-inner flex items-center gap-2">
                    <FiMapPin className="text-(--muted-foreground)" />
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="Rua, número, bairro e cidade"
                      className="w-full bg-transparent outline-none border-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-(--muted-foreground)">
                  Descrição Detalhada
                </label>
                <div className="glass-liquid">
                  <div className="glass-liquid-inner">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Explique os detalhes do serviço, materiais necessários, etc."
                      className="w-full bg-transparent outline-none border-none resize-none"
                    />
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-2xl text-sm ${
                  message.type === "success"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="liquid-button w-full justify-center gap-2"
            >
              <FiSend /> {loading ? "Enviando..." : "Publicar Pedido"}
            </button>
          </form>
        </div>
      </div>

      {/* Lado Direito: Resumo/Stats */}
      <div className="space-y-6">
        <div className="surface p-6 space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <FiClipboard className="text-(--brand)" /> Meus Pedidos
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scroll-soft pr-1">
            {fetching ? (
              <p className="text-xs text-(--muted-foreground) animate-pulse">
                Carregando seus pedidos...
              </p>
            ) : userData?.clientServices?.length > 0 ? (
              userData.clientServices.map((service: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold truncate pr-2">
                      {service.title}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        service.status === "Pendente"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-(--brand)/20 text-(--brand)"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-(--muted-foreground)">
                    <span className="flex items-center gap-1">
                      <FiTag /> {service.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiAlertCircle /> {service.urgency}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-(--muted-foreground)">
                  Você ainda não possui pedidos ativos.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="surface p-6">
          <h3 className="font-bold mb-4">Dicas para um bom pedido</h3>
          <ul className="text-sm text-(--muted-foreground) space-y-2">
            <li className="flex gap-2">• Seja específico na descrição</li>
            <li className="flex gap-2">• Informe o endereço corretamente</li>
            <li className="flex gap-2">• Defina a urgência real</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
