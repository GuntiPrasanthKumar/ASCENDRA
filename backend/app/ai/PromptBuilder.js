class PromptBuilder {
  static buildTutorPrompt({ userContext, chatHistory, userMessage, domain }) {
    const contextStr = userContext ? `
User Name: ${userContext.name || 'Student'}
Target Domain/Role: ${domain || userContext.role || 'General Computer Science'}
Current Streak: ${userContext.streak || 0} days
Weak Subtopics: ${(userContext.weakTopics || []).join(', ') || 'None identified'}
` : '';

    const historyStr = (chatHistory || []).map(msg => 
      `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`
    ).join('\n');

    return `
You are ASCENDRA AI, an elite, highly empathetic master tutor and technical mentor.
${contextStr}

Previous Conversation History:
${historyStr}

Student Inquiry: "${userMessage}"

INSTRUCTIONS:
1. Provide a direct, highly accurate, structured answer using clear Markdown formatting.
2. If mathematical equations or algorithms are involved, present them clearly.
3. Keep the tone encouraging, concise, and academically rigorous.
4. End with 1 follow-up check question or recommended next step related to their weak subtopics.
`;
  }

  static buildAssessmentPrompt({ subject, topic, numQuestions = 20 }) {
    return `
You are an expert academic examiner creating a rigorous exam paper.
Generate EXACTLY ${numQuestions} UNIQUE, highly factual assessment questions for "${topic}" in domain "${subject}".

CRITICAL RULES:
1. Base every question on real facts, definitions, formulae, or case studies.
2. Follow Bloom's Taxonomy strictly (Remember, Understand, Apply, Analyze, Evaluate, Create).
3. Format output strictly as a JSON array of objects without markdown formatting like \`\`\`json.

SCHEMA:
[
  { "type": "multiple_choice", "text": "...", "options": ["A", "B", "C", "D"], "correctOptionIndex": 0, "bloomsLevel": "Remember", "explanation": "..." },
  { "type": "fill_in_the_blanks", "text": "Statement with ___", "correctAnswer": "...", "bloomsLevel": "Understand", "explanation": "..." },
  { "type": "short_answer", "text": "...", "correctAnswer": "...", "bloomsLevel": "Analyze", "explanation": "..." }
]
`;
  }

  static buildDiscoveryPrompt(query) {
    return `
Analyze search query: "${query}".
Identify the overarching academic/professional Domain and 6 to 8 factual subtopics.

Output strictly in JSON format without markdown:
{
  "domain": "Domain Name",
  "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4", "Subtopic 5", "Subtopic 6"]
}
`;
  }

  static buildRecommendationPrompt({ userProfile, recentScores, weakAreas }) {
    return `
Generate personalized learning recommendations for candidate ${userProfile?.name || 'Student'}.
Profile Role: ${userProfile?.role || 'Student'}
Recent Scores: ${JSON.stringify(recentScores || [])}
Identified Weak Areas: ${JSON.stringify(weakAreas || [])}

Output strictly in JSON format without markdown:
{
  "recommendedPathways": [
    { "title": "...", "reason": "...", "priority": "HIGH|MEDIUM|LOW", "estimatedMinutes": 20 }
  ],
  "focusGap": "...",
  "suggestedPractice": "..."
}
`;
  }
}

module.exports = PromptBuilder;
