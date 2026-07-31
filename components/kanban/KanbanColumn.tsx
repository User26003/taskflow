"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@/lib/types";
import { getStatusLabel } from "@/lib/utils";
import KanbanCard from "./KanbanCard";

type Props = {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
};

export default function KanbanColumn({ status, tasks, onEdit }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] w-full flex-col rounded-2xl border p-4 transition ${
        isOver ? "border-violet-300 bg-violet-50/50" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">
          {getStatusLabel(status)}
        </h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-3">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
              Glisse une tâche ici
            </div>
          ) : (
            tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onEdit={onEdit} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}