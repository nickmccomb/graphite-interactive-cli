import { describe, expect, it } from "vitest";
import { extractCwd } from "./parse-argv.js";
import { formatGtInvocation } from "./run-gt.js";

describe("extractCwd", () => {
  it("parses --cwd and leaves rest", () => {
    expect(extractCwd(["--cwd", "/tmp", "doctor"])).toEqual({
      cwd: "/tmp",
      rest: ["doctor"],
    });
  });

  it("parses -C", () => {
    expect(extractCwd(["-C", "/x", "raw", "log"])).toEqual({
      cwd: "/x",
      rest: ["raw", "log"],
    });
  });

  it("parses --cwd=", () => {
    expect(extractCwd(["--cwd=/repo"])).toEqual({ cwd: "/repo", rest: [] });
  });
});

describe("formatGtInvocation", () => {
  it("quotes args with spaces", () => {
    expect(
      formatGtInvocation("gt", ["submit", "--message", "hello world"]),
    ).toBe(`gt submit --message 'hello world'`);
  });
});
