"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  LogOut,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/cupones", label: "Cupones", icon: Tag },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    async function fetchPending() {
      const supabase = createClient();
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");
      setPendingCount(count ?? 0);
    }
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60 bg-navy-deep border-r border-border-subtle
          flex flex-col transition-transform duration-300 ease-drawer
          lg:relative lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border-subtle">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-7 h-7 rounded-md bg-lime/20 flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-lime" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              apex <span className="text-lime">admin</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const showBadge = item.href === "/admin/pedidos" && pendingCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    active
                      ? "bg-lime/15 text-lime"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {showBadge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
              text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
