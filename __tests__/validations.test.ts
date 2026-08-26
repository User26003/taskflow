import { describe, it, expect } from "vitest";
import {
  validateTaskInput,
  validatePositionUpdates,
  isValidStatus,
  isValidPriority,
  isValidViewMode,
} from "@/lib/validations";

describe("validateTaskInput", () => {
  it("rejects empty title", () => {
    const r = validateTaskInput({ title: "   ", status: "todo", priority: "medium" });
    expect(r.ok).toBe(false);
  });
  it("rejects title too long", () => {
    const r = validateTaskInput({ title: "a".repeat(201), status: "todo", priority: "medium" });
    expect(r.ok).toBe(false);
  });
  it("accepts valid input", () => {
    const r = validateTaskInput({
      title: "  Hello  ",
      description: "  desc  ",
      status: "in_progress",
      priority: "high",
      category: "  Work ",
      due_date: "2026-12-01",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.title).toBe("Hello");
      expect(r.data.category).toBe("Work");
    }
  });
  it("rejects invalid status", () => {
    expect(validateTaskInput({ title: "Test", status: "pending", priority: "medium" }).ok).toBe(false);
  });
});

describe("helpers", () => {
  it("status", () => {
    expect(isValidStatus("todo")).toBe(true);
    expect(isValidStatus("nope")).toBe(false);
  });
  it("priority", () => {
    expect(isValidPriority("high")).toBe(true);
    expect(isValidPriority("urgent")).toBe(false);
  });
  it("view", () => {
    expect(isValidViewMode("kanban")).toBe(true);
    expect(isValidViewMode("grid")).toBe(false);
  });
});

describe("validatePositionUpdates", () => {
  it("ok", () => {
    expect(validatePositionUpdates([{ id: "a", status: "todo", position: 0 }]).ok).toBe(true);
  });
  it("empty fails", () => {
    expect(validatePositionUpdates([]).ok).toBe(false);
  });
});
