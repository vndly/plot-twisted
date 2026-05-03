import { type LibraryEntry } from './library.schema'
import { LibrarySearchQuerySchema } from './library-search.schema'

/**
 * Normalizes a search query using the domain schema.
 */
export function normalizeLibrarySearchQuery(query: string): string {
  return LibrarySearchQuerySchema.parse(query)
}

/**
 * Returns true if a library entry matches the normalized search query.
 * Matching is case-insensitive and literal (String.includes) across title, tags, and notes.
 */
export function matchesLibrarySearchQuery(entry: LibraryEntry, query: string): boolean {
  const normalizedQuery = query.toLowerCase()
  if (!normalizedQuery) return true

  const titleMatch = entry.title.toLowerCase().includes(normalizedQuery)
  const tagMatch = entry.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  const noteMatch = entry.notes.toLowerCase().includes(normalizedQuery)

  return titleMatch || tagMatch || noteMatch
}

/**
 * Filters a list of library entries by a search query.
 */
export function filterLibraryEntriesBySearchQuery(
  entries: LibraryEntry[],
  query: string,
): LibraryEntry[] {
  const normalizedQuery = normalizeLibrarySearchQuery(query)
  return entries.filter((entry) => matchesLibrarySearchQuery(entry, normalizedQuery))
}
