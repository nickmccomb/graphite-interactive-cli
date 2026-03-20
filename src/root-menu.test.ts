import { describe, expect, it } from "vitest";
import { ROOT_MENU_OPTIONS, type RootMenuValue } from "./root-menu.js";

describe("ROOT_MENU_OPTIONS", () => {
  it("has unique value keys", () => {
    const values = ROOT_MENU_OPTIONS.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("does not expose removed root items", () => {
    const values = ROOT_MENU_OPTIONS.map((o) => o.value);
    expect(values).not.toContain("help");
    expect(values).not.toContain("doctor");
  });

  it("keeps high-touch flow first: stack, create, sync", () => {
    const values = ROOT_MENU_OPTIONS.map((o) => o.value) as RootMenuValue[];
    expect(values.slice(0, 3)).toEqual(["stack", "create", "sync"]);
  });

  it("ends with raw then start before Exit (added in interactive)", () => {
    const values = ROOT_MENU_OPTIONS.map((o) => o.value);
    expect(values.at(-2)).toBe("raw");
    expect(values.at(-1)).toBe("start");
  });
});
