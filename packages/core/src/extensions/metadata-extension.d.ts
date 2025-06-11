import type {
  TeeviShow,
  TeeviShowEntry,
  TeeviShowEpisode,
} from "../types/shows"

/**
 * Provides methods for retrieving metadata about shows.
 */
export type TeeviMetadataExtension = {
  /**
   * Searches for shows based on a query string.
   * @param query The search string to find shows.
   * @returns A promise that resolves to an array of search results.
   */
  fetchShowsByQuery: (query: string) => Promise<TeeviShowEntry[]>

  /**
   * Retrieves detailed information about a specific show.
   * @param showId The unique identifier of the show.
   * @returns A promise that resolves to a show's detailed information.
   */
  fetchShow: (showId: string) => Promise<TeeviShow>

  /**
   * Retrieves episodes for a specific show and season.
   * @param showId The unique identifier of the show.
   * @param season The season number to filter episodes.
   * @returns A promise that resolves to an array of episodes.
   */
  fetchEpisodes: (showId: string, season: number) => Promise<TeeviShowEpisode[]>
}
