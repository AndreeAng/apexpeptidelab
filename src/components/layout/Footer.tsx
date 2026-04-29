import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-lime/10 bg-navy-deep">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Tienda */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-lime font-medium mb-4">
              Tienda
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/productos"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-lime font-medium mb-4">
              Recursos
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/investigacion"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Investigación
                </Link>
              </li>
              <li>
                <Link
                  href="/calidad"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Calidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-lime font-medium mb-4">
              Soporte
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contacto"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/59172201700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/55 hover:text-whatsapp text-sm transition-colors duration-200"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest text-lime font-medium mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/terminos"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Términos
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/uso-investigacion"
                  className="text-white/55 hover:text-lime text-sm transition-colors duration-200"
                >
                  Uso de investigación
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t border-lime/10">
          <p className="text-white/35 text-xs leading-relaxed max-w-3xl">
            <span className="text-lime/60 font-medium">Solo para investigación.</span>{" "}
            Los productos de apex peptide lab se venden exclusivamente para uso
            en investigación, laboratorio y educación. No están aprobados para
            consumo humano, uso veterinario, ni para ninguna aplicación
            terapéutica o diagnóstica. Al comprar, el usuario confirma ser un
            investigador calificado y que utilizará los productos conforme a
            todas las leyes y regulaciones aplicables.
          </p>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-white/25 text-xs">
                © {new Date().getFullYear()} apex peptide lab
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/apexpeptidelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/25 hover:text-lime transition-colors"
                  aria-label="Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@apexpeptidelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/25 hover:text-lime transition-colors"
                  aria-label="TikTok"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/apexpeptidelab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/25 hover:text-lime transition-colors"
                  aria-label="Facebook"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>
            <Link
              href="/admin/login"
              className="text-white/10 hover:text-white/25 text-[10px] italic transition-colors"
            >
              Research use only
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
