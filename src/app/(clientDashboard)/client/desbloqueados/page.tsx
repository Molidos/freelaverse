"use client";

import { useEffect, useState } from "react";
import { FiCheckSquare, FiUser, FiCalendar, FiMessageCircle, FiPhone } from "react-icons/fi";
import api from "@/src/lib/api";

export default function ClientDesbloqueadosPage() {
  const [fetching, setFetching] = useState(true);
  const [desbloqueados, setDesbloqueados] = useState<any[]>([]);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const fetchDesbloqueados = async () => {
    const token = getCookie("authToken");
    if (!token) return;

    try {
      const res = await api.get("/Auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filtra serviços que possuem profissionais interessados (desbloqueados)
      const services = res.data.clientServices || [];
      const filter = services.filter((s: any) => s.professionalService && s.professionalService.length > 0);
      setDesbloqueados(filter);
    } catch (err) {
      console.error("Erro ao buscar desbloqueados", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDesbloqueados();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pedidos Desbloqueados</h1>
        <p className="text-(--muted-foreground)">Profissionais que demonstraram interesse em seus pedidos.</p>
      </div>

      {fetching ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="section-block h-32 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : desbloqueados.length > 0 ? (
        <div className="space-y-6">
          {desbloqueados.map((service) => (
            <div key={service.id} className="section-block space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-bold text-xl text-(--brand)">{service.title}</h3>
                  <p className="text-sm text-(--muted-foreground)">Postado em {new Date(service.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="pill bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {service.professionalService.length} Profissional(is) interessado(s)
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {service.professionalService.map((ps: any) => (
                  <div key={ps.professionalId} className="surface p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-(--brand)/20 flex items-center justify-center text-xl text-(--brand)">
                        <FiUser />
                      </div>
                      <div>
                        <h4 className="font-bold">{ps.professional?.userName || "Profissional"}</h4>
                        <p className="text-xs text-(--muted-foreground)">Visualizou seu contato</p>
                      </div>
                    </div>
                    
                    <a 
                      href={`https://wa.me/${ps.professional?.phone?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                      title="Entrar em contato"
                    >
                      <FiPhone />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
            <FiCheckSquare className="text-2xl text-(--muted-foreground)" />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="font-bold">Nenhum desbloqueio</h3>
            <p className="text-sm text-(--muted-foreground)">
              Assim que um profissional se interessar pelo seu pedido, ele aparecerá aqui.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

