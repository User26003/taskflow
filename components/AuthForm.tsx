"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage(
          "Compte créé. Vérifie ta boîte mail si la confirmation est activée, sinon connecte-toi."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600 text-sm font-semibold text-white">
            T
          </div>
          <span className="text-lg font-semibold tracking-tight">
            TaskFlow
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {isLogin ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isLogin
            ? "Accède à ton espace de gestion de tâches."
            : "Commence à organiser tes tâches en quelques secondes."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
          {loading
            ? "Chargement..."
            : isLogin
            ? "Se connecter"
            : "Créer le compte"}
        </button>
        
        {isLogin ? (
  <p className="mt-3 text-center text-sm">
    <Link href="/forgot-password" className="text-slate-500 hover:text-violet-600">
      Mot de passe oublié ?
    </Link>
  </p>
) : null}
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-violet-600 hover:text-violet-700"
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </Link>
      </p>
    </div>
  );
}