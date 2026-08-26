"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";
import { validateTaskInput, validatePositionUpdates } from "@/lib/validations";

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return {
      supabase: null,
      user: null,
      error: "Session expirée. Reconnecte-toi.",
    };
  }
  return { supabase, user, error: null };
}

export async function createTask(raw: unknown): Promise<ActionResult<Task>> {
  const validation = validateTaskInput(raw);
  if (!validation.ok) return { success: false, error: validation.error };

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return { success: false, error: authError ?? "Non authentifié." };
  }

  const values = validation.data;
  const { count } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", values.status)
    .eq("is_archived", false);

  const position = count ?? 0;

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: values.title,
      description: values.description || null,
      status: values.status,
      priority: values.priority,
      category: values.category || null,
      due_date: values.due_date || null,
      position,
      is_archived: false,
    })
    .select()
    .single();

  if (error) {
    console.error("[createTask]", error.code);
    return { success: false, error: "Impossible de créer la tâche." };
  }

  revalidatePath("/dashboard");
  return { success: true, data: data as Task };
}

export async function updateTask(
  taskId: string,
  raw: unknown
): Promise<ActionResult<Task>> {
  if (!taskId || typeof taskId !== "string") {
    return { success: false, error: "Identifiant de tâche invalide." };
  }

  const validation = validateTaskInput(raw);
  if (!validation.ok) return { success: false, error: validation.error };

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return { success: false, error: authError ?? "Non authentifié." };
  }

  const values = validation.data;
  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: values.title,
      description: values.description || null,
      status: values.status,
      priority: values.priority,
      category: values.category || null,
      due_date: values.due_date || null,
    })
    .eq("id", taskId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("[updateTask]", error.code);
    return { success: false, error: "Impossible de mettre à jour la tâche." };
  }
  if (!data) {
    return { success: false, error: "Tâche introuvable ou non autorisée." };
  }

  revalidatePath("/dashboard");
  return { success: true, data: data as Task };
}

export async function archiveTask(
  taskId: string,
  isArchived: boolean
): Promise<ActionResult> {
  if (!taskId || typeof taskId !== "string") {
    return { success: false, error: "Identifiant de tâche invalide." };
  }

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return { success: false, error: authError ?? "Non authentifié." };
  }

  const { error } = await supabase
    .from("tasks")
    .update({ is_archived: Boolean(isArchived) })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[archiveTask]", error.code);
    return { success: false, error: "Action impossible." };
  }

  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function deleteTask(taskId: string): Promise<ActionResult> {
  if (!taskId || typeof taskId !== "string") {
    return { success: false, error: "Identifiant de tâche invalide." };
  }

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return { success: false, error: authError ?? "Non authentifié." };
  }

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteTask]", error.code);
    return { success: false, error: "Suppression impossible." };
  }

  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function updateTaskPositions(
  rawUpdates: unknown
): Promise<ActionResult> {
  const validation = validatePositionUpdates(rawUpdates);
  if (!validation.ok) return { success: false, error: validation.error };

  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return { success: false, error: authError ?? "Non authentifié." };
  }

  const { error } = await supabase.rpc("update_task_positions", {
    updates: validation.data,
  });

  if (error) {
    console.error("[updateTaskPositions]", error.code);
    return { success: false, error: "Déplacement non enregistré." };
  }

  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function updateProfile(raw: {
  full_name?: string | null;
  default_view?: string;
}): Promise<ActionResult> {
  const { supabase, user, error: authError } = await getAuthenticatedUser();
  if (authError || !supabase || !user) {
    return { success: false, error: authError ?? "Non authentifié." };
  }

  const fullName =
    typeof raw.full_name === "string" ? raw.full_name.trim() || null : null;
  let defaultView: "list" | "kanban" = "list";
  if (raw.default_view === "kanban" || raw.default_view === "list") {
    defaultView = raw.default_view;
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      default_view: defaultView,
    },
    { onConflict: "id" }
  );

  if (error) {
    console.error("[updateProfile]", error.code);
    return { success: false, error: "Enregistrement impossible." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  return { success: true, data: undefined };
}
