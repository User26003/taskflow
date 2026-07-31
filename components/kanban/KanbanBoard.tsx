"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { Task, TaskStatus } from "@/lib/types";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

type Props = {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onMove: (taskId: string, newStatus: TaskStatus, orderedIds: string[]) => void;
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

    const activeId = active.id as string;
    const overId = over.id as string;

    // Colonne cible : soit un status (droppable colonne), soit le status d'une carte
    const targetStatus = COLUMNS.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : findStatusOfTask(overId);

    if (!targetStatus) return;

    const currentColumn = grouped[targetStatus].filter(
      (t) => t.id !== activeId
    );

    const overIndex = currentColumn.findIndex((t) => t.id === overId);
    const insertIndex = overIndex >= 0 ? overIndex : currentColumn.length;

    const newOrder = [...currentColumn];
    newOrder.splice(insertIndex, 0, {
      ...tasks.find((t) => t.id === activeId)!,
      status: targetStatus,
    });

    onMove(
      activeId,
      targetStatus,
      newOrder.map((t) => t.id)
    );
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
        {activeTask ? <KanbanCard task={activeTask} onEdit={onEdit} /> : null}
      </DragOverlay>
    </DndContext>
  );
}