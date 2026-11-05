export function App() {
  return (
    <div className="app-shell">
      <h1>Weekly Planner</h1>
      <p>Step 1 scaffold is wired up — main, preload and renderer are talking.</p>
      <p className="app-shell__meta">
        Electron {window.api.versions.electron} · Chrome {window.api.versions.chrome} · Node{' '}
        {window.api.versions.node}
      </p>
    </div>
  )
}
