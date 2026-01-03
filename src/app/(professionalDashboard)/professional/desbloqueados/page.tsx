"use client";

import { useEffect, useState } from "react";
import { FiCheckSquare, FiMapPin, FiClock, FiTag, FiPhone, FiUser, FiMessageCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import api from "@/src/lib/api";

export default function ProfessionalDesbloqueadosPage() {
  const [loading, setLoading] = useState(true);
  const [unlockedJobs, setUnlockedJobs] = useState<any[]>([]);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const fetchUnlockedJobs = async () => {
    const token = getCookie("authToken");
    const userId = getCookie("userId");
    if (!token || !userId) return;

    try {
      const res = await api.get("/Auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Filtra serviços onde o profissional está na lista de ProfessionalService
      // Nota: Dependendo da API, os dados podem vir de formas diferentes. 
      // Se a API não trouxer os serviços desbloqueados no /Auth/me, precisaríamos de outro endpoint.
      // Assumindo que o profissional tem uma lista de ProfessionalService no seu perfil.
      const unlocked = res.data.professionalService?.map((ps: any) => ps.service) || [];
      setUnlockedJobs(unlocked);
    } catch (err) {
      console.error("Erro ao buscar jobs desbloqueados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnlockedJobs();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pedidos Desbloqueados</h1>
        <p className="text-(--muted-foreground)">Jobs que você desbloqueou o contato para negociar.</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="section-block h-64 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : unlockedJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedJobs.map((job) => (
            <Link 
              key={job.id} 
              href={`/professional/servico/${job.id}`}
              className="section-block border-2 border-transparent hover:border-[#5865f2] hover:shadow-[0_0_35px_rgba(88,101,242,0.6)] hover:bg-[#5865f2]/5 transition-all group block relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 rounded-lg bg-(--brand)/20 text-(--brand) text-[10px] font-bold uppercase tracking-wider">
                    {job.category}
                  </span>
                  <span className="text-[10px] text-(--muted-foreground) flex items-center gap-1">
                    <FiClock size={10} /> {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg group-hover:text-(--brand) transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-medium">
                    <FiCheckSquare /> Contato Liberado
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                    <FiMapPin className="text-(--brand)" />
                    <span className="truncate">{job.address}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <div className="liquid-button flex-1 text-sm py-2 justify-center">
                    Ver Detalhes
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="surface p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
            <FiCheckSquare className="text-2xl text-(--muted-foreground)" />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="font-bold">Nenhum job desbloqueado</h3>
            <p className="text-sm text-(--muted-foreground)">
              Você ainda não desbloqueou o contato de nenhum pedido. Explore os jobs disponíveis!
            </p>
            <Link href="/professional" className="inline-block mt-4 text-(--brand) hover:underline text-sm font-medium">
              Explorar Pedidos
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

