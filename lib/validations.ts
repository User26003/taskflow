import type { TaskInput, TaskPriority, TaskStatus, ViewMode } from "./types";

const TITLE_MAX = 200;
const DESCRIPTION_MAX = 5000;
const CATEGORY_MAX = 100;

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];
const VALID_PRIORITIES: TaskPriority[] = ["low", "medium", "high"];
const VALID_VIEWS: ViewMode[] = ["list", "kanban"];

export type ValidationResult =
  | { ok: true; data: TaskInput }
  | { ok: false; error: string };

export function isValidStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && VALID_STATUSES.includes(value as TaskStatus);
}

export function isValidPriority(value: unknown): value is TaskPriority {
  return typeof value === "string" && VALID_PRIORITIES.includes(value as TaskPriority);
}

export function isValidViewMode(value: unknown): value is ViewMode {
  return typeof value === "string" && VALID_VIEWS.includes(value as ViewMode);
}

export function validateTaskInput(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Données invalides." };
  }
  const input = raw as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) return { ok: false, error: "Le titre est obligatoire." };
  if (title.length > TITLE_MAX) {
    return { ok: false, error: `Le titre ne peut pas dépasser ${TITLE_MAX} caractères.` };
  }
  let description: string | null = null;
  if (typeof input.description === "string") {
    const trimmed = input.description.trim();
    if (trimmed.length > DESCRIPTION_MAX) {
      return { ok: false, error: `La description ne peut pas dépasser ${DESCRIPTION_MAX} caractères.` };
    }
    description = trimmed || null;
  }
  if (!isValidStatus(input.status)) return { ok: false, error: "Statut invalide." };
  if (!isValidPriority(input.priority)) return { ok: false, error: "Priorité invalide." };
  let category: string | null = null;
  if (typeof input.category === "string") {
    const trimmed = input.category.trim();
    if (trimmed.length > CATEGORY_MAX) {
      return { ok: false, error: `La catégorie ne peut pas dépasser ${CATEGORY_MAX} caractères.` };
    }
    category = trimmed || null;
  }
  let due_date: string | null = null;
  if (typeof input.due_date === "string" && input.due_date.trim()) {
    const dateStr = input.due_date.trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return { ok: false, error: "Date d'échéance invalide." };
    }
    const parsed = new Date(dateStr + "T00:00:00Z");
    if (Number.isNaN(parsed.getTime())) {
      return { ok: false, error: "Date d'échéance invalide." };
    }
    due_date = dateStr;
  }
  return {
    ok: true,
    data: {
      title,
      description: description ?? "",
      status: input.status,
      priority: input.priority,
      category: category ?? "",
      due_date: due_date ?? "",
    },
  };
}

export function validatePositionUpdates(
  updates: unknown
): { ok: true; data: { id: string; status: TaskStatus; position: number }[] } | { ok: false; error: string } {
  if (!Array.isArray(updates) || updates.length === 0) {
    return { ok: false, error: "Mises à jour invalides." };
  }
  if (updates.length > 200) return { ok: false, error: "Trop de mises à jour." };
  const result: { id: string; status: TaskStatus; position: number }[] = [];
  for (const item of updates) {
    if (!item || typeof item !== "object") return { ok: false, error: "Élément de mise à jour invalide." };
    const u = item as Record<string, unknown>;
    if (typeof u.id !== "string" || !u.id) return { ok: false, error: "ID de tâche manquant." };
    if (!isValidStatus(u.status)) return { ok: false, error: "Statut invalide dans les mises à jour." };
    if (typeof u.position !== "number" || !Number.isInteger(u.position) || u.position < 0) {
      return { ok: false, error: "Position invalide." };
    }
    result.push({ id: u.id, status: u.status, position: u.position });
  }
  return { ok: true, data: result };
}
