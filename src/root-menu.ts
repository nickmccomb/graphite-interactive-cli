/**
 * Root interactive menu entries (display order). Kept in one place so tests can
 * guard against duplicate values and accidental removal of items.
 */
export const ROOT_MENU_OPTIONS = [
  {
    value: "stack",
    label: "My stack — view & move",
    hint: "log, navigate up/down, checkout",
  },
  {
    value: "create",
    label: "Create & commit",
    hint: "create, modify",
  },
  {
    value: "sync",
    label: "Sync & submit",
    hint: "submit, sync",
  },
  {
    value: "nav",
    label: "Navigate",
    hint: "checkout, up, down — use My stack for log + moves",
  },
  {
    value: "view",
    label: "View & inspect",
    hint: "log, info, PR links",
  },
  {
    value: "restack",
    label: "Restack & recovery",
    hint: "restack, undo, continue",
  },
  {
    value: "reorder",
    label: "Reorder & edit stack",
    hint: "move, split, squash",
  },
  {
    value: "merge",
    label: "Merge stack PRs",
    hint: "gt merge",
  },
  {
    value: "collab",
    label: "Collaborate",
    hint: "get, freeze",
  },
  {
    value: "lifecycle",
    label: "Branch tracking & cleanup",
    hint: "track, delete, rename",
  },
  {
    value: "raw",
    label: "Run raw gt arguments…",
    hint: "advanced",
  },
  {
    value: "start",
    label: "Start here",
    hint: "init, auth, doctor, docs",
  },
] as const;

export type RootMenuValue = (typeof ROOT_MENU_OPTIONS)[number]["value"];
