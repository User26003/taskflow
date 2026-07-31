export type Task = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    status: "todo" | "in_progress" | "done";
    priority: "low" | "medium" | "high";
    created_at: string;
    updated_at: string;
  };
  
  export type TaskInput = Pick<
    Task,
    "title" | "description" | "status" | "priority"
  >;