/** Extract --cwd / -C from argv; remaining tokens are returned in order. */
export function extractCwd(argv: string[]): { cwd?: string; rest: string[] } {
  const rest: string[] = [];
  let cwd: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === undefined) continue;
    if ((a === "--cwd" || a === "-C") && argv[i + 1]) {
      cwd = argv[i + 1];
      i++;
      continue;
    }
    if (a.startsWith("--cwd=")) {
      cwd = a.slice("--cwd=".length);
      continue;
    }
    rest.push(a);
  }
  return { cwd, rest };
}
