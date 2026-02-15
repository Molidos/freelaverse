import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { FiLogIn, FiUserPlus } from "react-icons/fi";


export default function MainNavHeader({ withoutNavbar }: { withoutNavbar?: boolean }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="header-glass flex items-center justify-between gap-4 px-5 md:px-8 py-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <span className="w-9 h-9 rounded-md bg-linear-to-br from-[#5865f2] to-[#7c3aed] flex items-center justify-center text-white font-bold text-lg">F</span>
          <span className="text-xl font-semibold tracking-wide">Freelaverse</span>
        </Link>
        {!withoutNavbar && (
        <div className="hidden md:flex items-center gap-6 text-sm text-(--muted-foreground)">
          <a href="#servicos" className="hover:text-foreground transition-colors">
            Serviços
          </a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">
            Como funciona
          </a>
          <a href="#categorias" className="hover:text-foreground transition-colors">
            Categorias
          </a>
          <a href="#depoimentos" className="hover:text-foreground transition-colors">
            Cases
          </a>
        </div>
        )}
        <div className="flex items-center gap-3">
          <Link href="/login" className="liquid-button liquid-button--ghost text-sm">
            <FiLogIn /> Entrar
          </Link>
          <Link href="/cadastro" className="liquid-button text-sm">
            <FiUserPlus /> Cadastrar
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
