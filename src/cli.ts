import process from "node:process";
import isInteractive from "is-interactive";
import { defineCommand, renderUsage } from "citty";
import pc from "picocolors";
import { runDoctor } from "./doctor.js";
import { runInteractiveMenu } from "./interactive.js";
import {
  preflightGt,
  resolveAndValidateCwd,
  resolveGtBinary,
  runGt,
} from "./run-gt.js";
import { CLI_CMD } from "./cli-invocation.js";
import { extractCwd } from "./parse-argv.js";
import { getPackageVersion } from "./version.js";

const version = getPackageVersion();

const rootCommand = defineCommand({
  meta: {
    name: CLI_CMD,
    version,
    description:
      "Interactive menu for the Graphite CLI (gt). Unofficial community tool.",
  },
  args: {
    cwd: {
      type: "string",
      description: "Working directory for all gt invocations",
      alias: "C",
    },
  },
  async run(_ctx) {
    /* handled in bootstrap — citty entry for --help rendering */
  },
});

async function printUsage(): Promise<void> {
  console.log(await renderUsage(rootCommand));
  console.log(
    pc.dim(
      [
        "",
        "Examples:",
        `  ${pc.cyan(CLI_CMD)}                      Interactive menu`,
        `  ${pc.cyan(`${CLI_CMD} doctor`)}               Environment check`,
        `  ${pc.cyan(`${CLI_CMD} raw submit --stack`)}   Pass-through to gt`,
        `  ${pc.cyan(`${CLI_CMD} -- --help`)}             Show gt help`,
        "",
      ].join("\n"),
    ),
  );
}

async function bootstrap(): Promise<void> {
  const argv = process.argv.slice(2);

  if (argv[0] === "--version" || argv[0] === "-v") {
    console.log(version);
    process.exit(0);
  }

  const dd = argv.indexOf("--");
  const head = dd === -1 ? argv : argv.slice(0, dd);
  const passthrough = dd === -1 ? undefined : argv.slice(dd + 1);

  const { cwd: cwdFromFlag, rest } = extractCwd(head);

  const wantsHelp =
    rest[0] !== "raw" &&
    (rest.includes("--help") ||
      rest.includes("-h") ||
      (rest[0] === "help" && rest.length === 1));

  if (wantsHelp) {
    await printUsage();
    process.exit(0);
  }

  if (passthrough !== undefined) {
    const cwd = resolveAndValidateCwd(cwdFromFlag);
    preflightGt(cwd, resolveGtBinary());
    const { exitCode } = await runGt(passthrough, { cwd, inheritStdio: true });
    process.exit(exitCode ?? 0);
  }

  if (rest[0] === "--version" && rest.length === 1) {
    console.log(version);
    process.exit(0);
  }

  const cwd = resolveAndValidateCwd(cwdFromFlag);

  if (rest[0] === "doctor" || rest[0] === "--doctor") {
    runDoctor(cwd);
    process.exit(0);
  }

  if (rest[0] === "raw") {
    preflightGt(cwd, resolveGtBinary());
    const gtArgs = rest.slice(1);
    const { exitCode } = await runGt(gtArgs, { cwd, inheritStdio: true });
    process.exit(exitCode ?? 0);
  }

  if (rest.length > 0) {
    console.error(pc.red(`Unknown arguments: ${rest.join(" ")}`));
    console.error(pc.dim(`Try: ${CLI_CMD} --help`));
    process.exit(1);
  }

  if (!isInteractive()) {
    console.log(
      `${CLI_CMD} needs an interactive terminal for the menu. Pipe-friendly options:`,
    );
    console.log(`  ${pc.cyan(`${CLI_CMD} -- doctor`)}`);
    console.log(
      pc.dim(
        `     (same check as the menu: ${CLI_CMD} → Start here → Environment check)`,
      ),
    );
    console.log(
      `  ${pc.cyan(`${CLI_CMD} -- <gt-args>`)}   e.g. ${CLI_CMD} -- submit --stack`,
    );
    process.exit(0);
  }

  await runInteractiveMenu(cwdFromFlag);
}

/** Citty runMain handles bare \`--help\` / single \`--version\` in its own way; we use a two-phase entry. */
async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  // Delegate only help that citty expects as the sole arg
  if (argv.length === 1 && (argv[0] === "--help" || argv[0] === "-h")) {
    await printUsage();
    process.exit(0);
  }
  if (argv.length === 1 && argv[0] === "--version") {
    console.log(version);
    process.exit(0);
  }

  await bootstrap();
}

// Support running via citty for future subcommands while keeping bootstrap logic
void main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

export { rootCommand };
