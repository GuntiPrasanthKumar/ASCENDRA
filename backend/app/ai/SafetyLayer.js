const AILogger = require('./AILogger');

class SafetyLayer {
  constructor() {
    this.prohibitedPatterns = [
      /ignore\s+all\s+previous\s+instructions/i,
      /disregard\s+system\s+prompt/i,
      /you\s+are\s+now\s+DAN/i,
      /system\s+override/i,
      /eval\(|exec\(/i,
      /<script[\s\S]*?>[\s\S]*?<\/script>/i
    ];
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim();
  }

  detectPromptInjection(prompt) {
    const cleanPrompt = this.sanitizeInput(prompt);
    for (const pattern of this.prohibitedPatterns) {
      if (pattern.test(cleanPrompt)) {
        return true;
      }
    }
    return false;
  }

  maskPII(text) {
    if (typeof text !== 'string') return text;
    // Basic PII masking for emails and 16-digit credit cards
    return text
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      .replace(/\b(?:\d[ -]*?){13,16}\b/g, '[REDACTED_CARD]');
  }

  validatePrompt(userId, prompt) {
    const clean = this.sanitizeInput(prompt);
    if (!clean) {
      return { valid: false, reason: 'EMPTY_PROMPT', error: 'Prompt cannot be empty' };
    }

    if (this.detectPromptInjection(clean)) {
      AILogger.logSecurityAlert({ userId, prompt: clean, reason: 'PROMPT_INJECTION_SUSPECTED' });
      return { valid: false, reason: 'PROMPT_INJECTION', error: 'Forbidden prompt patterns detected' };
    }

    return { valid: true, sanitizedPrompt: this.maskPII(clean) };
  }
}

module.exports = new SafetyLayer();
