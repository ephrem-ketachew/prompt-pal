/**
 * Simple in-memory cache utility for prompt optimizations
 * Can be replaced with Redis in production
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 3600) {
    // Default TTL: 1 hour
    this.cache = new Map();
    this.defaultTTL = defaultTTL * 1000; // Convert to milliseconds
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ? ttl * 1000 : this.defaultTTL);

    this.cache.set(key, {
      data: value,
      expiresAt,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Create cache instances for different purposes
export const questionCache = new SimpleCache(1800); // 30 minutes for questions
export const optimizationCache = new SimpleCache(3600); // 1 hour for optimizations
export const analyticsCache = new SimpleCache(600); // 10 minutes default for analytics

// Clean expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    questionCache.cleanExpired();
    optimizationCache.cleanExpired();
  }, 5 * 60 * 1000);
}

/**
 * Generate cache key for prompt analysis
 */
export function generateAnalysisCacheKey(
  prompt: string,
  mediaType: string,
  targetModel: string,
): string {
  // Create a simple hash of the input
  const input = `${prompt.toLowerCase().trim()}_${mediaType}_${targetModel.toLowerCase()}`;
  return `analysis_${Buffer.from(input).toString('base64').slice(0, 50)}`;
}

/**
 * Generate cache key for questions
 */
export function generateQuestionsCacheKey(
  prompt: string,
  mediaType: string,
  targetModel: string,
): string {
  const input = `${prompt.toLowerCase().trim()}_${mediaType}_${targetModel.toLowerCase()}`;
  return `questions_${Buffer.from(input).toString('base64').slice(0, 50)}`;
}

