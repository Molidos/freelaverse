"use client";

import { useEffect, useState } from "react";
import { FiList, FiTag, FiAlertCircle, FiMapPin, FiCalendar, FiSearch } from "react-icons/fi";
import api from "@/src/lib/api";

export default function ClientPedidosPage() {
  const [fetching, setFetching] = useState(true);
  const [clientServices, setClientServices] = useState<any[]>([]);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const fetchServices = async () => {
    const token = getCookie("authToken");
    if (!token) return;

    try {
      const res = await api.get("/Auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientServices(res.data.clientServices || []);
    } catch (err) {
      console.error("Erro ao buscar pedidos", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-(--muted-foreground)">Gerencie todas as suas solicitações de serviço.</p>
        </div>
      </div>

      {fetching ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="section-block h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : clientServices.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientServices.map((service) => (
            <div key={service.id} className="section-block space-y-4 hover:border-(--brand)/40 transition-colors">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                  service.status === "Pendente" 
                    ? "bg-amber-500/20 text-amber-400" 
                    : "bg-(--brand)/20 text-(--brand)"
                }`}>
                  {service.status}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-(--muted-foreground) font-medium">
                  <FiCalendar /> {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg line-clamp-1">{service.title}</h3>
                <p className="text-sm text-(--muted-foreground) line-clamp-2 mt-1">{service.description}</p>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <FiTag className="text-(--brand)" />
                  <span>{service.category}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <FiMapPin className="text-(--brand)" />
                  <span className="truncate">{service.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <FiAlertCircle className={service.urgency === "Alta" || service.urgency === "Imediata" ? "text-red-400" : "text-emerald-400"} />
                  <span>Urgência {service.urgency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="surface p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
            <FiSearch className="text-2xl text-(--muted-foreground)" />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="font-bold">Nenhum pedido encontrado</h3>
            <p className="text-sm text-(--muted-foreground)">
              Você ainda não publicou nenhum pedido de serviço. 
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

