// Helper functions for working with backend media files

const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media';

/**
 * Converts relative image path from backend to full URL
 * @param relativePath - Path like "images/charyn1.png"
 * @returns Full URL like "http://localhost:8000/media/images/charyn1.png"
 */
export function getImageUrl(relativePath: string): string {
  if (!relativePath) return '';
  
  // If already a full URL, return as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Convert relative path to full URL
  return `${MEDIA_URL}/${relativePath}`;
}

/**
 * Converts array of relative image paths to full URLs
 * @param relativePaths - Array of paths like ["images/charyn1.png", "images/charyn2.png"]
 * @returns Array of full URLs
 */
export function getImageUrls(relativePaths: string[]): string[] {
  return relativePaths.map(getImageUrl);
}
