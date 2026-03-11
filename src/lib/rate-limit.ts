const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS = 3

const store = new Map<string, { count: number; resetAt: number }>()

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= MAX_REQUESTS) return true

  entry.count++
  return false
}
