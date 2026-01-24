import { Model } from 'mongoose';
import { randomBytes } from 'crypto';

/**
 * Generates a URL-friendly slug from a title
 * Ensures uniqueness by appending a short random ID
 */
export async function generateUniqueSlug(
  title: string,
  model: Model<any>,
  excludeId?: string,
): Promise<string> {
  // Create base slug from title
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Truncate if too long (leave room for ID suffix)
  if (slug.length > 80) {
    slug = slug.substring(0, 80).replace(/-+$/, '');
  }

  // Generate a short unique ID (6 characters from random bytes)
  const shortId = randomBytes(3).toString('hex');
  
  // Append ID to slug for better uniqueness
  let uniqueSlug = `${slug}-${shortId}`;

  const query: any = { slug: uniqueSlug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  // If still not unique (very rare), append counter
  let counter = 1;
  while (await model.findOne(query)) {
    uniqueSlug = `${slug}-${shortId}-${counter}`;
    query.slug = uniqueSlug;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Extracts plain text from HTML/markdown content
 */
export function extractPlainText(content: string): string {
  // Remove HTML tags
  let text = content.replace(/<[^>]*>/g, ' ');
  
  // Remove markdown syntax
  text = text
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/[*_]{1,2}/g, '') // Bold/italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`[^`]+`/g, '') // Inline code
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1'); // Images
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

