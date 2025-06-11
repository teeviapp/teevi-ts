import type { TeeviMetadataExtension } from "./metadata-extension"
import type { TeeviFeedCollection } from "../types/feed"
import type { TeeviShow } from "../types/shows"

/**
 * Extends the base metadata interface with feed-specific capabilities.
 */
export type TeeviFeedExtension = TeeviMetadataExtension & {
  /**
   * Retrieves an array of feed collections.
   * @returns A promise that resolves to an array of feed collections.
   */
  fetchFeedCollections: () => Promise<TeeviFeedCollection[]>

  /**
   * Retrieves an array of trending shows.
   * @deprecated Use `fetchSpotlightShows` instead.
   * @returns A promise that resolves to an array of trending shows.
   */
  fetchTrendingShows: () => Promise<TeeviShow[]>

  /**
   * Retrieves an array of spotlight shows.
   * @returns A promise that resolves to an array of spotlight shows.
   */
  fetchSpotlightShows: () => Promise<TeeviShow[]>
}
