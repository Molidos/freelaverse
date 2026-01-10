"use client";

import { useEffect, useRef, useState } from "react";
import { FiCreditCard, FiCheckCircle, FiZap, FiCopy } from "react-icons/fi";
import { RiQrCodeLine } from "react-icons/ri";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import api from "@/src/lib/api";

const PACKS = [
  { id: "pack1", label: "1.000 créditos", value: 1000, price: "R$ 49,90", priceCents: 4990, desc: "Para começar a desbloquear pedidos." },
  { id: "pack2", label: "2.000 créditos", value: 2000, price: "R$ 89,90", priceCents: 8990, desc: "Mais volume com melhor custo." },
  { id: "pack3", label: "3.000 créditos", value: 3000, price: "R$ 119,90", priceCents: 11990, desc: "Pacote maior para alta demanda." },
];

const PAYMENT_METHODS = [
  { id: "pix", label: "Pix", icon: <RiQrCodeLine className="text-xl text-emerald-400" />, colorClass: "text-emerald-400" },
  { id: "boleto", label: "Boleto", icon: <FiCreditCard className="text-lg" />, colorClass: "" },
];

export default function ProfessionalCreditosPage() {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [qrText, setQrText] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentCredits, setPaymentCredits] = useState<number | null>(null);
  const connectionRef = useRef<HubConnection | null>(null);

  const selectedPackData = PACKS.find((p) => p.id === selectedPack);
  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    const fetchUserAndConnect = async () => {
      const token = getCookie("authToken");
      if (!token) return;
      try {
        const res = await api.get("/Auth/me", { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
        const email = res.data?.email;
        if (email) {
          await startSignalR(email);
        }
      } catch (err) {
        console.error("Erro ao buscar usuário", err);
      }
    };
    fetchUserAndConnect();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startSignalR = async (email: string) => {
    try {
      if (connectionRef.current) {
        await connectionRef.current.stop().catch(() => {});
      }

      const apiBase = api.defaults.baseURL || "http://localhost:5002/api";
      const hubBase = apiBase.replace(/\/api\/?$/, "");
      const hubUrl = `${hubBase}/hubs/payments`;

      const connection = new HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      connection.on("PixPaymentUpdated", (payload: any) => {
        if (!payload?.email || payload.email.toLowerCase() !== email.toLowerCase()) return;
        if (payload.totalCredits !== undefined) {
          setUser((prev: any) => prev ? { ...prev, credits: payload.totalCredits } : prev);
        }
        setPaymentStatus(payload.status ?? "paid");
        setPaymentCredits(payload.creditsAdded ?? null);
      });

      await connection.start();
      await connection.invoke("JoinUserGroup", email);
      connectionRef.current = connection;
    } catch (err) {
      console.error("Erro ao conectar ao SignalR", err);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Chave PIX copiada!");
    } catch {
      alert("Não foi possível copiar a chave.");
    }
  };

  const handleCheckout = async () => {
    if (!selectedPackData || paymentMethod !== "pix") {
      setError("Selecione um pacote e a forma de pagamento Pix.");
      return;
    }
    const token = getCookie("authToken");
    if (!token) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoadingPix(true);
    setError(null);
    setQrLink(null);
    setQrText(null);
    setPaymentStatus(null);
    setPaymentCredits(null);

    try {
      const res = await api.post(
        "/pix",
        {
          name: user?.userName ?? "Cliente",
          email: user?.email ?? "email@exemplo.com",
          product: selectedPackData.label,
          quantity: 1,
          unitAmount: selectedPackData.priceCents,
          price: selectedPackData.priceCents,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setQrText(res.data?.qrText ?? null);
      setQrLink(res.data?.qrLink ?? null);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Erro ao gerar PIX.";
      setError(msg);
      console.error(err);
    } finally {
      setLoadingPix(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <header className="surface p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <FiZap className="text-xl text-(--brand)" />
          <h1 className="text-3xl font-bold">Comprar créditos</h1>
        </div>
        <p className="text-(--muted-foreground)">
          Use créditos para desbloquear pedidos quando não estiver usando a assinatura. Selecione um pacote e a forma de pagamento.
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        {PACKS.map((pack) => {
          const active = selectedPack === pack.id;
          return (
            <button
              key={pack.id}
              onClick={() => setSelectedPack(pack.id)}
              className={`section-block text-left border rounded-2xl p-5 transition hover:border-(--brand)/60 ${
                active ? "border-(--brand) ring-2 ring-(--brand)/30" : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{pack.label}</p>
                  <p className="text-(--muted-foreground) text-sm">{pack.desc}</p>
                  <p className="text-sm font-semibold text-(--brand) mt-2">{pack.price}</p>
                </div>
                {active && <FiCheckCircle className="text-(--brand)" />}
              </div>
            </button>
          );
        })}
      </section>

      {selectedPack && (
        <section className="surface p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-xl font-bold">Selecione a forma de pagamento</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {PAYMENT_METHODS.map((method) => {
              const active = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`border rounded-lg px-3 py-2 bg-white/5 text-left transition hover:border-(--brand)/60 flex items-center gap-2 text-sm ${
                    active ? "border-(--brand) ring-2 ring-(--brand)/30" : "border-white/10"
                  }`}
                >
                  <div className={`flex items-center gap-2 ${method.colorClass ?? ""}`}>
                    {method.icon}
                    <div>
                      <p className={`font-semibold ${method.colorClass ?? ""}`}>{method.label}</p>
                      <p className="text-(--muted-foreground) text-xs">
                        {method.id === "pix" ? "Pagamento instantâneo" : "Gere e pague até o vencimento"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="surface p-6 rounded-2xl border border-white/10 space-y-3">
        <h2 className="text-lg font-semibold">Resumo</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-(--muted-foreground)">
              Pacote: <span className="text-white">{selectedPackData?.label ?? "Selecione um pacote"}</span>
            </p>
            <p className="text-(--muted-foreground)">
              Pagamento: <span className="text-white">{selectedPayment?.label ?? "Selecione um método"}</span>
            </p>
          </div>
          <button
            disabled={!selectedPack || !paymentMethod}
            className="liquid-button px-6 py-3 text-base disabled:opacity-60"
            onClick={handleCheckout}
          >
            Continuar para pagamento
          </button>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </section>

      {(qrText || qrLink) && (
        <section className="surface p-6 rounded-2xl border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <RiQrCodeLine className="text-xl text-emerald-400" /> Pague com Pix
          </h2>
          {qrLink && (
            <div className="bg-white p-3 rounded-xl inline-block">
              <img src={qrLink} alt="QR Code Pix" className="w-48 h-48 object-contain" />
            </div>
          )}
          {qrText && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-(--muted-foreground)">Chave copia e cola:</p>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-sm break-all">{qrText}</span>
                <button
                  onClick={() => handleCopy(qrText)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                  title="Copiar chave"
                >
                  <FiCopy />
                </button>
              </div>
            </div>
          )}
          {loadingPix && <p className="text-sm text-(--muted-foreground)">Gerando QR Code...</p>}
          {paymentStatus && (
            <div className="p-3 rounded-xl border border-white/10 bg-emerald-500/10 text-sm">
              Status: <span className="font-semibold">{paymentStatus}</span>
              {paymentCredits !== null && (
                <> — Créditos adicionados: <span className="font-semibold">{paymentCredits}</span></>
              )}
              {user?.credits !== undefined && (
                <> — Total de créditos: <span className="font-semibold">{user?.credits}</span></>
              )}
            </div>
          )}
      </section>
      )}
    </main>
  );
}
