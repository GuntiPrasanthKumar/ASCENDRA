class OpenAIProvider {
  constructor() {
    this.name = 'openai';
    this.modelName = 'gpt-4o-mini';
  }

  isAvailable() {
    return Boolean(process.env.OPENAI_API_KEY);
  }

  async generate(prompt, isJson = false) {
    if (!this.isAvailable()) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const startTime = Date.now();
    // Native fetch implementation to avoid adding extra heavy SDKs
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: this.modelName,
        messages: [{ role: 'user', content: prompt }],
        response_format: isJson ? { type: 'json_object' } : undefined
      })
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${res.status} ${errJson.error?.message || ''}`);
    }

    const json = await res.json();
    const text = json.choices?.[0]?.message?.content || '';
    const latencyMs = Date.now() - startTime;

    return {
      text,
      latencyMs,
      model: this.modelName,
      provider: this.name
    };
  }
}

module.exports = new OpenAIProvider();
