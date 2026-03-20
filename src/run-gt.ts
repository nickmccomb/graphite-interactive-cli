import process from "node:process";
import { execa, execaSync } from "execa";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import pc from "picocolors";
import consola from "consola";

export function resolveGtBinary(): string {
  const fromEnv = process.env.GRAPHITE_CLI ?? process.env.GT_BINARY;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.trim();
  return "gt";
}

const cwdSchema = z.string().min(1, "cwd must be non-empty");

export function resolveAndValidateCwd(cwd?: string): string {
  const base = cwd ? path.resolve(cwd) : process.cwd();
  const parsed = cwdSchema.parse(base);
  if (!fs.existsSync(parsed)) {
    throw new Error(`Path does not exist: ${parsed}`);
  }
  if (!fs.statSync(parsed).isDirectory()) {
    throw new Error(`Not a directory: ${parsed}`);
  }
  return parsed;
}

export function formatGtInvocation(
  binary: string,
  args: readonly string[],
): string {
  const quote = (s: string): string => {
    if (/[\s'"\\]/.test(s)) return `'${s.replace(/'/g, `'\\''`)}'`;
    return s;
  };
  return [binary, ...args.map(quote)].join(" ");
}

function prependGlobalGtArgs(
  binary: string,
  args: string[],
  opts: { addDebug: boolean },
): [string, string[]] {
  const prefix: string[] = [];
  if (opts.addDebug) prefix.push("--debug");
  if (prefix.length === 0) return [binary, args];
  return [binary, [...prefix, ...args]];
}

export interface RunGtOptions {
  cwd: string;
  /** When true, child inherits stdin/stdout/stderr (TTY-safe for interactive gt). */
  inheritStdio: boolean;
  /** Print equivalent shell line when GTR_SHOW_GT=1 */
  teachBack?: boolean;
}

export function shouldTeachBack(): boolean {
  return process.env.GTR_SHOW_GT === "1" || process.env.GTR_SHOW_GT === "true";
}

export function shouldForwardGtDebug(): boolean {
  return (
    process.env.GTR_DEBUG === "1" ||
    process.env.GTR_DEBUG === "true" ||
    process.env.DEBUG?.includes("gtm") === true
  );
}

export function printTeachBack(binary: string, args: readonly string[]): void {
  console.log(
    pc.dim(`\n→ Equivalent: ${formatGtInvocation(binary, [...args])}\n`),
  );
}

export function checkGtAvailable(cwd: string, binary: string): boolean {
  const [bin, args] = prependGlobalGtArgs(binary, ["--version"], {
    addDebug: false,
  });
  const r = execaSync(bin, args, {
    cwd,
    stdio: "pipe",
    reject: false,
    preferLocal: true,
  });
  return r.exitCode === 0;
}

export function preflightGt(cwd: string, binary: string): void {
  if (checkGtAvailable(cwd, binary)) return;
  consola.error(
    pc.red(
      `Could not run Graphite CLI (${binary}). Install it: https://graphite.dev/docs/install-the-cli`,
    ),
  );
  process.exit(1);
}

export async function runGt(
  gtArgs: string[],
  options: RunGtOptions,
): Promise<{ exitCode: number | undefined }> {
  const binary = resolveGtBinary();
  const addDebug = shouldForwardGtDebug();
  const [bin, allArgs] = prependGlobalGtArgs(binary, gtArgs, { addDebug });

  if (options.teachBack ?? shouldTeachBack()) {
    printTeachBack(bin, allArgs);
  }

  if (options.inheritStdio) {
    const sub = execa(bin, allArgs, {
      cwd: options.cwd,
      stdio: "inherit",
      reject: false,
      preferLocal: true,
    });
    const r = await sub;
    return { exitCode: r.exitCode ?? undefined };
  }

  const r = await execa(bin, allArgs, {
    cwd: options.cwd,
    stdio: "pipe",
    reject: false,
    preferLocal: true,
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return { exitCode: r.exitCode ?? undefined };
}

export function captureGitBranch(cwd: string): string | undefined {
  try {
    const r = execaSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
      cwd,
      stdio: "pipe",
      reject: false,
    });
    if (r.exitCode !== 0) return undefined;
    const b = String(r.stdout).trim();
    return b.length > 0 ? b : undefined;
  } catch {
    return undefined;
  }
}

export function isInsideGitWorkTree(cwd: string): boolean {
  const r = execaSync("git", ["rev-parse", "--is-inside-work-tree"], {
    cwd,
    stdio: "pipe",
    reject: false,
  });
  return r.exitCode === 0 && String(r.stdout).trim() === "true";
}
