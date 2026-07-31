"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Task, TaskInput } from "@/lib/types";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";

type Props = {
  initialTasks: Task[];
  userId: string;
};

type StatusFilter = "all" | Task["status"];
type PriorityFilter = "all" | Task["priority"];

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function getStatusLabel(status: StatusFilter) {
  switch (status) {
    case "all":
      return "Tous les statuts";
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

function getPriorityLabel(priority: PriorityFilter) {
  switch (priority) {
    case "all":
      return "Toutes les priorités";
    case "low":
      return "Basse";
    case "medium":
      return "Moyenne";
    case "high":
      return "Haute";
    default:
      return priority;
  }
}

export default function TaskList({ initialTasks, userId }: Props) {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    return tasks.filter((task) => {
      const matchesQuery =
        !normalizedQuery ||
        normalizeText(task.title).includes(normalizedQuery) ||
        normalizeText(task.description ?? "").includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ? true : task.priority === priorityFilter;

      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [tasks, query, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      inProgress: tasks.filter((task) => task.status === "in_progress").length,
      done: tasks.filter((task) => task.status === "done").length,
    };
  }, [tasks]);

  async function handleCreate(values: TaskInput) {
    setError("");
    setFeedback("");
    setCreating(true);

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: values.title,
        description: values.description || null,
        status: values.status,
        priority: values.priority,
      })
      .select()
      .single();

    setCreating(false);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks((prev) => [data as Task, ...prev]);
    setFeedback("Tâche ajoutée.");
  }

  async function handleUpdate(values: TaskInput) {
    if (!editingTask) return;

    setError("");
    setFeedback("");
    setUpdating(true);

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: values.title,
        description: values.description || null,
        status: values.status,
        priority: values.priority,
      })
      .eq("id", editingTask.id)
      .select()
      .single();

    setUpdating(false);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === editingTask.id ? (data as Task) : task))
    );
    setEditingTask(null);
    setFeedback("Tâche mise à jour.");
  }

  async function handleDelete(taskId: string) {
    setError("");
    setFeedback("");
    setDeletingId(taskId);

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    setDeletingId(null);

    if (error) {
      setError(error.message);
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    if (editingTask?.id === taskId) {
      setEditingTask(null);
    }

    setFeedback("Tâche supprimée.");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {stats.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">À faire</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {stats.todo}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">En cours</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {stats.inProgress}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Terminées</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {stats.done}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <TaskForm
            mode="create"
            onSubmit={handleCreate}
            loading={creating}
          />

          {editingTask ? (
            <TaskForm
              mode="edit"
              initialValues={{
                title: editingTask.title,
                description: editingTask.description ?? "",
                status: editingTask.status,
                priority: editingTask.priority,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingTask(null)}
              loading={updating}
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                  Mes tâches
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recherche, filtre et organise ton espace de travail.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">{getStatusLabel("all")}</option>
                <option value="todo">{getStatusLabel("todo")}</option>
                <option value="in_progress">{getStatusLabel("in_progress")}</option>
                <option value="done">{getStatusLabel("done")}</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as PriorityFilter)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">{getPriorityLabel("all")}</option>
                <option value="low">{getPriorityLabel("low")}</option>
                <option value="medium">{getPriorityLabel("medium")}</option>
                <option value="high">{getPriorityLabel("high")}</option>
              </select>
            </div>

            {feedback ? (
              <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
                {feedback}
              </p>
            ) : null}

            {error ? (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>

          {filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                Aucune tâche trouvée
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Essaie un autre filtre ou ajoute une nouvelle tâche.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={handleDelete}
                  deleting={deletingId === task.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}