import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function uploadProductImage(
  file: File,
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Formato no permitido. Usa JPG, PNG o WebP." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "La imagen no puede superar 5MB." };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("products")
    .upload(filename, file, { contentType: file.type });

  if (error) {
    console.error("Storage upload error:", error.message);
    return { error: "Error al subir la imagen. Intenta de nuevo." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("products").getPublicUrl(data.path);

  return { url: publicUrl };
}
