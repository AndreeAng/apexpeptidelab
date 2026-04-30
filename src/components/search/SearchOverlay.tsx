"use client";

import Fuse from "fuse.js";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { Product } from "@/data/products";
import { createClient } from "@/lib/supabase/client";
import { dbProductToProduct } from "@/lib/supabase/types";
import type { DbProduct } from "@/lib/supabase/types";
import { blogArticles, type BlogArticle } from "@/data/blog";
import { Search, X, FileText } from "lucide-react";
import Link from "next/link";
import { formatBs } from "@/lib/format";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const hasFetched = useRef(false);

  // Fetch products from Supabase when the overlay opens
  useEffect(() => {
    if (!open || hasFetched.current) return;

    const fetchProducts = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("in_stock", true)
          .order("sort_order", { ascending: true });

        if (!error && data) {
          setProducts((data as DbProduct[]).map(dbProductToProduct));
        }
      } catch {
        // silently fail — search just won't have results
      }
      hasFetched.current = true;
    };

    fetchProducts();
  }, [open]);

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 2 },
          { name: "composition", weight: 1.5 },
          { name: "category", weight: 1 },
          { name: "research", weight: 0.8 },
        ],
        threshold: 0.4,
        includeMatches: true,
      }),
    [products],
  );

  const blogFuse = useMemo(
    () =>
      new Fuse(blogArticles, {
        keys: [
          { name: "title", weight: 2 },
          { name: "excerpt", weight: 1.5 },
          { name: "category", weight: 1 },
        ],
        threshold: 0.4,
      }),
    [],
  );

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return fuse.search(query).slice(0, 6);
  }, [query, fuse]);

  const blogResults = useMemo(() => {
    if (query.length < 2) return [] as ReturnType<typeof blogFuse.search>;
    return blogFuse.search(query).slice(0, 3);
  }, [query, blogFuse]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape") handleClose();
    };
    if (open) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-navy/95 backdrop-blur-md"
      onClick={handleClose}
    >
      <div
        className="max-w-2xl mx-auto pt-20 px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-lime/30 pb-3">
          <Search size={20} className="text-lime flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar péptidos, mezclas, categorías..."
            className="flex-1 bg-transparent text-white text-lg placeholder:text-white/40 outline-none"
          />
          <button
            onClick={handleClose}
            className="cursor-pointer text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {query.length < 2 && (
          <div className="mt-8 text-white/50 text-sm">
            <p className="mb-3">Intenta buscar:</p>
            <div className="flex flex-wrap gap-2">
              {["Glow", "GHK-Cu", "CJC-1295", "metabólico"].map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="px-3 py-1 border border-lime/30 text-lime/80 text-xs rounded-full hover:border-lime hover:text-lime transition-colors cursor-pointer"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && results.length === 0 && blogResults.length === 0 && (
          <p className="mt-8 text-white/50 text-sm">
            Sin resultados para &ldquo;{query}&rdquo;.
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <p className="text-white/40 text-[11px] uppercase tracking-wider font-medium mb-2">Productos</p>
            <div className="space-y-2">
              {results.map(({ item }) => (
                <Link
                  key={item.slug}
                  href={`/productos/${item.slug}`}
                  onClick={handleClose}
                  className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/[0.08] border border-lime/15 rounded-lg transition-colors cursor-pointer"
                >
                  <div
                    className="w-2 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.accentColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {item.name}
                    </div>
                    <div className="text-white/55 text-xs truncate">
                      {item.category} · {item.composition}
                    </div>
                  </div>
                  <div className="text-lime font-mono text-sm flex-shrink-0">
                    Bs {formatBs(item.priceBs)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {blogResults.length > 0 && (
          <div className="mt-6">
            <p className="text-white/40 text-[11px] uppercase tracking-wider font-medium mb-2">Artículos</p>
            <div className="space-y-2">
              {blogResults.map(({ item }) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  onClick={handleClose}
                  className="flex items-center gap-4 p-3 bg-white/5 hover:bg-white/[0.08] border border-lime/15 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-lime/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-lime/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">
                      {item.title}
                    </div>
                    <div className="text-white/55 text-xs truncate">
                      {item.category} · {item.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
