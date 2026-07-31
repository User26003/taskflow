import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/SettingsForm";
import type { Profile } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-600">Paramètres</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Ton profil
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Gère ton nom et ta vue par défaut.
          </p>
        </div>

        <SettingsForm
          userId={user.id}
          email={user.email ?? ""}
          profile={(profile as Profile) ?? null}
        />
      </div>
    </main>
  );
}