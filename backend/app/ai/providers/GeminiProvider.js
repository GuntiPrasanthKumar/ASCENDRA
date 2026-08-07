const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider {
  constructor() {
    this.name = 'gemini';
    this.candidateModels = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-pro'];
  }

  isAvailable() {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  async generate(prompt, isJson = false) {
    if (!this.isAvailable()) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const config = isJson ? { responseMimeType: 'application/json' } : {};
    let lastError = null;

    for (const modelName of this.candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: config
        });

        const startTime = Date.now();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const latencyMs = Date.now() - startTime;

        return {
          text,
          latencyMs,
          model: modelName,
          provider: this.name
        };
      } catch (err) {
        lastError = err;
        // If 404 model not found, try next candidate model
        if (err.message && (err.message.includes('404') || err.message.includes('not found'))) {
          continue;
        }
        throw err; // throw non-404 errors immediately
      }
    }

    throw lastError || new Error('All Gemini candidate models failed.');
  }
}

module.exports = new GeminiProvider();
