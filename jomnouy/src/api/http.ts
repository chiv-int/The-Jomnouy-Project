// One place that talks to the network. Every resource file in src/api/ uses it.
// If your practice repo (week05 starter) already has src/api/http.ts, you can use that one instead.
export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(BASE_URL + path, init)
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is "npm run api" running?')
  }
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed (${response.status})`)
  }
  return (await response.json()) as T
}
