export declare function envFetch(
  input: string,
  init?: RequestInit
): Promise<Response>

export interface RequestInit {
  /** A BodyInit object or null to set request's body. */
  body?: string | null
  /** A string indicating how the request will interact with the browser's cache to set request's cache. */
  cache?:
    | "default"
    | "force-cache"
    | "no-cache"
    | "no-store"
    | "only-if-cached"
    | "reload"
  /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
  headers?: [string, string][]
  /** A string to set request's method. */
  method?: string
}

export interface Response {
  readonly ok: boolean
  readonly status: number
  readonly url: string

  json(): Promise<any>
  text(): Promise<string>
}
