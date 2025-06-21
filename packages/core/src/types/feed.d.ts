import type { TeeviShowEntry } from "./shows"

/**
 * Represents a collection of show entries, typically used for categorized content feeds.
 */
export type TeeviFeedCollection = {
  /** Unique identifier for the collection. */
  id: string

  /** Name of the collection. */
  name: string

  /** An optional category for the collection, which can be either "popular" or "new". */
  category?: "new" | "popular" | "best"

  /** An optional URL pointing to an image representing the collection. */
  imageURL?: string

  /** An array of show entries associated with this collection. */
  shows: TeeviShowEntry[]
}
