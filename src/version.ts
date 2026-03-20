import { readPackageUpSync } from "read-package-up";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getPackageVersion(): string {
  const result = readPackageUpSync({ cwd: __dirname });
  const v = result?.packageJson.version;
  if (typeof v === "string" && v.length > 0) return v;
  return "0.0.0";
}
