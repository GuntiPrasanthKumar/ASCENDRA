const GeminiProvider = require('./providers/GeminiProvider');
const OpenAIProvider = require('./providers/OpenAIProvider');
const LocalFallbackProvider = require('./providers/LocalFallbackProvider');
const AILogger = require('./AILogger');

class ProviderRouter {
  constructor() {
    this.providers = [
      GeminiProvider,
      OpenAIProvider,
      LocalFallbackProvider
    ];
  }

  async execute(prompt, isJson = false, userId = 'anonymous', promptType = 'general') {
    const errors = [];

    for (const provider of this.providers) {
      if (!provider.isAvailable()) continue;

      try {
        AILogger.logRequest({ userId, promptType, provider: provider.name, inputLength: prompt.length });
        const result = await provider.generate(prompt, isJson);
        AILogger.logResponse({ userId, promptType, provider: provider.name, latencyMs: result.latencyMs, tokens: Math.round(result.text.length / 4) });

        return result;
      } catch (err) {
        AILogger.logError({ userId, promptType, provider: provider.name, error: err });
        errors.push(`[${provider.name}]: ${err.message}`);
      }
    }

    // Final safety fallback using local provider
    const fallbackResult = await LocalFallbackProvider.generate(prompt, isJson);
    return fallbackResult;
  }
}

module.exports = new ProviderRouter();
