import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TaskList from "@/components/TaskList";
import type { Task, ViewMode } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: tasksData, error }, { data: profile }] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("default_view").eq("id", user.id).single(),
  ]);

  if (error) throw new Error(error.message);

  const tasks = (tasksData ?? []) as Task[];
  const initialView = (profile?.default_view as ViewMode) ?? "list";

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Gère tes tâches sans friction
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Crée, filtre, trie et organise tes tâches en liste ou en Kanban.
          </p>
        </div>

        <TaskList initialTasks={tasks} userId={user.id} initialView={initialView} />
      </div>
    </main>
  );
}