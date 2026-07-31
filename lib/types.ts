export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type ViewMode = "list" | "kanban";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  category: string | null;
  due_date: string | null;
  position: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type TaskInput = Pick<
  Task,
  "title" | "description" | "status" | "priority" | "category" | "due_date"
>;

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  default_view: ViewMode;
  created_at: string;
  updated_at: string;
};