const STORAGE_KEY = 'sasucu-frontend-test/v1'

export const loadFromStorage = <T>(fallback: T): T => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const saveToStorage = <T>(value: T): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // ignore write errors (private mode, quota, etc.)
  }
}

