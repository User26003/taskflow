import type { Task, TaskPriority, TaskStatus } from "./types";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function isOverdue(task: Task) {
  if (!task.due_date || task.status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due_date) < today;
}

export function getPriorityLabel(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return "Haute";
    case "medium":
      return "Moyenne";
    case "low":
      return "Basse";
  }
}

export function getStatusLabel(status: TaskStatus) {
  switch (status) {
    case "todo":
      return "À faire";
    case "in_progress":
      return "En cours";
    case "done":
      return "Terminé";
  }
}

export function getPriorityWeight(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}

export function getPriorityStyles(priority: TaskPriority) {
  switch (priority) {
    case "high":
      return "border-red-200 bg-red-50 text-red-700";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
}

export function normalizeText(value: string) {
  return value.toLowerCase().trim();
}