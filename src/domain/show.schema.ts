import { z } from 'zod'

/**
 * Schema for a TV show item in list endpoints (search, trending, popular, recommendations).
 * Contains the fields returned by TMDB's list endpoints.
 */
export const ShowListItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  original_name: z.string(),
  overview: z.string(),
  first_air_date: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean(),
  original_language: z.string(),
  origin_country: z.array(z.string()),
})

/** Inferred type for a TV show list item. */
export type ShowListItem = z.infer<typeof ShowListItemSchema>
