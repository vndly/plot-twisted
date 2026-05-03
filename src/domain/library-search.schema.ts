import { z } from 'zod'

/**
 * Schema for library search query normalization.
 * Trims leading/trailing whitespace, truncates to 120 chars, and converts to lowercase.
 */
export const LibrarySearchQuerySchema = z
  .string()
  .transform((val) => val.trim())
  .transform((val) => val.slice(0, 120))
  .transform((val) => val.toLowerCase())
  .catch('')

/** Inferred type for library search query. */
export type LibrarySearchQuery = z.infer<typeof LibrarySearchQuerySchema>
