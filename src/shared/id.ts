export const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  // Fallback: sufficiently unique for client-only demo data
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

