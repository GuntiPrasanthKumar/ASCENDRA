const ProviderRouter = require('./ProviderRouter');
const ResponseFormatter = require('./ResponseFormatter');
const AICache = require('./AICache');
const AILogger = require('./AILogger');

// Rate limiting in-memory map: userId -> { count, windowStart }
const userRateLimits = new Map();
const RATE_LIMIT_MAX = 30; // max 30 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000;

class AIGateway {
  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim();
  }

  detectPromptInjection(prompt) {
    const PROHIBITED_PATTERNS = [
      /ignore\s+all\s+previous\s+instructions/i,
      /disregard\s+system\s+prompt/i,
      /you\s+are\s+now\s+DAN/i,
      /system\s+override/i,
      /eval\(|exec\(/i
    ];

    for (const pattern of PROHIBITED_PATTERNS) {
      if (pattern.test(prompt)) {
        return true;
      }
    }
    return false;
  }

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

  async processRequest({ userId = 'anonymous', promptType, prompt, isJson = false, useCache = true, cacheTtlMs }) {
    const cleanPrompt = this.sanitizeInput(prompt);

    if (!cleanPrompt) {
      return ResponseFormatter.formatError('Prompt cannot be empty', { code: 'INVALID_INPUT' });
    }

    // Security Check: Prompt Injection
    if (this.detectPromptInjection(cleanPrompt)) {
      AILogger.logSecurityAlert({ userId, prompt: cleanPrompt, reason: 'PROMPT_INJECTION_SUSPECTED' });
      return ResponseFormatter.formatError('Forbidden prompt patterns detected', { code: 'SECURITY_VIOLATION' });
    }

    // Rate Limit Check
    if (!this.checkRateLimit(userId)) {
      return ResponseFormatter.formatError('AI API rate limit exceeded. Please wait a minute.', { code: 'RATE_LIMIT_EXCEEDED' });
    }

    // Cache Check
    if (useCache) {
      const cached = AICache.get(promptType, cleanPrompt);
      if (cached) {
        AILogger.logResponse({ userId, promptType, provider: 'cache', latencyMs: 2, tokens: 0, cached: true });
        return ResponseFormatter.formatSuccess(cached.data, { ...cached.meta, cached: true, latencyMs: 2 });
      }
    }

    // Execute via Provider Router
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
