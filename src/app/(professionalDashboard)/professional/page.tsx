"use client";

import { useEffect, useState } from "react";
import { FiTarget, FiMapPin, FiClock, FiBriefcase, FiChevronLeft, FiChevronRight, FiZap } from "react-icons/fi";
import Link from "next/link";
import api from "../../../lib/api";

export default function ProfessionalDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loadingSubscribe, setLoadingSubscribe] = useState(false);
  
  // Estados para Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 9; // Número ímpar costuma ficar melhor no grid 3x3

  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const fetchJobs = async (page: number) => {
    const token = getCookie("authToken");
    if (!token) return;

    setLoading(true);
    try {
      const userRes = await api.get("/Auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = userRes.data;
      setUserData(user);

      const categories = user.userProfessionalArea?.map(
        (upa: any) => upa.professionalArea.name
      ) || [];

      if (categories.length === 0) {
        setJobs([]);
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams();
      categories.forEach((cat: string) => queryParams.append("categories", cat));
      queryParams.append("page", page.toString());
      queryParams.append("pageSize", pageSize.toString());

      const jobsRes = await api.get(`/Services/search?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = jobsRes.data;
      setJobs(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.total || 0);
      setCurrentPage(data.page || page);
    } catch (err) {
      console.error("Erro ao carregar oportunidades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Oportunidades para você</h1>
            <p className="text-(--muted-foreground)">
              Jobs que combinam com suas áreas de atuação:{" "}
              <span className="text-(--brand) font-medium">
                {userData?.userProfessionalArea?.map((upa: any) => upa.professionalArea.name).join(", ") || "Nenhuma área cadastrada"}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--brand)/10 border border-(--brand)/20 text-(--brand) text-sm font-medium">
            <FiBriefcase /> {totalItems} Jobs encontrados
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="section-block h-64 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Link 
                key={job.id} 
                href={`/professional/servico/${job.id}`}
                className="section-block hover:border-2 border-transparent hover:border-[#5865f2] hover:shadow-[0_0_35px_rgba(88,101,242,0.6)] hover:bg-[#5865f2]/5 transition-all group block relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-1 rounded-lg bg-(--brand)/20 text-(--brand) text-[10px] font-bold uppercase tracking-wider">
                      {job.category}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${
                        job.urgency === "Imediata" || job.urgency === "Alta" 
                          ? "bg-red-500/20 text-red-400" 
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}>
                        {job.urgency}
                      </span>
                      <span className="text-[10px] text-(--muted-foreground) flex items-center gap-1">
                        <FiClock size={10} /> {new Date(job.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg group-hover:text-(--brand) transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-(--muted-foreground) line-clamp-2 mt-1">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-(--muted-foreground)">
                      <FiMapPin className="text-(--brand)" />
                      <span className="truncate">{job.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <div className="liquid-button flex-1 text-sm py-2 justify-center">
                      Ver Detalhes
                    </div>
                    <span className="text-[11px] text-(--muted-foreground) flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10 self-start">
                      {job.quantProfessionals ?? 0} profissionais
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <FiTarget className="text-2xl text-(--muted-foreground)" />
            </div>
            <div className="max-w-xs mx-auto">
              <h3 className="font-bold">Nenhum job encontrado</h3>
              <p className="text-sm text-(--muted-foreground)">
                Não encontramos pedidos nas suas categorias no momento. Tente atualizar seu perfil com novas áreas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Paginação fixa na parte inferior com padding vertical */}
      {!loading && jobs.length > 0 && totalPages >= 1 && (
        <div className="py-10 flex justify-center items-center gap-2 mt-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNumber
                        ? "bg-(--brand) text-white"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return <span key={pageNumber} className="px-1 text-(--muted-foreground)">...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>
      )}
    </main>
  );
}
