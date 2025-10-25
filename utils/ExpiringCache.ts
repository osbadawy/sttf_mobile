interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ExpiringCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private readonly expirationTime: number;

  constructor(expirationMinutes: number = 10) {
    this.expirationTime = expirationMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // Check if the item has expired
    if (Date.now() - item.timestamp > this.expirationTime) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    // Check if the item has expired
    if (Date.now() - item.timestamp > this.expirationTime) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Clean up expired entries (optional utility method)
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.expirationTime) {
        this.cache.delete(key);
      }
    }
  }
}

export default ExpiringCache;
