const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider {
  constructor() {
    this.name = 'gemini';
    this.modelName = 'gemini-1.5-flash';
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
    const model = genAI.getGenerativeModel({
      model: this.modelName,
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
      model: this.modelName,
      provider: this.name
    };
  }
}

module.exports = new GeminiProvider();
