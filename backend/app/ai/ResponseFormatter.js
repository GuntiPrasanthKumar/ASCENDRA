class ResponseFormatter {
  static formatSuccess(data, meta = {}) {
    return {
      success: true,
      data: data,
      metadata: {
        provider: meta.provider || 'gemini',
        model: meta.model || 'gemini-1.5-flash',
        latencyMs: meta.latencyMs || 0,
        tokens: meta.tokens || Math.round(JSON.stringify(data).length / 4),
        cached: Boolean(meta.cached),
        timestamp: new Date().toISOString()
      }
    };
  }

  static formatError(error, meta = {}) {
    return {
      success: false,
      error: {
        code: meta.code || 'AI_EXECUTION_ERROR',
        message: typeof error === 'string' ? error : error?.message || 'An error occurred during AI processing',
        details: meta.details || null
      },
      metadata: {
        provider: meta.provider || 'none',
        model: meta.model || 'none',
        latencyMs: meta.latencyMs || 0,
        timestamp: new Date().toISOString()
      }
    };
  }
}

module.exports = ResponseFormatter;
