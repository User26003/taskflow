import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const FEATURES = [
  {
    title: "Organisation claire",
    text: "Statuts, priorités, catégories et échéances pour cadrer ton travail.",
  },
  {
    title: "Vue Kanban",
    text: "Glisse-dépose tes tâches entre les colonnes et suis l’avancement.",
  },
  {
    title: "Filtres puissants",
    text: "Recherche, tri, filtre en retard et archivage en un clic.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-sm font-semibold text-white">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
        </div>
        <nav className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Ouvrir le dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Commencer
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 text-center">
        <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
          Gestion de tâches moderne
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Organise ton travail sans friction
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
          TaskFlow réunit liste, Kanban, priorités et échéances dans une interface
          épurée. Concentre-toi sur ce qui compte.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href={user ? "/dashboard" : "/signup"}
            className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            {user ? "Aller au dashboard" : "Créer un compte gratuit"}
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Se connecter
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          Prêt à reprendre le contrôle ?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          Crée ton espace en quelques secondes et commence à organiser tes tâches.
        </p>
        <Link
          href={user ? "/dashboard" : "/signup"}
          className="mt-8 inline-flex rounded-lg bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
        >
          {user ? "Ouvrir TaskFlow" : "Commencer maintenant"}
        </Link>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-400">
          TaskFlow — Next.js, Supabase, Tailwind CSS.
        </div>
      </footer>
    </div>
  );
}