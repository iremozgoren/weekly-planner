import { promises as fs, existsSync, renameSync } from 'node:fs'

/**
 * Reads and parses a JSON file. Returns `null` if the file doesn't exist yet
 * (first run). A malformed file throws (SyntaxError) — callers decide how to
 * recover (see `backupCorruptFile`), rather than this silently returning null
 * for a file that actually exists but is broken.
 */
export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  let raw: string
  try {
    raw = await fs.readFile(filePath, 'utf-8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
  return JSON.parse(raw) as T
}

/**
 * Writes JSON atomically: serialize -> write `<file>.tmp` -> rename over the
 * target. A crash mid-write can never leave a truncated/corrupt target file.
 */
export async function writeJsonFileAtomic(filePath: string, data: unknown): Promise<void> {
  const tmpPath = `${filePath}.tmp`
  await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmpPath, filePath)
}

/**
 * Moves an unreadable/corrupt file aside so it isn't lost, before the caller
 * replaces it with defaults. Losing data silently is worse than an obvious
 * reset with a recoverable backup next to it.
 */
export function backupCorruptFile(filePath: string): void {
  if (!existsSync(filePath)) return
  renameSync(filePath, `${filePath}.corrupt-${Date.now()}`)
}
