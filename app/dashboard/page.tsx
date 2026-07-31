import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TaskList from "@/components/TaskList";
import type { Task } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const tasks = (data ?? []) as Task[];

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-violet-600">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Gère tes tâches sans friction
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Un espace clair pour créer, filtrer et suivre l’avancement de tes tâches
            avec un design produit sobre et dense.
          </p>
        </div>

        <TaskList initialTasks={tasks} userId={user.id} />
      </div>
    </main>
  );
}