"use client";

import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiLogOut } from "react-icons/fi";
import api from "@/src/lib/api";

export default function ClientContaPage() {
  const [fetching, setFetching] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
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
      console.error("Erro ao buscar dados", err);
    } finally {
      setFetching(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userType=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (fetching) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="section-block h-96 animate-pulse bg-white/5" />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Minha Conta</h1>
        <p className="text-(--muted-foreground)">Gerencie suas informações pessoais e de segurança.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Card de Perfil */}
        <div className="md:col-span-1 space-y-6">
          <div className="section-block flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 rounded-full bg-(--brand)/20 border-2 border-(--brand)/30 flex items-center justify-center text-4xl text-(--brand) mb-4">
              {userData?.profileImageUrl ? (
                <img src={userData.profileImageUrl} alt={userData.userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <FiUser />
              )}
            </div>
            <h2 className="text-xl font-bold">{userData?.userName}</h2>
            <p className="text-sm text-(--muted-foreground)">Cliente</p>
            <div className="mt-6 w-full pt-6 border-t border-white/5">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
              >
                <FiLogOut /> Sair da conta
              </button>
            </div>
          </div>
        </div>

        {/* Informações Detalhadas */}
        <div className="md:col-span-2 space-y-6">
          <div className="section-block">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <FiShield className="text-(--brand)" /> Dados Pessoais
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-(--muted-foreground) uppercase font-bold tracking-wider">E-mail</p>
                  <p className="flex items-center gap-2 text-sm"><FiMail className="text-(--brand)" /> {userData?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-(--muted-foreground) uppercase font-bold tracking-wider">Telefone</p>
                  <p className="flex items-center gap-2 text-sm"><FiPhone className="text-(--brand)" /> {userData?.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-(--muted-foreground) uppercase font-bold tracking-wider mb-2">Endereço Principal</p>
                <div className="flex items-start gap-2 text-sm">
                  <FiMapPin className="text-(--brand) mt-1" />
                  <div>
                    <p>{userData?.street}, {userData?.number}</p>
                    {userData?.complement && <p>{userData.complement}</p>}
                    <p className="text-(--muted-foreground)">{userData?.zipCode} - {userData?.city}, {userData?.state}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-(--muted-foreground)">
                <FiCalendar /> Membro desde {new Date(userData?.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="surface p-6 border border-amber-500/20 bg-amber-500/5">
            <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-2">
              <FiShield /> Área de Segurança
            </h4>
            <p className="text-sm text-amber-400/80">
              Para alterar sua senha ou atualizar seus dados de endereço, entre em contato com o suporte ou aguarde a próxima atualização do painel.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

