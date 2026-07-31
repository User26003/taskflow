"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  email: string;
};

const NAV = [
  { href: "/dashboard", label: "Mes tâches" },
  { href: "/settings", label: "Paramètres" },
];

export default function Sidebar({ email }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="border-b border-slate-200 bg-white lg:flex lg:min-h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:block lg:px-5 lg:py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-sm font-semibold text-white">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          Sortir
        </button>
      </div>

      <div className="px-4 pb-4 lg:flex lg:flex-1 lg:flex-col lg:px-5 lg:pb-5">
        <nav className="mb-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "bg-violet-600" : "bg-slate-300"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:mt-auto lg:block lg:border-t lg:border-slate-200 lg:pt-4">
          <p className="mb-3 truncate px-1 text-xs text-slate-500">{email}</p>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}