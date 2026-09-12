const AIGateway = require('../../ai/AIGateway');

class FollowupEngine {
  async checkAndGenerateFollowup(questionText, candidateAnswer, userId = 'anonymous') {
    const text = (candidateAnswer || '').trim();

    // Trigger follow-up if response is brief (< 20 words) or lacks technical detail
    if (text.split(/\s+/).length >= 25) {
      return null; // Response is sufficiently detailed
    }

    const prompt = `
You are a senior technical interviewer.
Current Question: "${questionText}"
Candidate Response: "${text}"

The response was brief or incomplete. Formulate a 1-sentence polite, probing follow-up question asking the candidate to expand on their technical implementation or specific metrics.

Output strictly as a JSON object:
{
  "needsFollowup": true,
  "followupQuestion": "Can you elaborate on how you handled..."
}
`;

    try {
      const response = await AIGateway.processRequest({
        userId,
        promptType: 'interview_followup',
        prompt,
        isJson: true,
        useCache: false
      });

      if (response.success && response.data?.followupQuestion) {
        return response.data.followupQuestion;
      }
    } catch (err) {
      console.warn('[FollowupEngine] Fallback follow-up question:', err.message);
    }

    return "Could you provide a specific technical example or metric demonstrating how you implemented that solution?";
  }
}

module.exports = new FollowupEngine();
