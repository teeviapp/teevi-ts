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

  /** Optional URL of the poster image without logo or text overlays. */
  cleanPosterURL?: string

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
