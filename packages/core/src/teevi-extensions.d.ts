/**
 * Represents the kind of show: either a movie or a series.
 * @type {"movie" | "series"}
 */
export type TeeviShowKind = "movie" | "series"

/**
 * Represents the status of a show.
 */
export type TeeviShowStatus =
  | "airing" // Actively releasing episodes
  | "ended" // Show has concluded
  | "upcoming" // Planned but not released yet
  | "canceled" // Officially canceled
  | "hiatus" // Temporarily paused but may return

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

  /** Primary language of the show in ISO 639-1 format. */
  language?: string

  /** Optional URL of the poster image. */
  posterURL?: string

  /** Optional release year of the movie or first/last air date of the series */
  year?: number
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

  /** Primary language of the show in ISO 639-1 format. */
  language?: string

  /** Optional URL of the poster image. */
  posterURL?: string

  /** Optional URL of the backdrop image. */
  backdropURL?: string

  /** Optional URL of the logo image */
  logoURL?: string

  /** Overview or synopsis of the show. */
  overview: string

  /** Release date of the show in ISO format (yyyy-MM-dd). */
  releaseDate: string

  /** Duration of the show in seconds. */
  duration: number

  /** List of genres associated with the show. */
  genres: string[]

  /** Optional list of seasons. Only present for series. */
  seasons?: TeeviShowSeason[]

  /** Optional average rating of the show. */
  rating?: number

  /** Optional status of the show. */
  status?: TeeviShowStatus

  /** Optional list of related shows. */
  relatedShows?: TeeviShowEntry[]
}

export type TeeviShowSeason = {
  /** Season number. */
  number: number

  /** Optional season title. */
  name?: string
}

/**
 * Represents an episode in a series.
 */
export type TeeviShowEpisode = {
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
  duration?: number

  /** Indicates whether the episode is considered filler (non-canonical content). */
  isFiller?: boolean
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
 * Represents a live TV channel or event.
 */
export type TeeviLiveChannel = {
  /** Unique identifier for the channel. */
  id: string

  /** Name of the channel or event. */
  name: string

  /** Type of live content. */
  type: "channel" | "event"

  /** Optional URL of the channel logo. */
  logoURL?: string

  /** Optional category of the channel (e.g., "Sports", "News", "Entertainment"). */
  category?: string

  /** Optional description of the channel or event. */
  description?: string

  /** Optional language of the channel in ISO 639-1 format. */
  language?: string

  /**
   * Indicates if the channel is geographically restricted.
   * If true, the channel may only be available in certain regions.
   */
  geoblocked?: boolean
}

/**
 * Represents a program on a live channel.
 */
export type TeeviLiveProgram = {
  /** Unique identifier for the program. */
  id: string

  /** ID of the channel this program belongs to. */
  channelId: string

  /** Title of the program. */
  title: string

  /** Optional description of the program. */
  description?: string

  /** Start date of the program (ISO date string, format: YYYY-MM-DDThh:mm:ssZ in UTC timezone). */
  startDate: string

  /** End date of the program (ISO date string, format: YYYY-MM-DDThh:mm:ssZ in UTC timezone). */
  endDate: string
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

  /**
   * Retrieves episodes for a specific show and season.
   * @param showId The unique identifier of the show.
   * @param season The season number to filter episodes.
   * @returns A promise that resolves to an array of episodes.
   */
  fetchEpisodes: (showId: string, season: number) => Promise<TeeviShowEpisode[]>
}

/**
 * Extends the base metadata interface with video-specific capabilities
 * for retrieving video assets associated with shows.
 */
export type TeeviVideoExtension = TeeviMetadataExtension & {
  /**
   * Retrieves the available video assets for a given media item.
   * @param mediaId - The unique identifier of the media item.
   *   - If the media item is a movie, `mediaId` represents the movie's ID.
   *   - If the media item is a TV series, `mediaId` represents the episode's ID.
   * @returns A promise resolving to an array of video assets.
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

  /**
   * Retrieves an array of trending shows.
   * @returns A promise that resolves to an array of trending shows.
   */
  fetchTrendingShows: () => Promise<TeeviShow[]>
}

/**
 * Provides methods for accessing live TV channels and events.
 */
export type TeeviLiveExtension = {
  /**
   * Retrieves a list of available live channels and events.
   * @returns A promise that resolves to an array of live channels.
   */
  fetchLiveChannels: () => Promise<TeeviLiveChannel[]>

  /**
   * Retrieves all programs within a time range.
   * @param startDate Optional start date to filter programs (ISO date string).
   * @param endDate Optional end date to filter programs (ISO date string).
   * @returns A promise that resolves to an array of programs for the channel.
   */
  fetchChannelPrograms: (
    startDate?: string,
    endDate?: string
  ) => Promise<TeeviLiveProgram[]>

  /**
   * Retrieves video asset for a live channel or event.
   * @param channelId The unique identifier of the channel.
   * @returns A promise that resolves to a video asset for the live channel.
   *   Returns null if the channel is not currently live or has no video asset.
   */
  fetchLiveVideoAsset: (channelId: string) => Promise<TeeviVideoAsset | null>
}

/**
 * Represents the interface for Teevi extension functionality.
 */
export type TeeviExtension =
  | TeeviMetadataExtension
  | TeeviVideoExtension
  | TeeviFeedExtension
  | TeeviLiveExtension
