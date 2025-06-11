/**
 * Represents a video asset with a URL and optional headers.
 */
export type TeeviVideoAsset = {
  /** URL of the video asset. */
  url: string

  /** Optional HTTP headers for the video asset request. */
  headers?: Record<string, string>
}
