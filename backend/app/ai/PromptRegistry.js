class PromptRegistry {
  constructor() {
    this.templates = new Map();
    this.registerDefaults();
  }

  register(promptType, templateFn) {
    this.templates.set(promptType, templateFn);
  }

  getPrompt(promptType, params = {}) {
    const template = this.templates.get(promptType);
    if (!template) {
      throw new Error(`Prompt template for '${promptType}' not registered in PromptRegistry.`);
    }
    return template(params);
  }

  registerDefaults() {
    // 1. Tutor / Chat Prompt
    this.register('tutor', ({ userContext, chatHistory, userMessage, domain }) => {
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
    });

    // 2. Assessment Prompt
    this.register('assessment', ({ subject, topic, numQuestions = 20 }) => `
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
`);

    // 3. Discovery Prompt
    this.register('discovery', ({ query }) => `
Analyze search query: "${query}".
Identify the overarching academic/professional Domain and 6 to 8 factual subtopics.

Output strictly in JSON format without markdown:
{
  "domain": "Domain Name",
  "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4", "Subtopic 5", "Subtopic 6"]
}
`);

    // 4. Recommendation Prompt
    this.register('recommendation', ({ userProfile, recentScores, weakAreas }) => `
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
`);

    // 5. Code Review & Debugger Prompt
    this.register('code_debug', ({ code, language, errorMessage }) => `
You are an expert compiler engineer and static analysis specialist.
Language: ${language || 'javascript'}
Error Output: "${errorMessage || 'N/A'}"
Code snippet:
\`\`\`${language || 'javascript'}
${code}
\`\`\`

Diagnose the root cause and provide a corrected code fix with line-by-line explanation.
`);

    // 6. Interview Evaluation Prompt
    this.register('interview_evaluation', ({ title, transcripts }) => `
Analyze candidate interview performance for "${title || 'Technical Interview'}":
Transcripts: ${JSON.stringify(transcripts || {})}

Return AI Feedback JSON strictly:
{
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1"],
  "recommendations": ["Rec 1", "Rec 2"]
}
`);

    // 7. Adaptive Diagnostic Question Prompt
    this.register('diagnostic_question', ({ domain, difficulty, questionIndex, totalQuestions, priorTopics }) => `
Generate 1 single highly factual, adaptive multiple choice diagnostic question for domain "${domain}".
Current Question Number: ${questionIndex + 1} of ${totalQuestions}.
Target Difficulty: ${difficulty || 'Medium'}.
Avoid these previously tested topics: ${(priorTopics || []).join(', ') || 'None'}.

SCHEMA (JSON without markdown formatting):
{
  "questionId": "diag-q-${questionIndex + 1}",
  "questionText": "Clear, rigorous factual question for ${domain} at ${difficulty} level...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctOptionIndex": 0,
  "topic": "Specific Subtopic Name",
  "bloomsLevel": "Apply",
  "explanation": "Detailed explanation of why correctOptionIndex is right and others are incorrect."
}
`);
  }
}

module.exports = new PromptRegistry();
