import { z } from 'zod'
import { MovieListItemSchema } from '@/domain/movie.schema'
import { ShowListItemSchema } from '@/domain/show.schema'

/**
 * Schema for a movie result in search, including the media_type discriminator.
 */
const SearchMovieResultSchema = MovieListItemSchema.extend({
  media_type: z.literal('movie'),
})

/**
 * Schema for a TV show result in search, including the media_type discriminator.
 */
const SearchTvResultSchema = ShowListItemSchema.extend({
  media_type: z.literal('tv'),
})

/**
 * Schema for a person result in search (minimal fields, will be filtered out).
 */
const SearchPersonResultSchema = z.object({
  id: z.number(),
  name: z.string(),
  media_type: z.literal('person'),
})

/**
 * Schema for an unrecognized result in search (minimal fields, will be filtered out).
 */
const SearchUnknownResultSchema = z.object({
  id: z.number(),
  media_type: z.string(),
})

/**
 * Schema for a search result item.
 * Supports movie, TV show, person, and unknown results.
 */
export const SearchResultItemSchema = z.union([
  SearchMovieResultSchema,
  SearchTvResultSchema,
  SearchPersonResultSchema,
  SearchUnknownResultSchema,
])

/** Inferred type for a search result item. */
export type SearchResultItem = z.infer<typeof SearchResultItemSchema>

/**
 * Schema for the paginated search response from the TMDB API.
 */
export const SearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(SearchResultItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

/** Inferred type for the search response. */
export type SearchResponse = z.infer<typeof SearchResponseSchema>
