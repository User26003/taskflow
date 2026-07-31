"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/lib/types";
import {
  formatDate,
  getPriorityLabel,
  getPriorityStyles,
  isOverdue,
} from "@/lib/utils";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
};

export default function KanbanCard({ task, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const overdue = isOverdue(task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm active:cursor-grabbing"
      onDoubleClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">
          {task.title}
        </h4>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPriorityStyles(
            task.priority
          )}`}
        >
          {getPriorityLabel(task.priority)}
        </span>
      </div>

      {task.description?.trim() ? (
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
          {task.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.category ? (
          <span className="inline-flex rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
            {task.category}
          </span>
        ) : null}

        {task.due_date ? (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
              overdue ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {formatDate(task.due_date)}
          </span>
        ) : null}
      </div>
    </div>
  );
}