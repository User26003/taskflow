"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { Task, TaskInput, TaskStatus, ViewMode } from "@/lib/types";
import { getPriorityWeight, isOverdue, normalizeText } from "@/lib/utils";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import ConfirmDialog from "@/components/ConfirmDialog";
import ViewToggle from "@/components/ViewToggle";
import KanbanBoard from "@/components/kanban/KanbanBoard";

type Props = {
  initialTasks: Task[];
  userId: string;
  initialView: ViewMode;
};

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | Task["priority"];
type SortValue = "newest" | "oldest" | "priority" | "due_date";
type OverdueFilter = "all" | "overdue";
type ArchiveFilter = "active" | "archived";

export default function TaskList({ initialTasks, userId, initialView }: Props) {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<ViewMode>(initialView);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [overdueFilter, setOverdueFilter] = useState<OverdueFilter>("all");
  const [archiveFilter, setArchiveFilter] = useState<ArchiveFilter>("active");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const visibleTasks = useMemo(
    () => tasks.filter((t) => (archiveFilter === "archived" ? t.is_archived : !t.is_archived)),
    [tasks, archiveFilter]
  );

  const filteredTasks = useMemo(() => {
    const q = normalizeText(query);

    const result = visibleTasks.filter((task) => {
      const matchesQuery =
        !q ||
        normalizeText(task.title).includes(q) ||
        normalizeText(task.description ?? "").includes(q) ||
        normalizeText(task.category ?? "").includes(q);

      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" ? true : task.priority === priorityFilter;
      const matchesOverdue =
        overdueFilter === "all" ? true : isOverdue(task);

      return matchesQuery && matchesStatus && matchesPriority && matchesOverdue;
    });

    return result.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest")
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "priority")
        return getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      if (sortBy === "due_date") {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    });
  }, [visibleTasks, query, statusFilter, priorityFilter, overdueFilter, sortBy]);

  const stats = useMemo(() => {
    const active = tasks.filter((t) => !t.is_archived);
    return {
      total: active.length,
      todo: active.filter((t) => t.status === "todo").length,
      inProgress: active.filter((t) => t.status === "in_progress").length,
      done: active.filter((t) => t.status === "done").length,
      overdue: active.filter((t) => isOverdue(t)).length,
    };
  }, [tasks]);

  async function handleCreate(values: TaskInput) {
    setCreating(true);
    const nextPosition =
      tasks.filter((t) => t.status === values.status).length;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        title: values.title,
        description: values.description || null,
        status: values.status,
        priority: values.priority,
        category: values.category || null,
        due_date: values.due_date || null,
        position: nextPosition,
      })
      .select()
      .single();

    setCreating(false);

    if (error) {
      toast.error("Impossible de créer la tâche.");
      return;
    }
    setTasks((prev) => [data as Task, ...prev]);
    toast.success("Tâche ajoutée.");
  }

  async function handleUpdate(values: TaskInput) {
    if (!editingTask) return;
    setUpdating(true);

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
      .eq("id", editingTask.id)
      .select()
      .single();

    setUpdating(false);

    if (error) {
      toast.error("Impossible de mettre à jour la tâche.");
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? (data as Task) : t))
    );
    setEditingTask(null);
    toast.success("Tâche mise à jour.");
  }

  async function handleArchive(task: Task) {
    const next = !task.is_archived;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, is_archived: next } : t))
    );

    const { error } = await supabase
      .from("tasks")
      .update({ is_archived: next })
      .eq("id", task.id);

    if (error) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, is_archived: !next } : t))
      );
      toast.error("Action impossible.");
      return;
    }
    toast.success(next ? "Tâche archivée." : "Tâche restaurée.");
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    const { error } = await supabase.from("tasks").delete().eq("id", deleteTarget);

    setDeleting(false);

    if (error) {
      toast.error("Suppression impossible.");
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== deleteTarget));
    if (editingTask?.id === deleteTarget) setEditingTask(null);
    setDeleteTarget(null);
    toast.success("Tâche supprimée.");
  }

  async function handleMove(
    taskId: string,
    newStatus: TaskStatus,
    orderedIds: string[]
  ) {
    const prevTasks = tasks;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: newStatus, position: orderedIds.indexOf(t.id) };
        }
        if (orderedIds.includes(t.id)) {
          return { ...t, position: orderedIds.indexOf(t.id) };
        }
        return t;
      })
    );

    const updates = orderedIds.map((id, index) =>
      supabase
        .from("tasks")
        .update({
          status: newStatus,
          position: index,
        })
        .eq("id", id)
    );

    const results = await Promise.all(updates);
    const failed = results.some((r) => r.error);

    if (failed) {
      setTasks(prevTasks);
      toast.error("Déplacement non enregistré.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total", value: stats.total, accent: "text-slate-900" },
          { label: "À faire", value: stats.todo, accent: "text-slate-900" },
          { label: "En cours", value: stats.inProgress, accent: "text-slate-900" },
          { label: "Terminées", value: stats.done, accent: "text-slate-900" },
          { label: "En retard", value: stats.overdue, accent: "text-red-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-semibold tracking-tight ${card.accent}`}>
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-6">
          <TaskForm mode="create" onSubmit={handleCreate} loading={creating} />
          {editingTask ? (
            <TaskForm
              mode="edit"
              initialValues={{
                title: editingTask.title,
                description: editingTask.description ?? "",
                status: editingTask.status,
                priority: editingTask.priority,
                category: editingTask.category ?? "",
                due_date: editingTask.due_date ?? "",
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
                  Recherche, tri, filtres et vue Kanban.
                </p>
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 xl:col-span-2"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">Tous les statuts</option>
                <option value="todo">À faire</option>
                <option value="in_progress">En cours</option>
                <option value="done">Terminé</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">Toutes priorités</option>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
              <select
                value={overdueFilter}
                onChange={(e) => setOverdueFilter(e.target.value as OverdueFilter)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="all">Toutes</option>
                <option value="overdue">En retard</option>
              </select>
              <select
                value={archiveFilter}
                onChange={(e) => setArchiveFilter(e.target.value as ArchiveFilter)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="active">Actives</option>
                <option value="archived">Archivées</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortValue)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 md:col-span-2 xl:col-span-6"
              >
                <option value="newest">Trier : plus récentes</option>
                <option value="oldest">Trier : plus anciennes</option>
                <option value="priority">Trier : priorité</option>
                <option value="due_date">Trier : échéance</option>
              </select>
            </div>
          </div>

          {view === "kanban" ? (
            <KanbanBoard
              tasks={filteredTasks}
              onEdit={setEditingTask}
              onMove={handleMove}
            />
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                Aucune tâche trouvée
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ajuste les filtres ou ajoute une nouvelle tâche.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={setDeleteTarget}
                  onArchive={handleArchive}
                  deleting={deleting && deleteTarget === task.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Supprimer la tâche"
        description="Cette action est définitive. La tâche sera supprimée pour de bon."
        confirmLabel="Supprimer"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}