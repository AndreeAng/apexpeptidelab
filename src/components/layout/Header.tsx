"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { useState, useEffect } from "react";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { UserMenu } from "@/components/layout/UserMenu";

export function Header() {
  const open = useCart((s) => s.open);
  const itemCount = useCart((s) => s.itemCount);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/productos", label: "Productos" },
    { href: "/blog", label: "Blog" },
    { href: "/investigacion", label: "Investigación" },
    { href: "/calidad", label: "Calidad" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-navy/95 backdrop-blur-md border-b border-lime/15">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <Image
              src="/apex-logo.png"
              alt="apex peptide lab"
              width={415}
              height={217}
              className="h-14 md:h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-7 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 cursor-pointer ${
                    isActive ? "text-lime font-medium" : "text-white/70 hover:text-lime"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/60 hover:text-lime transition-colors duration-200 p-1.5 cursor-pointer"
              aria-label="Buscar"
            >
              <Search size={18} />
            </button>
            <UserMenu />
            <button
              onClick={open}
              className="relative text-white/60 hover:text-lime transition-colors duration-200 p-1.5 cursor-pointer"
              aria-label="Carrito"
            >
              <ShoppingBag size={18} />
              {mounted && itemCount() > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-lime text-navy text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/60 hover:text-lime transition-colors duration-200 p-1.5 cursor-pointer"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-lime/10 bg-navy-deep/95 backdrop-blur-md">
            <nav className="flex flex-col px-5 py-4 gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`py-2.5 text-sm transition-colors duration-200 cursor-pointer ${
                      isActive ? "text-lime font-medium" : "text-white/70 hover:text-lime"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
