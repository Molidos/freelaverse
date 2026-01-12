"use client";

import { useEffect, useState } from "react";
import { FiList, FiTag, FiAlertCircle, FiMapPin, FiCalendar, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import api from "@/src/lib/api";

export default function ClientPedidosPage() {
  const [fetching, setFetching] = useState(true);
  const [clientServices, setClientServices] = useState<any[]>([]);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

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

  const handleCancel = async () => {
    if (!cancelId) return;
    const token = getCookie("authToken");
    if (!token) return;
    setLoadingCancel(true);
    setCancelSuccess(false);
    try {
      await api.delete(`/Services/${cancelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientServices((prev) => prev.filter((s) => s.id !== cancelId));
      setCancelSuccess(true);
      setTimeout(() => {
        setCancelId(null);
        setCancelSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Erro ao cancelar pedido", err);
      alert("Não foi possível cancelar o pedido.");
    } finally {
      setLoadingCancel(false);
    }
  };

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
                <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                  <FiUsers className="text-(--brand)" />
                  <span>{service.quantProfessionals} profissionais desbloquearam o pedido</span>
                </div>
                <div className="flex w-full items-center justify-center pt-2">
                  <button
                    onClick={() => setCancelId(service.id)}
                    className=" w-full flex justify-center cursor-pointer items-center gap-2 px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-500/50 transition"
                  >
                    <FiTrash2 /> Cancelar pedido
                  </button>
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

      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="surface border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-semibold">Confirmar cancelamento</h2>
            <p className="text-(--muted-foreground)">
              Tem certeza de que deseja cancelar este pedido? Essa ação não pode ser desfeita.
            </p>
            {cancelSuccess ? (
              <div className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                Pedido cancelado com sucesso.
              </div>
            ) : null}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                disabled={loadingCancel}
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={loadingCancel}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-60 inline-flex items-center gap-2"
              >
                {loadingCancel && <ImSpinner2 className="animate-spin" />}
                {loadingCancel ? "Cancelando..." : "Cancelar pedido"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

