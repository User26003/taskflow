"use client";

import { useEffect, useState } from "react";
import type { TaskInput } from "@/lib/types";

type Props = {
  mode: "create" | "edit";
  initialValues?: TaskInput;
  onSubmit: (values: TaskInput) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
};

const defaultValues: TaskInput = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  category: "",
  due_date: "",
};

export default function TaskForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}: Props) {
  const [values, setValues] = useState<TaskInput>(initialValues ?? defaultValues);
  const [error, setError] = useState("");

  useEffect(() => {
    setValues(initialValues ?? defaultValues);
  }, [initialValues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    await onSubmit({
      title: values.title.trim(),
      description: values.description?.trim() || "",
      status: values.status,
      priority: values.priority,
      category: values.category?.trim() || "",
      due_date: values.due_date || "",
    });

    if (mode === "create") {
      setValues(defaultValues);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            {mode === "create" ? "Nouvelle tâche" : "Modifier la tâche"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {mode === "create"
              ? "Ajoute une tâche avec statut, priorité et échéance."
              : "Mets à jour les informations de la tâche."}
          </p>
        </div>

        {mode === "edit" && onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Annuler
          </button>
        ) : null}
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
          Titre
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description ?? ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, description: e.target.value }))
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-slate-700">
            Statut
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                status: e.target.value as TaskInput["status"],
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="done">Terminé</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-slate-700">
            Priorité
          </label>
          <select
            id="priority"
            value={values.priority}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                priority: e.target.value as TaskInput["priority"],
              }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
            Catégorie
          </label>
          <input
            id="category"
            type="text"
            value={values.category ?? ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, category: e.target.value }))
            }
            placeholder="Design, Admin, Produit..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div>
          <label htmlFor="due_date" className="mb-1.5 block text-sm font-medium text-slate-700">
            Échéance
          </label>
          <input
            id="due_date"
            type="date"
            value={values.due_date ?? ""}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, due_date: e.target.value }))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
      >
        {loading
          ? "Enregistrement..."
          : mode === "create"
          ? "Ajouter la tâche"
          : "Enregistrer les modifications"}
      </button>
    </form>
  );
}