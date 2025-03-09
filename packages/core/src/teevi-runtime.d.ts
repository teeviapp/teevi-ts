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
}

/**
 * Global Teevi object.
 */
declare global {
  var Teevi: TeeviRuntime
}

export {}
