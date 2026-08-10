import type { TeeviSession } from "./types/session"

/**
 * Represents the runtime interface for the injected global Teevi object.
 */
export interface TeeviRuntime {
  /**
   * Specifies the current language setting.
   * The language should be provided as a BCP 47 language tag (e.g., "en", "it").
   */
  readonly language?: string

  /**
   * Provides information about the user agent of the client.
   */
  readonly userAgent?: string

  /**
   * Retrieves the configuration value for an input defined in the manifest.
   *
   * @param id - The identifier of the input as defined in the manifest.
   * @returns The input's value, or undefined if the input is not found.
   */
  getInputValueById(id: string): string | undefined

  /**
   * Retrieves the current user session associated with this extension.
   * @returns A promise resolving to the user session, or null if not logged in.
   */
  getSession(): Promise<TeeviSession | null>

  /**
   * Securely saves/updates the user session. Delegates persistence to the host application.
   * @param session The session object to persist.
   */
  setSession(session: TeeviSession): Promise<void>

  /**
   * Clears the current user session (e.g., during explicit logout or session expiry).
   */
  clearSession(): Promise<void>
}

/**
 * Global Teevi object.
 */
declare global {
  var Teevi: TeeviRuntime
}

export {}
