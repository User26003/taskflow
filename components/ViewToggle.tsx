"use client";

import type { ViewMode } from "@/lib/types";

type Props = {
  view: ViewMode;
  loading?: boolean;
  onChange: (view: ViewMode) => void;
};

export default function ViewToggle({
  view,
  loading = false,
  onChange,
}: Props) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => onChange("list")}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          view === "list"
            ? "bg-violet-600 text-white"
            : "text-slate-600 hover:bg-slate-50"
        } disabled:opacity-60`}
      >
        Liste
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={() => onChange("kanban")}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          view === "kanban"
            ? "bg-violet-600 text-white"
            : "text-slate-600 hover:bg-slate-50"
        } disabled:opacity-60`}
      >
        Kanban
      </button>
    </div>
  );
}
