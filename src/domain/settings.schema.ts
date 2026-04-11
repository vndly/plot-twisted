import { z } from 'zod'
import { SortFieldSchema, SortOrderSchema } from './filter.schema'

/**
 * Schema for user settings.
 */
export const SettingsSchema = z.object({
  theme: z.enum(['dark', 'light']),
  language: z.string(),
  preferredRegion: z.string(),
  layoutMode: z.enum(['grid', 'list']),
  defaultHomeSection: z.enum(['trending', 'popular', 'search']),
  librarySortField: SortFieldSchema.optional(),
  librarySortOrder: SortOrderSchema.optional(),
})

/** Inferred type for settings. */
export type Settings = z.infer<typeof SettingsSchema>

/** Inferred type for layout mode. */
export type LayoutMode = 'grid' | 'list'

/**
 * Default settings.
 */
export const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'en',
  preferredRegion: 'US',
  layoutMode: 'grid',
  defaultHomeSection: 'trending',
  librarySortField: 'dateAdded',
  librarySortOrder: 'desc',
}
