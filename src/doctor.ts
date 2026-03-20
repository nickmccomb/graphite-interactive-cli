import pc from "picocolors";
import { CLI_CMD } from "./cli-invocation.js";
import {
  captureGitBranch,
  checkGtAvailable,
  isInsideGitWorkTree,
  resolveGtBinary,
} from "./run-gt.js";

export function runDoctor(cwd: string): void {
  console.log(pc.bold(`\n${CLI_CMD} doctor — environment check\n`));

  const lines: string[] = [];
  lines.push(`Node: ${process.version}`);

  const inGit = isInsideGitWorkTree(cwd);
  lines.push(
    inGit
      ? pc.green("✓ Inside a git repository")
      : pc.yellow("✗ Not inside a git repository (cd into a repo first)"),
  );

  const branch = captureGitBranch(cwd);
  lines.push(
    branch ? `Current branch: ${pc.cyan(branch)}` : "Current branch: (unknown)",
  );

  const binary = resolveGtBinary();
  if (checkGtAvailable(cwd, binary)) {
    lines.push(pc.green(`✓ Graphite CLI is on PATH (${binary})`));
  } else {
    lines.push(pc.red(`✗ Graphite CLI not working (${binary})`));
  }

  lines.push("");
  lines.push(pc.dim("Next steps:"));
  lines.push(
    pc.dim("  • Install & auth gt: https://graphite.dev/docs/install-the-cli"),
  );
  lines.push(
    pc.dim("  • First stack: https://graphite.dev/docs/cli-quick-start"),
  );
  lines.push(
    pc.dim("  • In a repo: gt init (or use the GTR menu → Start here)"),
  );
  lines.push(
    pc.dim(
      "  • GitHub auth for PRs: https://app.graphite.com/activate → gt auth --token …",
    ),
  );
  lines.push("");

  console.log(lines.join("\n"));
}
