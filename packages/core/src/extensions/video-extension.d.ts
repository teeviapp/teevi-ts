import type { TeeviMetadataExtension } from "./metadata-extension"
import type { TeeviVideoAsset } from "../types/video-asset"

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
