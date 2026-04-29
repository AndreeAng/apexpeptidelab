import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/dal/profiles";
import { getOrdersByUserId } from "@/lib/dal/orders";
import { redirect } from "next/navigation";
import { CuentaContent } from "@/components/cuenta/CuentaContent";

export default async function CuentaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta/login");

  const profile = await getProfile(user.id);
  const orders = await getOrdersByUserId(user.id);

  return (
    <CuentaContent
      profile={profile}
      orders={orders}
      userEmail={user.email ?? ""}
    />
  );
}
