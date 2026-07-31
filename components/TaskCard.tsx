"use client";

import type { Task } from "@/lib/types";
import {
  formatDate,
  getPriorityLabel,
  getPriorityStyles,
  getStatusLabel,
  isOverdue,
} from "@/lib/utils";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onArchive: (task: Task) => Promise<void>;
  deleting?: boolean;
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onArchive,
  deleting = false,
}: Props) {
  const overdue = isOverdue(task);

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

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
          {getStatusLabel(task.status)}
        </span>

        {task.category ? (
          <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
            {task.category}
          </span>
        ) : null}

        {task.due_date ? (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              overdue ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"
            }`}
          >
            {overdue ? "En retard · " : "Échéance · "}
            {formatDate(task.due_date)}
          </span>
        ) : null}
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
            onClick={() => onArchive(task)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            {task.is_archived ? "Restaurer" : "Archiver"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={deleting}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "..." : "Supprimer"}
          </button>
        </div>
      </div>
    </article>
  );
}