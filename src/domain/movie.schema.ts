import { z } from 'zod'

/**
 * Schema for a movie item in list endpoints (search, trending, popular, recommendations).
 * Contains the fields returned by TMDB's list endpoints.
 */
export const MovieListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string(),
  overview: z.string(),
  release_date: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  video: z.boolean(),
})

/** Inferred type for a movie list item. */
export type MovieListItem = z.infer<typeof MovieListItemSchema>
