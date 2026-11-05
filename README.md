# Weekly Planner

A cross-platform (macOS + Windows) weekly planner desktop app, built with
Electron, React, Vite and TypeScript. Fully offline — all data is stored
locally as JSON in the app's `userData` folder.

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture, conventions and
implementation plan.

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command             | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `npm run dev`       | Start the app in development mode with HMR                       |
| `npm run typecheck` | Type-check the main/preload and renderer projects                |
| `npm run lint`      | Lint the codebase                                                |
| `npm run format`    | Format the codebase with Prettier                                |
| `npm run build`     | Type-check and build for production                              |
| `npm run build:mac` | Build the macOS `.dmg` installer (run on macOS)                  |
| `npm run build:win` | Build the Windows `.exe` (NSIS) installer (run on Windows or CI) |

## Status

🚧 Work in progress — see `CLAUDE.md` for the step-by-step plan.
