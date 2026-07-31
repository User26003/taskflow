"use client";

import type { ViewMode } from "@/lib/types";

type Props = {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
};

export default function ViewToggle({ view, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          view === "list"
            ? "bg-violet-600 text-white"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Liste
      </button>
      <button
        type="button"
        onClick={() => onChange("kanban")}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          view === "kanban"
            ? "bg-violet-600 text-white"
            : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        Kanban
      </button>
    </div>
  );
}