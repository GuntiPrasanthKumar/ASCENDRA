class AICache {
  constructor(defaultTtlMs = 10 * 60 * 1000) { // 10 minutes default TTL
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  generateKey(promptType, inputKey) {
    const sanitized = typeof inputKey === 'object' ? JSON.stringify(inputKey) : String(inputKey);
    return `${promptType}:${sanitized.toLowerCase().trim()}`;
  }

  get(promptType, inputKey) {
    const key = this.generateKey(promptType, inputKey);
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(promptType, inputKey, value, ttlMs = this.defaultTtlMs) {
    const key = this.generateKey(promptType, inputKey);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs
    });
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new AICache();
