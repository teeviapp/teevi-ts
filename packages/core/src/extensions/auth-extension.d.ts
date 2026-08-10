import type { TeeviSession } from "../types/session"

/**
 * Interface representing the authentication capability of a Teevi extension.
 */
export type TeeviAuthExtension = {
  /**
   * Logs in the user with the provided credentials gathered from the client UI.
   * @param credentials A map of credentials defined in the manifest under the credentials section.
   * @returns A promise that resolves to the created user session.
   */
  login: (credentials: Record<string, string>) => Promise<TeeviSession>

  /**
   * Logs out the user and invalidates the session (optional).
   */
  logout?: () => Promise<void>

  /**
   * Refreshes the user session using the refresh token.
   * Called automatically by the Teevi platform before the access token expires.
   * @param session The current session to be refreshed.
   * @returns A promise resolving to the new refreshed session.
   */
  refreshSession?: (session: TeeviSession) => Promise<TeeviSession>
}
