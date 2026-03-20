import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { shouldForwardGtDebug, shouldTeachBack } from "./run-gt.js";

const KEYS = [
  "GTM_SHOW_GT",
  "GTR_SHOW_GT",
  "GTM_DEBUG",
  "GTR_DEBUG",
  "DEBUG",
] as const;

function clearTestEnv(): void {
  for (const k of KEYS) delete process.env[k];
}

beforeEach(() => {
  clearTestEnv();
});

afterEach(() => {
  clearTestEnv();
});

describe("shouldTeachBack", () => {
  it("is false when unset", () => {
    expect(shouldTeachBack()).toBe(false);
  });

  it("is true for GTM_SHOW_GT=1 or true", () => {
    process.env.GTM_SHOW_GT = "1";
    expect(shouldTeachBack()).toBe(true);
    delete process.env.GTM_SHOW_GT;
    process.env.GTM_SHOW_GT = "true";
    expect(shouldTeachBack()).toBe(true);
  });

  it("supports legacy GTR_SHOW_GT", () => {
    process.env.GTR_SHOW_GT = "1";
    expect(shouldTeachBack()).toBe(true);
  });
});

describe("shouldForwardGtDebug", () => {
  it("is false when unset", () => {
    expect(shouldForwardGtDebug()).toBe(false);
  });

  it("is true for GTM_DEBUG or GTR_DEBUG", () => {
    process.env.GTM_DEBUG = "1";
    expect(shouldForwardGtDebug()).toBe(true);
    delete process.env.GTM_DEBUG;
    process.env.GTR_DEBUG = "true";
    expect(shouldForwardGtDebug()).toBe(true);
  });

  it("is true when DEBUG contains gtm", () => {
    process.env.DEBUG = "foo,gtm,bar";
    expect(shouldForwardGtDebug()).toBe(true);
  });
});
