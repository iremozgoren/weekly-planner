# CLAUDE.md

Guidance for Claude Code when working in this repository.

## 1. Project overview

**Weekly Planner** is a cross-platform (macOS + Windows) desktop app for planning a week
at a glance. It is fully offline: all data lives in local JSON files inside Electron's
`userData` directory. There is no server, no account, no network call.

The app ships **two windows**:

| Window            | Purpose                                                                                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Main window**   | Monday–Sunday 7-column weekly board. Create/edit/delete tasks, mark them done, drag them between days, tag them with color labels, navigate between weeks.      |
| **Widget window** | Small, frameless, transparent, always-on-top panel pinned to a screen corner. Shows today's tasks and completion progress. Always in sync with the main window. |

Plus a **system tray icon** (toggle widget / open main window / quit) and a
**launch-at-login** toggle in settings.

## 2. Tech stack

- **Electron** — desktop shell (main + preload + renderer processes)
- **electron-vite** — unified Vite build for all three process targets, with HMR in dev
- **React** + **TypeScript** (strict) — renderer UI
- **Zustand** — renderer state container, hydrated from and synced to the main process
- **@dnd-kit** — drag-and-drop of tasks between days and reordering within a day
- **date-fns** — week math (`weekStartsOn: 1`), formatting via locale objects
- **electron-builder** — `.dmg` (macOS) and `.exe` NSIS installer (Windows)
- Plain **CSS with custom properties** — no CSS framework, no CSS-in-JS runtime

Keep the dependency list small. Prefer a ~40-line local helper over a new package;
if a package is genuinely the right call, say why in the PR/commit body.

## 3. Conventions

### Language

**Everything in the repository is in English** — code, identifiers, file and folder names,
comments, commit messages, docs, JSDoc, test names, log output. No exceptions.

### Code style

- TypeScript strict mode; **no `any`**, no non-null `!` assertions outside guarded blocks.
- Named exports only, except React page/route components and Vite entry modules.
- `camelCase.ts` for modules, `PascalCase.tsx` for React components, `kebab-case` for
  folders and non-code assets.
- One React component per file; colocate its `.css` next to it.
- Functional components with hooks. No class components.
- Prefer `type` over `interface` unless declaration merging is needed.
- Discriminated unions over boolean flag soup.
- Comments explain **why**, never **what**. Match the density of surrounding code.

### Commits

Conventional Commits, imperative mood, English:
`feat(week): drag tasks between days`, `fix(widget): keep panel on top after display change`.
Scopes mirror the source layout: `main`, `preload`, `shared`, `renderer`, `week`, `tasks`,
`widget`, `tray`, `settings`, `i18n`, `build`.

## 4. Architecture

### Process boundaries (non-negotiable)

```
┌─────────────────────────── main process ───────────────────────────┐
│ app lifecycle · windows · tray · login item · native theme        │
│ JSON persistence (the ONLY place that touches the filesystem)     │
└───────────────▲─────────────────────────────┬─────────────────────┘
                │ ipcMain.handle (commands)   │ webContents.send (broadcast)
                │                             ▼
┌───────────────┴──────────── preload (contextBridge) ──────────────┐
│ exposes a single typed, allow-listed `window.api` surface          │
└───────────────▲────────────────────────────────────────────────────┘
                │
┌───────────────┴─────────── renderer (React) ──────────────────────┐
│ main window (index.html) · widget window (widget.html)            │
│ Zustand stores · no Node APIs · no fs · no direct ipcRenderer     │
└────────────────────────────────────────────────────────────────────┘
```

Hard rules:

- `nodeIntegration: false`, `contextIsolation: true`, `sandbox: true` on **every** window.
- The renderer never imports from `src/main/**`. It may import from `src/shared/**` only
  (types, IPC channel names, pure date/label helpers — no Node built-ins there).
- Every IPC channel name lives in `src/shared/ipc-channels.ts`. No string literals at
  call sites, on either side.
- The preload script exposes methods, never raw `ipcRenderer`.

### Data flow: main process is the single source of truth

1. A renderer action calls `window.api.tasks.create(input)`.
2. Main validates, mutates its in-memory state, and schedules a debounced atomic write.
3. Main broadcasts the new state to **all** open windows (`tasks:changed`).
4. Every renderer's Zustand store replaces its slice from that broadcast.

This is what keeps the widget and main window in sync — the widget is not special-cased,
it just subscribes to the same broadcast. **Never** let a renderer be the authority for
persisted state, and never write to a window's store without a round trip through main.

### Persistence

Two files in `app.getPath('userData')`:

