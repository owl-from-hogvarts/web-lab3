export function mergeQueryParams(initialParams: URLSearchParams, updatedParams: URLSearchParams) {
  for (const [key, value] of updatedParams) {
    initialParams.set(key, value)
  }
}
