/**
 * Represents the type of show: either a movie or a series.
 */
export type ShowKind = "movie" | "series"

/**
 * Represents a basic search result for a show.
 */
export type SearchShow = {
  /** Unique identifier for the show. */
  id: string

  /** The type of show (movie or series). */
  kind: ShowKind

  /** Title of the show. */
  title: string

  /** Optional URL of the poster image. */
  posterURL?: string
}

/**
 * Represents detailed information about a show.
 */
export type Show = SearchShow & {
  /** Optional URL of the backdrop image. */
  backdropURL?: string

  /** Overview or synopsis of the show. */
  overview: string

  /** Duration of the show in seconds. */
  durationInSeconds: number

  /** List of genres associated with the show. */
  genres: string[]

  /** Optional range of seasons. Omit if Show is a movie.*/
  seasons?: {
    /** First season number. */
    first: number

    /** Last season number. */
    last: number
  }
}

/**
 * Represents an episode of a show.
 */
export type ShowEpisode = {
  /** Unique identifier for the episode. */
  id: string

  /** Episode number. */
  number: number

  /** Optional title of the episode. */
  title?: string

  /** Optional URL of the thumbnail image. */
  thumbnailURL?: string

  /** Optional overview of the episode. */
  overview?: string

  /** Optional duration in seconds. */
  durationInSeconds?: number
}

/**
 * Represents a video source with a URL and optional headers.
 */
export type VideoSource = {
  /** URL of the video source. */
  url: string

  /** Optional headers for the request. */
  headers?: Record<string, string>
}

/**
 * Function to search for shows based on a query.
 * @param query The search query.
 * @returns A promise that resolves to an array of SearchShow objects.
 */
export type SearchFunction = (query: string) => Promise<SearchShow[]>

/**
 * Function to fetch details for a show by its ID.
 * @param id The unique identifier of the show.
 * @returns A promise that resolves to a Show object.
 */
export type FetchShowDetailsFunction = (id: string) => Promise<Show>

/**
 * Function to fetch episodes for a show and optionally a season.
 * If omitted, the `season` parameter will be ignored, and `showId` will be treated as if it's for a movie.
 * @param showId - The unique identifier of the show.
 * @param season - Optional season number.
 * @returns A promise that resolves to an array of ShowEpisode objects.
 */
export type FetchEpisodesFunction = (
  showId: string,
  season?: number
) => Promise<ShowEpisode[]>

/**
 * Function to fetch video sources for an episode by its ID.
 * @param episodeId - The unique identifier of the episode.
 * @returns A promise that resolves to an array of VideoSource objects.
 */
export type FetchVideoSourcesFunction = (
  episodeId: string
) => Promise<VideoSource[]>
