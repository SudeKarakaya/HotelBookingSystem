type CacheEntry = {
  value: any;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export const getCache = (key: string) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
};

export const setCache = (key: string, value: any, ttlSeconds: number) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
};
