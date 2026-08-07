const AIGateway = require('./AIGateway');

class StreamingSupport {
  setupSSEHeader(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();
  }

  sendSSEEvent(res, eventName, data) {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  async streamResponse(res, userId, promptType, prompt) {
    this.setupSSEHeader(res);

    try {
      this.sendSSEEvent(res, 'start', { status: 'INITIALIZING', timestamp: new Date().toISOString() });

      const response = await AIGateway.processRequest({
        userId,
        promptType,
        prompt,
        isJson: false,
        useCache: false
      });

      if (!response.success) {
        this.sendSSEEvent(res, 'error', { error: response.error });
        res.end();
        return;
      }

      const fullText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      const chunks = fullText.match(/.{1,30}/g) || [fullText];

      for (let i = 0; i < chunks.length; i++) {
        this.sendSSEEvent(res, 'chunk', { chunk: chunks[i], index: i });
        await new Promise(resolve => setTimeout(resolve, 40));
      }

      this.sendSSEEvent(res, 'complete', {
        status: 'FINISHED',
        metadata: response.metadata
      });
      res.end();
    } catch (err) {
      this.sendSSEEvent(res, 'error', { error: err.message });
      res.end();
    }
  }
}

module.exports = new StreamingSupport();
