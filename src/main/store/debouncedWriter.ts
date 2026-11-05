/**
 * Coalesces rapid-fire writes (e.g. dragging a task across several days) into
 * one disk write after `delayMs` of quiet, while still letting the caller
 * force an immediate write-and-wait (used on `before-quit`). Shared by every
 * file-backed store so the debounce/flush logic isn't duplicated per store.
 */
export function createDebouncedWriter<T>(persist: (data: T) => Promise<void>, delayMs = 300) {
  let timer: NodeJS.Timeout | null = null
  let latest: T | null = null
  let inFlight: Promise<void> = Promise.resolve()

  function flushNow(): void {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (latest === null) return
    const data = latest
    latest = null
    inFlight = persist(data).catch((error: unknown) => {
      console.error('[store] failed to persist data:', error)
    })
  }

  function writeDebounced(data: T): void {
    latest = data
    if (timer) clearTimeout(timer)
    timer = setTimeout(flushNow, delayMs)
  }

  async function flush(): Promise<void> {
    flushNow()
    await inFlight
  }

  return { writeDebounced, flush }
}
