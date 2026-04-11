import { z } from 'zod'

/**
 * Schema for watch status.
 */
export const WatchStatusSchema = z.enum(['watchlist', 'watched', 'none'])

/** Inferred type for watch status. */
export type WatchStatus = z.infer<typeof WatchStatusSchema>

/**
 * Schema for media type.
 */
export const MediaTypeSchema = z.enum(['movie', 'tv'])

/** Inferred type for media type. */
export type MediaType = z.infer<typeof MediaTypeSchema>

/**
 * Schema for a library entry representing a user's interaction with a movie or TV show.
 * Rating of 0 means unrated, 1-5 are valid ratings.
 */
export const LibraryEntrySchema = z.object({
  id: z.number(),
  mediaType: MediaTypeSchema,
  title: z.string(),
  posterPath: z.string().nullable(),
  rating: z.number().min(0).max(5),
  favorite: z.boolean(),
  status: WatchStatusSchema,
  lists: z.array(z.string()),
  tags: z.array(z.string()),
  notes: z.string(),
  watchDates: z.array(z.string()),
  addedAt: z.string(),
  voteAverage: z.number().optional(),
  releaseDate: z.string().optional(),
  genreIds: z.array(z.number()).optional(),
})

/** Inferred type for a library entry. */
export type LibraryEntry = z.infer<typeof LibraryEntrySchema>

/**
 * Schema for a custom user-defined list.
 */
export const ListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
})

/** Inferred type for a list. */
export type List = z.infer<typeof ListSchema>
