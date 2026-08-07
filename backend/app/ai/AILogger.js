const logger = require('../core/logger/logger');

class AILogger {
  logRequest({ userId, promptType, provider, inputLength, promptSecurityFlag = false }) {
    logger.info(`[AI_LOG] Request initiated`, {
      userId: String(userId),
      promptType,
      provider,
      inputLength,
      promptSecurityFlag,
      timestamp: new Date().toISOString()
    });
  }

  logResponse({ userId, promptType, provider, latencyMs, tokens, cached = false }) {
    logger.info(`[AI_LOG] Response completed`, {
      userId: String(userId),
      promptType,
      provider,
      latencyMs,
      tokens,
      cached,
      timestamp: new Date().toISOString()
    });
  }

  logSecurityAlert({ userId, prompt, reason }) {
    logger.warn(`[AI_SECURITY_ALERT] Prompt injection or prohibited content detected`, {
      userId: String(userId),
      promptSnippet: (prompt || '').substring(0, 100),
      reason,
      timestamp: new Date().toISOString()
    });
  }

  logError({ userId, promptType, provider, error }) {
    logger.error(`[AI_LOG] Provider execution error`, {
      userId: String(userId),
      promptType,
      provider,
      error: error?.message || String(error),
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new AILogger();
