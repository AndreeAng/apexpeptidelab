"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/data/products";
import { createProductAction, updateProductAction } from "@/app/admin/(dashboard)/productos/actions";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Basic info
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [shortName, setShortName] = useState(product?.shortName || "");
  const [composition, setComposition] = useState(product?.composition || "");
  const [doseLabel, setDoseLabel] = useState(product?.doseLabel || "");
  const [category, setCategory] = useState(product?.category || "");
  const [accentColor, setAccentColor] = useState(product?.accentColor || "#009bdb");

  // Content
  const [description, setDescription] = useState(product?.description || "");
  const [longDescription, setLongDescription] = useState(product?.longDescription || "");
  const [storage, setStorage] = useState(product?.storage || "");
  const [purity, setPurity] = useState(product?.purity || "");

  // Pricing
  const [priceBs, setPriceBs] = useState(product?.priceBs?.toString() || "");
  const [isOffer, setIsOffer] = useState(product?.isOffer || false);
  const [offerPriceBs, setOfferPriceBs] = useState(product?.offerPriceBs?.toString() || "");

  // Status
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder?.toString() || "0");

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image || "");

  // Dynamic arrays
  const [highlights, setHighlights] = useState<string[]>(product?.highlights || [""]);
  const [benefits, setBenefits] = useState<{ icon: string; title: string; text: string }[]>(
    product?.benefits?.length ? product.benefits : [{ icon: "", title: "", text: "" }]
  );
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>(
    product?.specs?.length ? product.specs : [{ label: "", value: "" }]
  );
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>(
    product?.faqs?.length ? product.faqs : [{ q: "", a: "" }]
  );

  const generateSlug = useCallback((value: string) => {
    return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }, []);

  function handleNameChange(value: string) {
    setName(value);
    if (mode === "create" || slug === generateSlug(name)) {
      setSlug(generateSlug(value));
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("shortName", shortName);
    formData.set("composition", composition);
    formData.set("doseLabel", doseLabel);
    formData.set("category", category);
    formData.set("accentColor", accentColor);
    formData.set("description", description);
    formData.set("longDescription", longDescription);
    formData.set("storage", storage);
    formData.set("purity", purity);
    formData.set("priceBs", priceBs);
    formData.set("isOffer", isOffer.toString());
    formData.set("offerPriceBs", offerPriceBs);
    formData.set("inStock", inStock.toString());
    formData.set("sortOrder", sortOrder);
    formData.set("highlights", JSON.stringify(highlights.filter((h) => h.trim())));
    formData.set("benefits", JSON.stringify(benefits.filter((b) => b.title.trim())));
    formData.set("specs", JSON.stringify(specs.filter((s) => s.label.trim())));
    formData.set("faqs", JSON.stringify(faqs.filter((f) => f.q.trim())));

    if (imageFile) {
      formData.set("image", imageFile);
    }

    let result;
    if (mode === "create") {
      result = await createProductAction(formData);
    } else {
      result = await updateProductAction(product!.id!, formData);
    }

    setSubmitting(false);

    if (result.success) {
      router.push("/admin/productos");
      router.refresh();
    } else {
      alert("Error al guardar el producto");
    }
  }

  const inputClass = "contact-input w-full";
  const labelClass = "block text-xs text-white/50 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Informacion basica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre *</label>
            <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Nombre corto</label>
            <input type="text" value={shortName} onChange={(e) => setShortName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Composicion</label>
            <input type="text" value={composition} onChange={(e) => setComposition(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Dosis</label>
            <input type="text" value={doseLabel} onChange={(e) => setDoseLabel(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Categoria</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Color acento</label>
            <div className="flex gap-2">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border border-lime/20" />
              <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Contenido</h2>
        <div>
          <label className={labelClass}>Descripcion</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={3} />
        </div>
        <div>
          <label className={labelClass}>Descripcion larga</label>
          <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} className={inputClass} rows={5} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Almacenamiento</label>
            <textarea value={storage} onChange={(e) => setStorage(e.target.value)} className={inputClass} rows={2} />
          </div>
          <div>
            <label className={labelClass}>Pureza</label>
            <input type="text" value={purity} onChange={(e) => setPurity(e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Precio</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Precio (Bs) *</label>
            <input type="number" value={priceBs} onChange={(e) => setPriceBs(e.target.value)} className={inputClass} required step="0.01" />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={isOffer} onChange={(e) => setIsOffer(e.target.checked)} className="w-4 h-4 rounded" />
              En oferta
            </label>
          </div>
          {isOffer && (
            <div>
              <label className={labelClass}>Precio oferta (Bs)</label>
              <input type="number" value={offerPriceBs} onChange={(e) => setOfferPriceBs(e.target.value)} className={inputClass} step="0.01" />
            </div>
          )}
        </div>
      </section>

      {/* Status */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Estado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 rounded" />
              En stock
            </label>
          </div>
          <div>
            <label className={labelClass}>Orden</label>
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Imagen</h2>
        {imagePreview && (
          <div className="mb-3">
            <Image src={imagePreview} alt="Preview" width={120} height={120} className="rounded-lg object-cover" />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-white/60" />
      </section>

      {/* Highlights */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Highlights</h2>
        {highlights.map((h, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={h}
              onChange={(e) => {
                const copy = [...highlights];
                copy[i] = e.target.value;
                setHighlights(copy);
              }}
              className={inputClass}
              placeholder="Highlight"
            />
            <button type="button" onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} className="px-3 py-1 text-xs text-red-400 border border-red-500/20 rounded hover:bg-red-500/10">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setHighlights([...highlights, ""])} className="text-xs text-lime/70 hover:text-lime">
          + Agregar highlight
        </button>
      </section>

      {/* Benefits */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Beneficios</h2>
        {benefits.map((b, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              type="text"
              value={b.icon}
              onChange={(e) => {
                const copy = [...benefits];
                copy[i] = { ...copy[i], icon: e.target.value };
                setBenefits(copy);
              }}
              className={inputClass}
              placeholder="Icono (ej: Dna)"
              style={{ maxWidth: "120px" }}
            />
            <input
              type="text"
              value={b.title}
              onChange={(e) => {
                const copy = [...benefits];
                copy[i] = { ...copy[i], title: e.target.value };
                setBenefits(copy);
              }}
              className={inputClass}
              placeholder="Titulo"
            />
            <input
              type="text"
              value={b.text}
              onChange={(e) => {
                const copy = [...benefits];
                copy[i] = { ...copy[i], text: e.target.value };
                setBenefits(copy);
              }}
              className={inputClass}
              placeholder="Texto"
            />
            <button type="button" onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))} className="px-3 py-1 text-xs text-red-400 border border-red-500/20 rounded hover:bg-red-500/10">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setBenefits([...benefits, { icon: "", title: "", text: "" }])} className="text-xs text-lime/70 hover:text-lime">
          + Agregar beneficio
        </button>
      </section>

      {/* Specs */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Especificaciones</h2>
        {specs.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={s.label}
              onChange={(e) => {
                const copy = [...specs];
                copy[i] = { ...copy[i], label: e.target.value };
                setSpecs(copy);
              }}
              className={inputClass}
              placeholder="Etiqueta"
            />
            <input
              type="text"
              value={s.value}
              onChange={(e) => {
                const copy = [...specs];
                copy[i] = { ...copy[i], value: e.target.value };
                setSpecs(copy);
              }}
              className={inputClass}
              placeholder="Valor"
            />
            <button type="button" onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))} className="px-3 py-1 text-xs text-red-400 border border-red-500/20 rounded hover:bg-red-500/10">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setSpecs([...specs, { label: "", value: "" }])} className="text-xs text-lime/70 hover:text-lime">
          + Agregar especificacion
        </button>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-white/80 border-b border-lime/10 pb-2">Preguntas frecuentes</h2>
        {faqs.map((f, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              type="text"
              value={f.q}
              onChange={(e) => {
                const copy = [...faqs];
                copy[i] = { ...copy[i], q: e.target.value };
                setFaqs(copy);
              }}
              className={inputClass}
              placeholder="Pregunta"
            />
            <input
              type="text"
              value={f.a}
              onChange={(e) => {
                const copy = [...faqs];
                copy[i] = { ...copy[i], a: e.target.value };
                setFaqs(copy);
              }}
              className={inputClass}
              placeholder="Respuesta"
            />
            <button type="button" onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))} className="px-3 py-1 text-xs text-red-400 border border-red-500/20 rounded hover:bg-red-500/10">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="text-xs text-lime/70 hover:text-lime">
          + Agregar FAQ
        </button>
      </section>

      {/* Submit */}
      <div className="pt-4 border-t border-lime/10">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-lime/20 border border-lime/30 rounded-lg text-lime font-medium hover:bg-lime/30 transition-colors disabled:opacity-50"
        >
          {submitting ? "Guardando..." : mode === "create" ? "Crear producto" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
