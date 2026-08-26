import { describe, it, expect } from "vitest";
import { getPriorityWeight, getStatusLabel, isOverdue, normalizeText } from "@/lib/utils";
import type { Task } from "@/lib/types";

function makeTask(o: Partial<Task> = {}): Task {
  return {
    id: "1", user_id: "u1", title: "Test", description: null, status: "todo",
    priority: "medium", category: null, due_date: null, position: 0,
    is_archived: false, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z",
    ...o,
  };
}

describe("utils", () => {
  it("priority weight", () => {
    expect(getPriorityWeight("high")).toBeGreaterThan(getPriorityWeight("low"));
  });
  it("status label", () => {
    expect(getStatusLabel("todo")).toBe("À faire");
  });
  it("overdue", () => {
    expect(isOverdue(makeTask({ due_date: "2020-01-01", status: "todo" }))).toBe(true);
    expect(isOverdue(makeTask({ due_date: "2020-01-01", status: "done" }))).toBe(false);
  });
  it("normalize", () => {
    expect(normalizeText("  Hello  ")).toBe("hello");
  });
});
