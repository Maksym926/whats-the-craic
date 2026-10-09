import { useCallback, useEffect, useState } from "react"

interface Result<T> {
  key: unknown
  data?: T
  error?: Error
}

/**
 * Runs `load` (wrap it in useCallback) and tracks its result.
 * Previous data is kept while reloading, so lists don't flash.
 */
export function useAsync<T>(load: () => Promise<T>) {
  const [version, setVersion] = useState(0)
  const [result, setResult] = useState<Result<T>>({ key: null })

  useEffect(() => {
    let cancelled = false
    const key = { load, version }
    load().then(
      (data) => !cancelled && setResult({ key, data }),
      (error: unknown) =>
        !cancelled && setResult((r) => ({ key, data: r.data, error: error instanceof Error ? error : new Error(String(error)) })),
    )
    return () => {
      cancelled = true
    }
  }, [load, version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])
  const key = result.key as { load: unknown; version: number } | null
  const loading = !key || key.load !== load || key.version !== version

  return { data: result.data, error: loading ? undefined : result.error, loading, reload }
}
