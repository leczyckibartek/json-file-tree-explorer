# JSON File Tree Explorer

**Preview:** [json-file-tree-explorer.vercel.app](https://json-file-tree-explorer.vercel.app/)

---

## Requirements

- **Node.js** [20.19+ or 22.12+](https://nodejs.org/) — required by **Vite 8**.

## Running

```bash
npm install && npm run dev
```

```bash
npm run build        # production build
npm run preview      # preview the build
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch
npm run lint
```

---

## Routing

| Path | Behavior |
| --- | --- |
| `/` | Paste or upload JSON, validate, persist to `localStorage` |
| `/tree` | Tree view + detail panel (root selection = empty path segment) |
| `/tree/:nodePath` | Same shell; `nodePath` is `encodeURIComponent` of the path relative to the *content* root (e.g. `src%2Fcomponents%2FButton.tsx`) |

Search: `?s=…` in the URL — refresh keeps the query and results.

---

## Architectural decisions

### `expandedPaths` on `TreePage`

One `Set` in the parent; `TreeNode` only reads and calls `onToggle` — single tree state, easy “expand/collapse all”, collapsing a parent does not remove children from the set (typical file-tree behavior).

### Persistence

JSON text in **`localStorage`** (`json-file-tree-explorer:directory-json`), reload with no backend.

### Root in URL and in “full path”

The JSON root is the workspace: **the first path/URL segment is not** the root’s `"name"` — e.g. `/tree` + path `/`, file `src/...` instead of `root/src/...`. The sidebar still shows the JSON root row.

### VS Code–like UI

The UI intentionally mirrors the **workbench** (title bar, activity bar, Explorer with tree and search, content panel, status bar) and **color tokens** in the spirit of VS Code themes. For a developer tool, that gives a fast, familiar mental model instead of designing a bespoke design system from scratch.

### Other notes

1. **Validation** — `parseDirectoryTreeJsonText`: `FolderNode` or `string` (error); root is a folder, unique names among siblings, no `/` in names.
2. **`TreePage`** — one view for `/tree` and `/tree/:nodePath`; `decodeURIComponent` → details panel.
3. **Links** — paths use `/` internally; in the URL, `encodeURIComponent` after stripping a leading `/`.
4. **CSS** — global classes, files: `editor.css`, `explorer.css`, `layout.css`, `responsive.css` → `index.css`.
5. **React Compiler** — `babel-plugin-react-compiler` in `vite.config.ts`; code also uses explicit **`useMemo`** when parsing on home (cheap guard against re-parse when other state changes).
6. **Tests** — Vitest: `tests/lib/validation.test.ts`, `tests/lib/formatFileSize.test.ts`.

### DRY and extractions

Some small helpers could be hoisted and DRY polished. For this small scope I deliberately keep more logic “local” — for now it reads faster than through a layer of shared abstractions.

### Node 20 and Vite

I use **Node 20.19+ or 22.12+** (see Requirements) because this app uses **the newest Vite (8)**. **Vite 8 does not run on Node 18.** The task spec said Node 18+, but I still picked current Vite — for a new app, **keeping the stack up to date is good practice**.

---

## Beyond the minimum spec

- Search results = links to `/tree/…` with `?s=…`.
- “Load example” Button — ready-made JSON.
- Tests.

---

## With more time

- Tree editing, JSON sync, import/export.
- JSON editor (syntax, format, color), list virtualization, persisting expansions / path.
- Better search (regex, sort).
- Extract core functionality into a reusable library and expand test coverage beyond the current lib-focused suite.

---

## Known limitations

- **Expansions** — RAM only; after F5 the tree is collapsed again (`?s=` and JSON in `localStorage` remain).
- **`localStorage`** — ~5 MB, no cross-device sync; many tabs = last write wins; save errors (quota etc.) = **silent** `try/catch`, read may yield empty data.
- **`/tree`** reads `localStorage` on mount — no live sync across tabs.
- **Names** — `/` in names intentionally forbidden (URL + model).
- **Performance** — full tree scan on search (~300 ms debounce), no DOM virtualization.
- **Long URLs** — `nodePath` can hit limits in extreme cases.
- **Tests** — mostly lib, no E2E / broad UI.
- **Stack vs brief** — React **19**, Vite **8**, TS **6** `strict`, **React Compiler** (beyond brief, supported in toolchain).
