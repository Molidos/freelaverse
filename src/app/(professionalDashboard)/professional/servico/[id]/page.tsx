"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiMapPin, FiClock, FiTag, FiUser, FiPhone, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import api from "../../../../../lib/api";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie("authToken");
      if (!token || !id) return;

      try {
        // 1. Busca detalhes do serviço
        const jobRes = await api.get(`/Services/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const jobData = jobRes.data;
        setJob(jobData);

        // 2. Busca dados do cliente (quem criou o serviço)
        if (jobData.userId) {
          const userRes = await api.get(`/Users/${jobData.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClient(userRes.data);
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="section-block h-96 animate-pulse bg-white/5" />
      </main>
    );
  }

  if (!job) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Serviço não encontrado</h2>
        <button onClick={() => router.back()} className="liquid-button">
          <FiArrowLeft /> Voltar
        </button>
      </main>
    );
  }

  const whatsappUrl = client?.phone 
    ? `https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${client.userName}, vi seu pedido "${job.title}" no Freelaverse e gostaria de conversar sobre!`)}`
    : null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-(--muted-foreground) hover:text-white transition-colors"
      >
        <FiArrowLeft /> Voltar para a lista
      </button>

      <div className="section-block space-y-8">
        {/* Header do Serviço */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="pill bg-(--brand)/20 text-(--brand)">{job.category}</span>
              <span className={`pill ${
                job.urgency === "Imediata" || job.urgency === "Alta" 
                  ? "bg-red-500/20 text-red-400" 
                  : "bg-emerald-500/20 text-emerald-400"
              }`}>
                Urgência: {job.urgency}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{job.title}</h1>
            <div className="flex items-center gap-4 text-sm text-(--muted-foreground)">
              <span className="flex items-center gap-1"><FiMapPin className="text-(--brand)" /> {job.address}</span>
              <span className="flex items-center gap-1"><FiClock className="text-(--brand)" /> Publicado em {new Date(job.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          
          {whatsappUrl && (
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-button bg-emerald-600 hover:bg-emerald-500 border-emerald-400/30 gap-2 px-8 py-4 text-lg"
            >
              <FaWhatsapp className="text-2xl" /> Entrar em Contato
            </a>
          )}
        </div>

        {/* Descrição */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FiMessageCircle className="text-(--brand)" /> Descrição do pedido
          </h3>
          <p className="text-(--muted-foreground) leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Info do Cliente */}
        <div className="pt-8 border-t border-white/5">
          <div className="surface p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-(--brand)/20 border border-(--brand)/30 flex items-center justify-center text-2xl text-(--brand)">
                {client?.profileImageUrl ? (
                  <img src={client.profileImageUrl} alt={client.userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FiUser />
                )}
              </div>
              <div>
                <p className="text-xs text-(--muted-foreground) uppercase tracking-widest font-bold">Solicitado por</p>
                <h4 className="text-xl font-bold">{client?.userName || "Carregando..."}</h4>
                <p className="text-sm text-(--muted-foreground)">Membro desde {client ? new Date(client.createdAt).toLocaleDateString('pt-BR') : "..."}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-(--brand) font-semibold">
                <FiPhone /> {client?.phone || "Não informado"}
              </div>
              <p className="text-xs text-(--muted-foreground)">Negocie detalhes diretamente pelo WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

