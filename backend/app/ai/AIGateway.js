const ProviderRouter = require('./ProviderRouter');
const ResponseFormatter = require('./ResponseFormatter');
const AICache = require('./AICache');
const AILogger = require('./AILogger');
const SafetyLayer = require('./SafetyLayer');

// Rate limiting in-memory map: userId -> { count, windowStart }
const userRateLimits = new Map();
const RATE_LIMIT_MAX = 30; // max 30 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000;

class AIGateway {
  checkRateLimit(userId) {
    const now = Date.now();
    const userRecord = userRateLimits.get(String(userId)) || { count: 0, windowStart: now };

    if (now - userRecord.windowStart > RATE_LIMIT_WINDOW) {
      userRecord.count = 1;
      userRecord.windowStart = now;
      userRateLimits.set(String(userId), userRecord);
      return true;
    }

    if (userRecord.count >= RATE_LIMIT_MAX) {
      return false;
    }

    userRecord.count++;
    userRateLimits.set(String(userId), userRecord);
    return true;
  }

  async processRequest({ userId = 'anonymous', promptType = 'general', prompt, isJson = false, useCache = true, cacheTtlMs }) {
    // 1. Safety & Input Validation
    const validation = SafetyLayer.validatePrompt(userId, prompt);
    if (!validation.valid) {
      return ResponseFormatter.formatError(validation.error, { code: validation.reason });
    }
    const cleanPrompt = validation.sanitizedPrompt;

    // 2. Rate Limit Check
    if (!this.checkRateLimit(userId)) {
      return ResponseFormatter.formatError('AI API rate limit exceeded. Please wait a minute.', { code: 'RATE_LIMIT_EXCEEDED' });
    }

    // 3. Cache Check
    if (useCache) {
      const cached = AICache.get(promptType, cleanPrompt);
      if (cached) {
        AILogger.logResponse({ userId, promptType, provider: 'cache', latencyMs: 2, tokens: 0, cached: true });
        return ResponseFormatter.formatSuccess(cached.data, { ...cached.meta, cached: true, latencyMs: 2 });
      }
    }

    // 4. Provider Execution
    try {
      const result = await ProviderRouter.execute(cleanPrompt, isJson, userId, promptType);
      
      let parsedData = result.text;
      if (isJson) {
        try {
          const jsonMatch = result.text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
          if (jsonMatch) {
            parsedData = JSON.parse(jsonMatch[0]);
          } else {
            parsedData = JSON.parse(result.text);
          }
        } catch (parseErr) {
          console.warn('[AIGateway] JSON parse fallback:', parseErr.message);
        }
      }

      const responsePayload = ResponseFormatter.formatSuccess(parsedData, {
        provider: result.provider,
        model: result.model,
        latencyMs: result.latencyMs
      });

      if (useCache && parsedData) {
        AICache.set(promptType, cleanPrompt, { data: parsedData, meta: responsePayload.metadata }, cacheTtlMs);
      }

      return responsePayload;
    } catch (err) {
      return ResponseFormatter.formatError(err.message, { code: 'AI_SERVICE_UNAVAILABLE' });
    }
  }
}

module.exports = new AIGateway();
