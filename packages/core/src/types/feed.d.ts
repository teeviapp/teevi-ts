import type { TeeviShowEntry } from "./shows"

/**
 * Category types for feed collections, used for ordering and display priority.
 */
export type TeeviFeedCategory =
  // High priority categories (shown at top)
  | "new" // New releases or recently added content
  | "hot" // Popular/trending content
  | "recommended" // Personalized recommendations
  // Content type categories
  | "movies" // All movies in library
  | "series" // All TV series in library

/**
 * Represents a collection of show entries, typically used for categorized content feeds.
 */
export type TeeviFeedCollection = {
  /** Unique identifier for the collection. */
  id: string

  /** Name of the collection. */
  name: string

  /** An optional category for the collection, which can be either "popular" or "new". */
  category?: TeeviFeedCategory

  /** An optional URL pointing to an image representing the collection. */
  imageURL?: string

  /** An array of show entries associated with this collection. */
  shows: TeeviShowEntry[]
}
