"use client";

import { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield, FiLogOut, FiBriefcase, FiTag } from "react-icons/fi";
import api from "@/src/lib/api";

export default function ProfessionalContaPage() {
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
        <p className="text-(--muted-foreground)">Gerencie suas informações profissionais e de segurança.</p>
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
            <p className="text-sm text-(--muted-foreground)">Profissional</p>
            
            <div className="mt-6 w-full pt-6 border-t border-white/5 space-y-3">
              <div className="flex flex-wrap justify-center gap-2">
                {userData?.userProfessionalArea?.map((upa: any) => (
                  <span key={upa.professionalArea.id} className="text-[10px] px-2 py-1 rounded-lg bg-(--brand)/10 text-(--brand) font-bold uppercase">
                    {upa.professionalArea.name}
                  </span>
                ))}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium pt-4"
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
              <FiBriefcase className="text-(--brand)" /> Dados Profissionais
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-(--muted-foreground) uppercase font-bold tracking-wider">E-mail de Contato</p>
                  <p className="flex items-center gap-2 text-sm truncate"><FiMail className="text-(--brand)" /> {userData?.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-(--muted-foreground) uppercase font-bold tracking-wider">Telefone/WhatsApp</p>
                  <p className="flex items-center gap-2 text-sm"><FiPhone className="text-(--brand)" /> {userData?.phone}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-(--muted-foreground) uppercase font-bold tracking-wider mb-2">Endereço</p>
                <div className="flex items-start gap-2 text-sm">
                  <FiMapPin className="text-(--brand) mt-1" />
                  <div>
                    <p>{userData?.street}, {userData?.number}</p>
                    <p className="text-(--muted-foreground)">{userData?.city}, {userData?.state} - {userData?.zipCode}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-(--muted-foreground)">
                <FiCalendar /> Prestador de serviços desde {new Date(userData?.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="surface p-6 border border-(--brand)/20 bg-(--brand)/5">
            <h4 className="font-bold text-(--brand) flex items-center gap-2 mb-2">
              <FiTag /> Áreas de Atuação
            </h4>
            <p className="text-sm text-(--muted-foreground)">
              Você está recebendo notificações de serviços nas seguintes áreas:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {userData?.userProfessionalArea?.map((upa: any) => (
                <div key={upa.professionalArea.id} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">
                  {upa.professionalArea.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

