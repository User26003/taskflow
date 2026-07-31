"use client";

import type { Task } from "@/lib/types";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  deleting?: boolean;
};

function getPriorityStyles(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50 text-red-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getPriorityLabel(priority: Task["priority"]) {
  switch (priority) {
    case "high":
      return "Haute";
    case "medium":
      return "Moyenne";
    case "low":
      return "Basse";
    default:
      return priority;
  }
}

function getStatusLabel(status: Task["status"]) {
  switch (status) {
    case "todo":
      return "À faire";
    case "in_progress":
      return "En cours";
    case "done":
      return "Terminé";
    default:
      return status;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function TaskCard({ task, onEdit, onDelete, deleting = false }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
            {task.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Créée le {formatDate(task.created_at)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityStyles(
            task.priority
          )}`}
        >
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      <div className="mt-4">
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {getStatusLabel(task.status)}
        </span>
      </div>

      <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-600">
        {task.description?.trim() ? task.description : "Aucune description."}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Mise à jour le {formatDate(task.updated_at)}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </article>
  );
}