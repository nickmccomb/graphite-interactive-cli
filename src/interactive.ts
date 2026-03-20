import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  password,
  select,
  text,
} from "@clack/prompts";
import { z } from "zod";
import process from "node:process";
import pc from "picocolors";
import { CLI_CMD } from "./cli-invocation.js";
import {
  captureGitBranch,
  preflightGt,
  resolveGtBinary,
  runGt,
  resolveAndValidateCwd,
} from "./run-gt.js";

const BACK = { value: "__back", label: "Back", hint: "" };
const EXIT = { value: "__exit", label: "Exit", hint: "" };

function handleCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Cancelled");
    process.exit(0);
  }
  return value;
}

async function maybeSuggestInit(
  cwd: string,
  exitCode: number | undefined,
): Promise<void> {
  if (exitCode === 0 || exitCode === undefined) return;
  const setup = handleCancel(
    await confirm({
      message:
        "That command reported an error. Run gt init to set up this repo?",
      initialValue: false,
    }),
  );
  if (setup) await runGt(["init"], { cwd, inheritStdio: true });
}

const stepsSchema = z.coerce.number().int().positive().max(99);

async function interactiveStackHub(cwd: string): Promise<void> {
  while (true) {
    const branch = captureGitBranch(cwd);
    intro(pc.bold("My stack — view & move"));
    if (branch) console.log(pc.dim(`Current branch: ${pc.cyan(branch)}`));

    const choice = handleCancel(
      await select({
        message: "Choose an action",
        options: [
          {
            value: "log",
            label: "Show my stack (detailed)",
            hint: "gt log",
          },
          {
            value: "logShort",
            label: "Show my stack (compact)",
            hint: "gt log short",
          },
          {
            value: "logLong",
            label: "Show commit graph",
            hint: "gt log long",
          },
          {
            value: "down",
            label: "Move toward main (parent branch)",
            hint: "gt down",
          },
          {
            value: "up",
            label: "Move toward tip (child branch)",
            hint: "gt up",
          },
          {
            value: "bottom",
            label: "Jump to bottom of stack",
            hint: "gt bottom",
          },
          { value: "top", label: "Jump to top of stack", hint: "gt top" },
          {
            value: "checkout",
            label: "Pick a branch to switch to…",
            hint: "gt checkout",
          },
          { value: "upN", label: "Move up N steps…", hint: "gt up N" },
          { value: "downN", label: "Move down N steps…", hint: "gt down N" },
          { value: "parent", label: "Show parent branch", hint: "gt parent" },
          {
            value: "children",
            label: "Show child branches",
            hint: "gt children",
          },
          { value: "trunk", label: "Show trunk branch", hint: "gt trunk" },
          BACK,
          EXIT,
        ],
      }),
    );

    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }

    if (choice === "log") {
      const r = await runGt(["log"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "logShort") {
      const r = await runGt(["log", "short"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "logLong") {
      const r = await runGt(["log", "long"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "down") {
      const r = await runGt(["down"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "up") {
      const r = await runGt(["up"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "bottom") {
      const r = await runGt(["bottom"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "top") {
      const r = await runGt(["top"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "checkout") {
      const name = handleCancel(
        await text({
          message: "Branch name (leave empty for interactive picker)",
          placeholder: "feature/foo or empty",
        }),
      );
      const args =
        name.trim().length > 0 ? ["checkout", name.trim()] : ["checkout"];
      const r = await runGt(args, { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "upN" || choice === "downN") {
      const raw = handleCancel(
        await text({
          message: "How many steps?",
          placeholder: "1",
          validate: (v) => {
            const n = Number(v);
            if (!Number.isFinite(n)) return "Enter a number";
            const p = stepsSchema.safeParse(n);
            return p.success ? undefined : "Enter a positive integer (1–99)";
          },
        }),
      );
      const n = stepsSchema.parse(Number(raw));
      const cmd = choice === "upN" ? "up" : "down";
      const r = await runGt([cmd, String(n)], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "parent") {
      const r = await runGt(["parent"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "children") {
      const r = await runGt(["children"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
    if (choice === "trunk") {
      const r = await runGt(["trunk"], { cwd, inheritStdio: true });
      await maybeSuggestInit(cwd, r.exitCode);
      continue;
    }
  }
}

function showHelpTopic(): void {
  console.log(
    [
      pc.bold("\nWhat is Graphite?"),
      "",
      "Graphite helps you work with a stack of branches — each branch can become its own pull request, stacked on top of each other.",
      "",
      pc.bold("Terms:"),
      "  • Trunk — the main branch you merge into (e.g. main).",
      "  • Downstack — branches closer to trunk (ancestors).",
      "  • Upstack — branches further from trunk (descendants).",
      "",
      pc.dim("Cheatsheet: https://graphite.dev/docs/cheatsheet"),
      pc.dim("Full reference: https://graphite.dev/docs/command-reference"),
      "",
    ].join("\n"),
  );
}

async function interactiveStartHere(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Start here",
        options: [
          {
            value: "init",
            label: "Set up this repo (gt init)",
            hint: "choose trunk",
          },
          {
            value: "auth",
            label: "Authenticate for PRs (gt auth)",
            hint: "token",
          },
          { value: "checkout", label: "Switch branch", hint: "gt checkout" },
          { value: "dash", label: "Open Graphite dashboard", hint: "gt dash" },
          { value: "docs", label: "Open CLI docs", hint: "gt docs" },
          { value: "demo", label: "Interactive tutorial (gt demo)", hint: "" },
          {
            value: "guide",
            label: "Read workflow guide",
            hint: "gt guide workflow",
          },
          {
            value: "upgrade",
            label: "Upgrade Graphite CLI",
            hint: "gt upgrade",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "init") {
      await runGt(["init"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "auth") {
      const token = handleCancel(
        await password({
          message:
            "Paste Graphite token (or leave empty to run gt auth interactively)",
        }),
      );
      if (token.trim().length > 0) {
        await runGt(["auth", "--token", token.trim()], {
          cwd,
          inheritStdio: true,
        });
      } else {
        await runGt(["auth"], { cwd, inheritStdio: true });
      }
      continue;
    }
    if (choice === "checkout") {
      const name = handleCancel(
        await text({
          message: "Branch name (empty for picker)",
          placeholder: "",
        }),
      );
      const args =
        name.trim().length > 0 ? ["checkout", name.trim()] : ["checkout"];
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "dash") {
      await runGt(["dash"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "docs") {
      await runGt(["docs"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "demo") {
      const d = handleCancel(
        await text({
          message: "Demo name (stack, pull-request) or empty for menu",
          placeholder: "",
        }),
      );
      const args = d.trim().length > 0 ? ["demo", d.trim()] : ["demo"];
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "guide") {
      await runGt(["guide", "workflow"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "upgrade") {
      await runGt(["upgrade"], { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveViewInspect(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "View & inspect",
        options: [
          { value: "info", label: "Branch / PR info", hint: "gt info" },
          { value: "pr", label: "Open PR in browser", hint: "gt pr" },
          {
            value: "prStack",
            label: "Open stack in browser",
            hint: "gt pr --stack",
          },
          {
            value: "logShort",
            label: "Stack list (short)",
            hint: "gt log short",
          },
          { value: "log", label: "Stack list (detailed)", hint: "gt log" },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "log" || choice === "logShort") {
      await runGt(choice === "logShort" ? ["log", "short"] : ["log"], {
        cwd,
        inheritStdio: true,
      });
      continue;
    }
    if (choice === "info") {
      const b = handleCancel(
        await text({ message: "Branch (empty = current)", placeholder: "" }),
      );
      const flags = handleCancel(
        await select({
          message: "Detail",
          options: [
            { value: "", label: "Default", hint: "" },
            { value: "stat", label: "Diff stat", hint: "--stat" },
            { value: "patch", label: "Patch per commit", hint: "--patch" },
            { value: "diff", label: "Full diff vs parent", hint: "--diff" },
            BACK,
          ],
        }),
      );
      if (flags === "__back") continue;
      const args = ["info"];
      if (b.trim()) args.push(b.trim());
      if (flags === "stat") args.push("--stat");
      if (flags === "patch") args.push("--patch");
      if (flags === "diff") args.push("--diff");
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "pr") {
      const b = handleCancel(
        await text({
          message: "Branch or PR # (empty = current)",
          placeholder: "",
        }),
      );
      const args = ["pr"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "prStack") {
      await runGt(["pr", "--stack"], { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveCreateCommit(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Create & commit",
        options: [
          {
            value: "create",
            label: "Create new stacked branch",
            hint: "gt create",
          },
          {
            value: "modify",
            label: "Amend or add commit on current branch",
            hint: "gt modify",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "create") {
      const name = handleCancel(
        await text({ message: "Branch name (optional)", placeholder: "" }),
      );
      const message = handleCancel(
        await text({ message: "Commit message (optional)", placeholder: "" }),
      );
      const all = handleCancel(
        await confirm({
          message: "Stage all changes (-a)?",
          initialValue: false,
        }),
      );
      const insert = handleCancel(
        await confirm({
          message: "Insert between current and child (-i)?",
          initialValue: false,
        }),
      );
      const ai = handleCancel(
        await confirm({
          message: "Use AI for name/message (--ai)?",
          initialValue: false,
        }),
      );
      const args = ["create"];
      if (name.trim()) args.push(name.trim());
      if (all) args.push("--all");
      if (insert) args.push("--insert");
      if (ai) args.push("--ai");
      if (message.trim()) args.push("--message", message.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "modify") {
      const mode = handleCancel(
        await select({
          message: "Modify mode",
          options: [
            {
              value: "amend",
              label: "Amend current commit (default)",
              hint: "",
            },
            { value: "commit", label: "Create new commit", hint: "--commit" },
            {
              value: "into",
              label: "Amend into downstack branch",
              hint: "--into",
            },
            BACK,
          ],
        }),
      );
      if (mode === "__back") continue;
      const message = handleCancel(
        await text({ message: "Commit message (optional)", placeholder: "" }),
      );
      const all = handleCancel(
        await confirm({ message: "Stage all (-a)?", initialValue: false }),
      );
      const args = ["modify"];
      if (mode === "commit") args.push("--commit");
      if (mode === "into") args.push("--into");
      if (all) args.push("--all");
      if (message.trim()) args.push("--message", message.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveSyncSubmit(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Sync & submit",
        options: [
          { value: "sync", label: "Sync trunk & restack (gt sync)", hint: "" },
          {
            value: "submit",
            label: "Submit current stack (gt submit)",
            hint: "",
          },
          {
            value: "submitStack",
            label: "Submit full stack (gt submit --stack)",
            hint: "ss",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "sync") {
      const all = handleCancel(
        await confirm({
          message: "Sync all trunks (--all)?",
          initialValue: false,
        }),
      );
      const force = handleCancel(
        await confirm({
          message: "Force without confirmations (-f)?",
          initialValue: false,
        }),
      );
      const noRestack = handleCancel(
        await confirm({
          message: "Skip restack (--no-restack)?",
          initialValue: false,
        }),
      );
      const args = ["sync"];
      if (all) args.push("--all");
      if (force) args.push("--force");
      if (noRestack) args.push("--no-restack");
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "submit" || choice === "submitStack") {
      const stack = choice === "submitStack";
      const draft = handleCancel(
        await confirm({
          message: "Create as draft (-d)?",
          initialValue: false,
        }),
      );
      const dryRun = handleCancel(
        await confirm({ message: "Dry run only?", initialValue: false }),
      );
      const confirmSubmit = handleCancel(
        await confirm({
          message: "Confirm before push (-c)?",
          initialValue: false,
        }),
      );
      const updateOnly = handleCancel(
        await confirm({
          message: "Update existing PRs only (--update-only)?",
          initialValue: false,
        }),
      );
      const view = handleCancel(
        await confirm({
          message: "Open browser after (-v)?",
          initialValue: false,
        }),
      );
      const args = ["submit"];
      if (stack) args.push("--stack");
      if (draft) args.push("--draft");
      if (dryRun) args.push("--dry-run");
      if (confirmSubmit) args.push("--confirm");
      if (updateOnly) args.push("--update-only");
      if (view) args.push("--view");
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveNavigate(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Navigate",
        options: [
          { value: "checkout", label: "Checkout branch", hint: "gt checkout" },
          { value: "up", label: "Upstack one", hint: "gt up" },
          { value: "down", label: "Downstack one", hint: "gt down" },
          { value: "top", label: "Top of stack", hint: "gt top" },
          { value: "bottom", label: "Bottom of stack", hint: "gt bottom" },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "checkout") {
      const name = handleCancel(
        await text({ message: "Branch (empty for picker)", placeholder: "" }),
      );
      const args =
        name.trim().length > 0 ? ["checkout", name.trim()] : ["checkout"];
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    const cmd = choice;
    await runGt([cmd], { cwd, inheritStdio: true });
    continue;
  }
}

async function interactiveRestack(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Restack & recovery",
        options: [
          { value: "restack", label: "Restack stack", hint: "gt restack" },
          {
            value: "restackOnly",
            label: "Restack only this branch",
            hint: "--only",
          },
          { value: "restackUp", label: "Restack upstack", hint: "--upstack" },
          {
            value: "restackDown",
            label: "Restack downstack",
            hint: "--downstack",
          },
          {
            value: "continue",
            label: "Continue after conflict",
            hint: "gt continue",
          },
          { value: "abort", label: "Abort conflict", hint: "gt abort" },
          {
            value: "undo",
            label: "Undo last Graphite mutation",
            hint: "gt undo",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "restack") {
      await runGt(["restack"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "restackOnly") {
      await runGt(["restack", "--only"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "restackUp") {
      await runGt(["restack", "--upstack"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "restackDown") {
      await runGt(["restack", "--downstack"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "continue") {
      await runGt(["continue"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "abort") {
      await runGt(["abort"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "undo") {
      await runGt(["undo"], { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveReorder(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Reorder & edit stack",
        options: [
          {
            value: "move",
            label: "Move current branch onto another",
            hint: "gt move",
          },
          {
            value: "reorder",
            label: "Reorder branches (editor)",
            hint: "gt reorder",
          },
          { value: "fold", label: "Fold into parent", hint: "gt fold" },
          { value: "pop", label: "Pop branch (keep changes)", hint: "gt pop" },
          {
            value: "squash",
            label: "Squash commits on branch",
            hint: "gt squash",
          },
          {
            value: "absorb",
            label: "Absorb staged into downstack commits",
            hint: "gt absorb",
          },
          {
            value: "splitCommit",
            label: "Split branch — by commit",
            hint: "gt split --by-commit",
          },
          {
            value: "splitHunk",
            label: "Split branch — by hunk",
            hint: "gt split --by-hunk",
          },
          {
            value: "splitFile",
            label: "Split branch — by file pattern",
            hint: "gt split --by-file",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "move") {
      await runGt(["move"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "reorder") {
      await runGt(["reorder"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "fold") {
      await runGt(["fold"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "pop") {
      await runGt(["pop"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "squash") {
      const message = handleCancel(
        await text({ message: "New message (-m), optional", placeholder: "" }),
      );
      const args = ["squash"];
      if (message.trim()) args.push("--message", message.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "absorb") {
      const all = handleCancel(
        await confirm({ message: "Stage all (-a)?", initialValue: false }),
      );
      const args = ["absorb"];
      if (all) args.push("--all");
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "splitCommit") {
      await runGt(["split", "--by-commit"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "splitHunk") {
      await runGt(["split", "--by-hunk"], { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "splitFile") {
      const pattern = handleCancel(
        await text({ message: "File path / glob", placeholder: "src/**/*.ts" }),
      );
      await runGt(["split", "--by-file", pattern.trim()], {
        cwd,
        inheritStdio: true,
      });
      continue;
    }
  }
}

async function interactiveBranchLifecycle(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Branch tracking & cleanup",
        options: [
          {
            value: "track",
            label: "Track branch with Graphite",
            hint: "gt track",
          },
          {
            value: "untrack",
            label: "Stop tracking branch",
            hint: "gt untrack",
          },
          {
            value: "delete",
            label: "Delete branch (local)",
            hint: "gt delete",
          },
          { value: "rename", label: "Rename branch", hint: "gt rename" },
          {
            value: "unlink",
            label: "Unlink PR from branch",
            hint: "gt unlink",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "track") {
      const b = handleCancel(
        await text({ message: "Branch (empty = current)", placeholder: "" }),
      );
      const args = ["track"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "untrack") {
      const b = handleCancel(
        await text({ message: "Branch (empty = current)", placeholder: "" }),
      );
      const args = ["untrack"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "delete") {
      const b = handleCancel(
        await text({ message: "Branch (empty = picker)", placeholder: "" }),
      );
      const close = handleCancel(
        await confirm({
          message: "Close PRs on GitHub (-c)?",
          initialValue: false,
        }),
      );
      const force = handleCancel(
        await confirm({
          message: "Force delete (--force)?",
          initialValue: false,
        }),
      );
      const args = ["delete"];
      if (b.trim()) args.push(b.trim());
      if (close) args.push("--close");
      if (force) args.push("--force");
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "rename") {
      const name = handleCancel(
        await text({ message: "New branch name", placeholder: "" }),
      );
      const args = ["rename"];
      if (name.trim()) args.push(name.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "unlink") {
      const b = handleCancel(
        await text({ message: "Branch (empty = current)", placeholder: "" }),
      );
      const args = ["unlink"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveCollaborate(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Collaborate",
        options: [
          {
            value: "get",
            label: "Get teammate stack / sync remote",
            hint: "gt get",
          },
          { value: "freeze", label: "Freeze branch(es)", hint: "gt freeze" },
          {
            value: "unfreeze",
            label: "Unfreeze branch(es)",
            hint: "gt unfreeze",
          },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "get") {
      const b = handleCancel(
        await text({ message: "Branch or PR # (optional)", placeholder: "" }),
      );
      const args = ["get"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "freeze") {
      const b = handleCancel(
        await text({ message: "Branch (optional)", placeholder: "" }),
      );
      const args = ["freeze"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "unfreeze") {
      const b = handleCancel(
        await text({ message: "Branch (optional)", placeholder: "" }),
      );
      const args = ["unfreeze"];
      if (b.trim()) args.push(b.trim());
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveMerge(cwd: string): Promise<void> {
  while (true) {
    const choice = handleCancel(
      await select({
        message: "Merge (Graphite)",
        options: [
          { value: "merge", label: "Merge stack PRs", hint: "gt merge" },
          { value: "mergeDry", label: "Dry run", hint: "--dry-run" },
          BACK,
          EXIT,
        ],
      }),
    );
    if (choice === "__back") return;
    if (choice === "__exit") {
      outro("Bye");
      process.exit(0);
    }
    if (choice === "merge") {
      const confirmMerge = handleCancel(
        await confirm({
          message: "Confirm before merge (-c)?",
          initialValue: true,
        }),
      );
      const args = ["merge"];
      if (confirmMerge) args.push("--confirm");
      await runGt(args, { cwd, inheritStdio: true });
      continue;
    }
    if (choice === "mergeDry") {
      await runGt(["merge", "--dry-run"], { cwd, inheritStdio: true });
      continue;
    }
  }
}

async function interactiveRaw(cwd: string): Promise<void> {
  const line = handleCancel(
    await text({
      message: "Extra gt arguments (as you would type after gt)",
      placeholder: "submit --stack",
    }),
  );
  const parts = line
    .trim()
    .split(/\s+/)
    .filter((s) => s.length > 0);
  if (parts.length === 0) return;
  await runGt(parts, { cwd, inheritStdio: true });
}

export async function runInteractiveMenu(
  cwdFromCli: string | undefined,
): Promise<void> {
  const cwd = resolveAndValidateCwd(cwdFromCli);
  preflightGt(cwd, resolveGtBinary());

  while (true) {
    intro(pc.bold(`${CLI_CMD} — interactive Graphite`));
    const branch = captureGitBranch(cwd);
    if (branch) console.log(pc.dim(`On branch ${pc.cyan(branch)}\n`));

    const top = handleCancel(
      await select({
        message: "What do you want to do?",
        options: [
          {
            value: "stack",
            label: "My stack — view & move",
            hint: "log, navigate up/down, checkout",
          },
          {
            value: "start",
            label: "Start here",
            hint: "init, auth, demo, docs",
          },
          {
            value: "view",
            label: "View & inspect",
            hint: "info, PR links, log",
          },
          {
            value: "create",
            label: "Create & commit",
            hint: "create, modify",
          },
          {
            value: "sync",
            label: "Sync & submit",
            hint: "sync, submit",
          },
          {
            value: "nav",
            label: "Navigate",
            hint: "checkout, up, down",
          },
          {
            value: "restack",
            label: "Restack & recovery",
            hint: "restack, continue, undo",
          },
          {
            value: "reorder",
            label: "Reorder & edit stack",
            hint: "move, split, squash",
          },
          {
            value: "lifecycle",
            label: "Branch tracking & cleanup",
            hint: "track, delete, rename",
          },
          {
            value: "collab",
            label: "Collaborate",
            hint: "get, freeze",
          },
          {
            value: "merge",
            label: "Merge stack PRs",
            hint: "gt merge",
          },
          {
            value: "help",
            label: "Help — what is Graphite?",
            hint: "",
          },
          {
            value: "doctor",
            label: "Environment check (doctor)",
            hint: "Node, git, gt",
          },
          {
            value: "raw",
            label: "Run raw gt arguments…",
            hint: "advanced",
          },
          EXIT,
        ],
      }),
    );

    if (top === "__exit") {
      outro("Bye");
      process.exit(0);
    }

    if (top === "stack") await interactiveStackHub(cwd);
    else if (top === "start") await interactiveStartHere(cwd);
    else if (top === "view") await interactiveViewInspect(cwd);
    else if (top === "create") await interactiveCreateCommit(cwd);
    else if (top === "sync") await interactiveSyncSubmit(cwd);
    else if (top === "nav") await interactiveNavigate(cwd);
    else if (top === "restack") await interactiveRestack(cwd);
    else if (top === "reorder") await interactiveReorder(cwd);
    else if (top === "lifecycle") await interactiveBranchLifecycle(cwd);
    else if (top === "collab") await interactiveCollaborate(cwd);
    else if (top === "merge") await interactiveMerge(cwd);
    else if (top === "help") {
      showHelpTopic();
    } else if (top === "doctor") {
      const { runDoctor } = await import("./doctor.js");
      runDoctor(cwd);
    } else if (top === "raw") await interactiveRaw(cwd);
  }
}
