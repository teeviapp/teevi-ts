import type { TeeviShowEntry } from "./shows"

/**
 * Represents a collection of show entries, typically used for categorized content feeds.
 */
export type TeeviFeedCollection = {
  id: string
  name: string
  shows: TeeviShowEntry[]
}
