"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiPlusSquare, FiList, FiClock, FiSettings, FiHelpCircle } from "react-icons/fi";

const menuItems = [
  { icon: FiHome, label: "Início", href: "/client" },
  { icon: FiList, label: "Meus Pedidos", href: "/client/pedidos" },
];

const secondaryItems = [
  { icon: FiSettings, label: "Configurações", href: "/client/configuracoes" },
  { icon: FiHelpCircle, label: "Ajuda", href: "/client/ajuda" },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed left-0 top-[64px] bottom-0 border-r border-white/10 bg-black/20 backdrop-blur-xl hidden md:flex flex-col p-4 z-40">
      <nav className="flex-1 space-y-1">
        <p className="text-[10px] font-bold text-(--muted-foreground) uppercase tracking-[0.2em] px-3 mb-4">Menu Principal</p>
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active 
                  ? "bg-(--brand)/15 text-(--brand) border border-(--brand)/20 shadow-[0_0_20px_rgba(88,101,242,0.1)]" 
                  : "text-(--muted-foreground) hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`text-lg ${active ? "text-(--brand)" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 pt-4 border-t border-white/5">
        {secondaryItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-(--muted-foreground) hover:text-white hover:bg-white/5 transition-all"
          >
            <item.icon className="text-lg" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

