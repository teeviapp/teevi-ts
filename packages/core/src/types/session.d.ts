/**
 * Represents the user session containing authentication details and user profile info.
 */
export type TeeviSession = {
  /** The access token or credential used to authenticate requests. */
  token: string

  /** The expiration timestamp of the token in epoch milliseconds. */
  expiresAt?: number

  /** Optional refresh token to acquire a new access token when expired. */
  refreshToken?: string

  /** User profile information associated with the session. */
  user?: {
    username?: string
    email?: string
    avatarURL?: string
  }

  /** Additional extension-specific metadata. */
  metadata?: Record<string, any>
}
