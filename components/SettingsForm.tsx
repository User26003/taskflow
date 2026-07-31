"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Profile, ViewMode } from "@/lib/types";

type Props = {
  userId: string;
  email: string;
  profile: Profile | null;
};

export default function SettingsForm({ userId, email, profile }: Props) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [defaultView, setDefaultView] = useState<ViewMode>(
    profile?.default_view ?? "list"
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName.trim() || null,
      default_view: defaultView,
    });

    setLoading(false);

    if (error) {
      toast.error("Enregistrement impossible.");
      return;
    }
    toast.success("Profil mis à jour.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500"
        />
      </div>

      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
          Nom complet
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ton nom"
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label htmlFor="defaultView" className="mb-1.5 block text-sm font-medium text-slate-700">
          Vue par défaut
        </label>
        <select
          id="defaultView"
          value={defaultView}
          onChange={(e) => setDefaultView(e.target.value as ViewMode)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        >
          <option value="list">Liste</option>
          <option value="kanban">Kanban</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}