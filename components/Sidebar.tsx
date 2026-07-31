"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  email: string;
};

export default function Sidebar({ email }: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-sm font-semibold text-white">
          T
        </div>
        <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="flex items-center gap-2.5 rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
          Mes tâches
        </div>
      </nav>

      <div className="border-t border-slate-200 pt-4">
        <p className="mb-3 truncate px-1 text-xs text-slate-500">{email}</p>
        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}