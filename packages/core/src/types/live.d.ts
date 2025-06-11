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
