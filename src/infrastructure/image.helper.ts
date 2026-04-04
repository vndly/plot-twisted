import { IMAGE_BASE_URL } from '@/domain/constants'

/**
 * Builds a full image URL from a TMDB relative path.
 * @param path - Relative image path from TMDB (e.g., '/kqjL17y...jpg')
 * @param size - Image size (e.g., 'w342', 'w500')
 * @returns Full image URL or null if path is null
 */
export function buildImageUrl(path: string | null, size: string): string | null {
  if (!path) {
    return null
  }
  return `${IMAGE_BASE_URL}/${size}${path}`
}
