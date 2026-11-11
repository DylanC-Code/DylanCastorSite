# dylancastor_site

The source of dylancastor.com.

## Start

1. Open the folder in VS Code (from WSL: `code .`), then **Reopen in Container**.
   The container installs Bun and lefthook with mise, the git hooks, and the
   packages from `bun.lock`.
2. `bun run dev`, then open http://localhost:4321.

## Commands

| Command           | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `bun run dev`     | Dev server on port 4321                                 |
| `bun run check`   | The whole gate: format, lint, types, knip, tests, build |
| `bun run fmt`     | Formats everything                                      |
| `bun run build`   | Builds the static site into `dist/`                     |
| `bun run preview` | Serves `dist/` locally                                  |

The rules for people and agents are in `CLAUDE.md`.
