"use client";

import Link from "next/link";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full text-center space-y-6 section-block">
        <p className="pill mx-auto">Erro 404</p>
        <h1 className="text-4xl font-extrabold">Página não encontrada</h1>
        <p className="text-(--muted-foreground)">
          Opa, parece que este universo não existe. Verifique o endereço ou volte para a página inicial.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="liquid-button">
            <FiHome className="text-lg" /> Ir para home
          </Link>
          <Link href="/login" className="liquid-button liquid-button--ghost">
            <FiArrowLeft className="text-lg" /> Voltar para login
          </Link>
        </div>
      </div>
    </main>
  );
}
