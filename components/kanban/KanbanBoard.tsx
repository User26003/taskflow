"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onMove: (activeId: string, overId: string, targetStatus: TaskStatus) => void;
};

export default function KanbanBoard({ tasks, onEdit, onMove }: Props) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };

    for (const task of tasks) {
      map[task.status].push(task);
    }

    for (const status of COLUMNS) {
      map[status].sort((a, b) => a.position - b.position);
    }

    return map;
  }, [tasks]);

  function findStatusOfTask(taskId: string): TaskStatus | null {
    const task = tasks.find((t) => t.id === taskId);
    return task ? task.status : null;
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const targetStatus = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : findStatusOfTask(overId);

    if (!targetStatus) return;

    onMove(activeId, overId, targetStatus);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onEdit={onEdit}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <h4 className="text-sm font-semibold text-slate-900">
              {activeTask.title}
            </h4>
            {activeTask.description?.trim() ? (
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                {activeTask.description}
              </p>
            ) : null}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}