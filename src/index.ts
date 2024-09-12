export type ShowKind = "movie" | "series"

export type SearchShow = {
  id: string
  kind: ShowKind
  title: string
  posterURL?: string
}

export type Show = SearchShow & {
  backdropURL?: string
  overview: string
  durationInSeconds: number
  genres: string[]
  seasons?: { first: number; last: number }
}

export type ShowEpisode = {
  id: string
  number: number
  title?: string
  thumbnailURL?: string
  overview?: string
  durationInSeconds?: number
}

export type SearchShowsFuntion = (query: string) => Promise<SearchShow[]>
export type FetchShowDetailsFuntion = (id: string) => Promise<Show>
export type FetchEpisodesFuntion = (showId: string) => Promise<ShowEpisode[]>
