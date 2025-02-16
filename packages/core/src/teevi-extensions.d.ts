/**
 * Represents the kind of show: either a movie or a series.
 * @type {"movie" | "series"}
 */
export type TeeviShowKind = "movie" | "series"

/**
 * Represents a lightweight entry for a show, typically used in search results, recommendations, or listings.
 */
export type TeeviShowEntry = {
  /** The type of show (movie or series). */
  kind: TeeviShowKind

  /** Unique identifier for the search result. */
  id: string

  /** Title of the show. */
  title: string

  /** Optional URL of the poster image. */
  posterURL?: string
}

/**
 * Represents detailed information about a show.
 */
export type TeeviShow = {
  /** The type of show (movie or series). */
  kind: TeeviShowKind

  /** Unique identifier for the show. */
  id: string

  /** Title of the show. */
  title: string

  /** Optional URL of the poster image. */
  posterURL?: string

  /** Optional URL of the backdrop image. */
  backdropURL?: string

  /** Overview or synopsis of the show. */
  overview: string

  /** Release date of the show in ISO format. */
  releaseDate: string

  /** Duration of the show in seconds. */
  duration: number

  /** List of genres associated with the show. */
  genres: string[]

  /** Optional range of seasons. Only present for series. */
  seasonNumbers?: number[]
}

/**
 * Represents an individual media item, either a movie or an episode.
 */
export type TeeviMediaItem =
  | {
      /** Indicates this is a movie type. */
      type: "movie"
      /** Unique identifier for the movie. */
      id: string
    }
  | {
      /** Indicates this is an episode type. */
      type: "episode"
      /** Unique identifier for the episode. */
      id: string
      /** Episode number in the season. */
      number: number
      /** Optional episode title. */
      title?: string
      /** Optional URL of the episode thumbnail. */
      thumbnailURL?: string
      /** Optional episode overview or synopsis. */
      overview?: string
      /** Optional episode duration in seconds. */
      durationInSeconds?: number
    }

/**
 * Represents a video asset with a URL and optional headers.
 */
export type TeeviVideoAsset = {
  /** URL of the video asset. */
  url: string

  /** Optional HTTP headers for the video asset request. */
  headers?: Record<string, string>
}

/**
 * Represents a collection of show entries, typically used for categorized content feeds.
 */
export type TeeviFeedCollection = {
  id: string
  name: string
  shows: TeeviShowEntry[]
}

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
}

/**
 * Extends the base metadata interface with video-specific capabilities
 * for retrieving media items (such as movies or TV episodes)
 * and video assets associated with those media items.
 */
export type TeeviVideoExtension = TeeviMetadataExtension & {
  /**
   * Retrieves media items for a show, such as movies or episodes.
   * @param showId The unique identifier of the show.
   * @param season Optional season number to filter episodes.
   * @returns A promise that resolves to an array of media items.
   */
  fetchMediaItems: (
    showId: string,
    season?: number
  ) => Promise<TeeviMediaItem[]>

  /**
   * Retrieves video assets for a media item.
   * @param mediaId The unique identifier of the media item.
   * @returns A promise that resolves to an array of video assets.
   */
  fetchVideoAssets: (mediaId: string) => Promise<TeeviVideoAsset[]>
}

/**
 * Extends the base metadata interface with feed-specific capabilities.
 */
export type TeeviFeedExtension = TeeviMetadataExtension & {
  /**
   * Retrieves an array of feed collections.
   * @returns A promise that resolves to an array of feed collections.
   */
  fetchFeedCollections: () => Promise<TeeviFeedCollection[]>
}

/**
 * Represents the interface for Teevi extension functionality.
 */
export type TeeviExtension =
  | TeeviMetadataExtension
  | TeeviVideoExtension
  | TeeviFeedExtension
