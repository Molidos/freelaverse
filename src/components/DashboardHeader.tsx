"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiBell, FiLogOut, FiUser } from "react-icons/fi";
import logo from "../assets/img/logo.png";

export default function DashboardHeader({ role }: { role: "client" | "professional" }) {
  const router = useRouter();

  const handleLogout = () => {
    // Apaga os cookies
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userType=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    // Redireciona para o login
    router.push("/login");
  };

  return (
    <header className="header-glass sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href={`/${role}`} className="flex items-center gap-2">
          <Image src={logo} alt="Freelaverse Logo" width={40} height={40} className="w-auto h-8" />
          <span className="font-bold text-xl hidden sm:inline-block">Freelaverse</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/5 transition relative text-(--muted-foreground) hover:text-white">
            <FiBell className="text-xl" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-(--brand) rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-white/10 mx-1"></div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">Usuário Freela</p>
              <p className="text-[10px] text-(--muted-foreground) uppercase tracking-wider">
                {role === "client" ? "Cliente" : "Profissional"}
              </p>
            </div>
            
            <div className="group relative">
              <button className="w-10 h-10 rounded-full bg-(--brand)/20 border border-(--brand)/30 flex items-center justify-center text-(--brand) hover:bg-(--brand)/30 transition">
                <FiUser />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 surface p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 text-sm transition"
                >
                  <FiLogOut /> Sair da conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

