import type { TeeviLiveChannel, TeeviLiveProgram } from "../types/live"
import type { TeeviVideoAsset } from "../types/video-asset"

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
