import { createClient } from "@/lib/supabase/server";

export async function uploadProductImage(file: File): Promise<string | null> {
  const supabase = await createClient();
  const filename = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, { contentType: file.type });
  if (error) return null;
  const { data: { publicUrl } } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);
  return publicUrl;
}