- `planner.json` — `{ version, tasks, labels }`
- `settings.json` — `{ version, theme, locale, launchAtLogin, widget: { visible, corner, offset } }`

Rules:

- Every file carries a `version` integer. Reads run through a migration chain
  (`migrations/` keyed by source version) so old installs upgrade cleanly.
- Writes are **atomic**: serialize → write `<file>.tmp` → `fs.rename` over the target.
  A crash mid-write must never leave truncated JSON.
- Writes are debounced (~300 ms) and flushed synchronously on `before-quit`.
- A corrupt or unreadable file is backed up to `<file>.corrupt-<timestamp>` and replaced
  with defaults. Losing a week of tasks silently is worse than an obvious reset.

### Task model

Tasks are keyed by **ISO date string** (`dayKey: "2026-11-05"`), not by week + weekday index.
Week navigation and cross-day drags then reduce to changing `dayKey`, and no data has to be
rewritten when the user moves between weeks. `order` is a float within a day so a drop
between two cards is a midpoint computation, not a reindex of the column.

### i18n

UI language is English, but **no user-facing string may be hardcoded in a component**.

- `src/renderer/src/i18n/locales/en.ts` is the source of truth and defines the `TranslationKey`
  type; every other locale must satisfy the same shape, so a missing key is a type error.
- Components read strings via `const { t } = useTranslation()` → `t('week.addTask')`.
- Flat namespaced keys (`week.*`, `task.*`, `widget.*`, `settings.*`, `tray.*`, `common.*`),
  mirroring i18next's key convention so migrating to i18next later is mechanical.
- Dates and numbers go through `Intl` / date-fns locale objects — never manual formatting.
  Plurals go through `Intl.PluralRules`, never `n === 1 ? 'task' : 'tasks'` inline.
- Tray and native menu labels are built in the main process from the same locale modules.

Adding Turkish or German must mean: add `locales/tr.ts`, register it, done.

### Theming and styling

- Design tokens as CSS custom properties in `styles/tokens.css`; light/dark values keyed off
  `[data-theme='light'|'dark']` on `<html>`.
- Theme setting is `'light' | 'dark' | 'system'`; `'system'` follows Electron's `nativeTheme`
  and reacts to `nativeTheme.on('updated')`.
- Visual direction: clean and modern, generous whitespace, soft pastel label accents,
  subtle borders over heavy shadows. Label colors are defined once in `src/shared/labels.ts`
  and must stay legible with foreground text in **both** themes.
- The widget's root element is transparent; only its inner card paints a background.
  Keep `-webkit-app-region: drag` on the widget's grab area and `no-drag` on its controls.

## 5. Platform specifics

- **macOS**: tray icon must be a `Template`-suffixed PNG (`trayTemplate.png` + `@2x`) so it
  inverts with the menu bar. Closing the main window hides it; the app stays alive in the
  tray. Widget uses `visibleOnAllWorkspaces` and must not appear in Mission Control's
  window list (`skipTaskbar` + `type: 'panel'` where available).
- **Windows**: tray needs a `.ico`; the taskbar entry is suppressed for the widget via
  `skipTaskbar: true`. NSIS installer is per-user (`perMachine: false`) so no UAC prompt.
- Launch at login uses `app.setLoginItemSettings` on both platforms. Read it back with
  `app.getLoginItemSettings()` rather than trusting the stored setting — the user can
  revoke it from the OS.
- Never hardcode path separators; always `path.join`.
- Widget corner pinning computes from `screen.getDisplayNearestPoint(...).workArea`, not
  `bounds`, so it respects the menu bar and taskbar. Re-pin on `display-metrics-changed`.

## 6. Commands

```bash
npm run dev            # electron-vite dev, HMR for both renderer windows
npm run typecheck      # tsc --noEmit for node + web tsconfigs
npm run lint           # eslint
npm run format         # prettier --write
npm run build          # typecheck + electron-vite build
npm run build:mac      # .dmg  (must run on macOS)
npm run build:win      # .exe  NSIS (must run on Windows, or Wine/CI)
```

`npm run build:mac` and `build:win` are not cross-compilable from each other in practice —
when the user asks for "both installers", say that Windows output needs a Windows machine
or CI runner.

## 7. Working agreements

- The user builds and tests **step by step**. Finish one coherent slice, state exactly what
  to run and what to look for, then stop. Do not run ahead into the next step.
- Verify with `npm run typecheck` and `npm run lint` before handing a step back.
- Do not commit unless asked.
- When something can't be verified locally (a Windows installer, a signed build), say so
  plainly instead of implying it was tested.
