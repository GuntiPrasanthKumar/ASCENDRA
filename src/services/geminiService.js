/**
 * Gemini AI Service for ASCENDRA Platform
 * Connects directly to Google Generative Language API using VITE_GEMINI_API_KEY & VITE_GEMINI_MODEL.
 */

const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY || '';
const getGeminiModel = () => import.meta.env.VITE_GEMINI_MODEL || import.meta.env.VITE_LLM_MODEL || 'gemini-2.5-flash';
const getGeminiEndpoint = () => `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent?key=${getApiKey()}`;

/**
 * Universal Gemini Prompt Execution Engine
 */
export async function askGemini({ systemInstruction, contents, temperature = 0.7, maxOutputTokens = 1024 }) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in .env');
  }

  const requestBody = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens,
      topP: 0.95,
    },
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await fetch(getGeminiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 429) {
      throw new Error('API Rate Limit reached. Please wait a moment.');
    }
    throw new Error(errorData?.error?.message || `HTTP ${response.status}: Failed to communicate with Gemini API`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response returned from Gemini API.');
  }

  return text.trim();
}

/**
 * AI Mentor & Career Guidance Chat Assistant
 */
export async function askAIMentor(userPrompt, conversationHistory = [], studentName = 'Student') {
  const systemInstruction = `You are ASCENDRA's expert AI Career Mentor & Technical Tutor for computer science student "${studentName}".
You help students with:
- Data Structures & Algorithms, Dynamic Programming, Graphs, System Design, Operating Systems, DBMS
- Technical placement interview prep, coding patterns, code optimization, mock review
- Personalized learning advice, daily study planning, streak motivation, weak area diagnostics

Guidelines:
- Format responses in clean Markdown (use bolding, bullet points, headers, or short code snippets where appropriate).
- Be encouraging, highly practical, technically accurate, and focused on high-performance interview standards.
- Keep answers concise and actionable (2-4 paragraphs max unless explicitly asked for deep explanation).`;

  // Format conversation history for Gemini multi-turn format
  const contents = [];
  
  // Include recent history (last 6 messages)
  const recentHistory = conversationHistory.slice(-6);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content || msg.text || '' }]
    });
  }

  // Add the current prompt if not already the last message
  const lastMsg = contents[contents.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.parts[0].text !== userPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });
  }

  return await askGemini({
    systemInstruction,
    contents,
    temperature: 0.7,
    maxOutputTokens: 1024,
  });
}

/**
 * Builds a concise text summary of lesson content blocks for the system prompt.
 */
function buildLessonContext(lessonTitle, contentBlocks = []) {
  const textParts = contentBlocks
    .filter(b => ['heading', 'paragraph', 'info_card', 'key_takeaway', 'summary', 'important_note'].includes(b.type))
    .map(b => b.value)
    .join('\n\n');

  return `Lesson Title: "${lessonTitle}"\n\nLesson Content Summary:\n${textParts.slice(0, 2000)}`;
}

/**
 * Sends a question to the Gemini AI coach, grounded in the current lesson context.
 */
export async function askLessonCoach(lessonTitle, contentBlocks, userQuestion) {
  const lessonContext = buildLessonContext(lessonTitle, contentBlocks);

  const systemInstruction = `You are ASCENDRA's expert AI Lesson Coach — a concise, knowledgeable tutor helping CS students understand concepts deeply.

CURRENT LESSON CONTEXT:
${lessonContext}

RULES:
- Answer questions directly related to the lesson content above
- Be concise but thorough (2-5 sentences or a short code example)
- Use simple language suitable for CS students
- For code examples, use JavaScript unless a different language is specified
- If asked for a summary, highlight 3 key takeaways
- If asked for a quiz, generate 2-3 multiple choice questions with answers
- Always be encouraging and educational`;

  try {
    return await askGemini({
      systemInstruction,
      contents: [{ role: 'user', parts: [{ text: userQuestion }] }],
      temperature: 0.7,
      maxOutputTokens: 512,
    });
  } catch (error) {
    console.error('[GeminiService] Error in askLessonCoach:', error);
    return `AI Coach encountered an issue: ${error.message}. Please verify your network connection and try again.`;
  }
}

/**
 * Quick helper to get a concise summary of lesson content.
 */
export async function getLessonSummary(lessonTitle, contentBlocks) {
  return askLessonCoach(
    lessonTitle,
    contentBlocks,
    `Please provide a concise 3-point summary of the key takeaways from the lesson "${lessonTitle}". Format as numbered bullet points.`
  );
}

/**
 * Generate a quick self-check quiz for the lesson.
 */
export async function generateLessonQuiz(lessonTitle, contentBlocks) {
  return askLessonCoach(
    lessonTitle,
    contentBlocks,
    `Generate 3 short multiple-choice questions to test understanding of "${lessonTitle}". Include the correct answer for each.`
  );
}

/**
 * AI Code Review for CodeLab
 */
export async function reviewCodeAI(problemTitle, language, code, verdict = 'ACCEPTED') {
  const systemInstruction = `You are ASCENDRA's Senior Staff Engineer AI Code Reviewer.
Analyze the user's code submission and return a strict JSON object with complexity, cleanliness rating, and optimizations.

Output JSON format strictly:
{
  "cleanlinessScore": 92,
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(1)",
  "summary": "Brief 1-2 sentence review of the algorithm and implementation.",
  "optimizations": ["First optimization tip", "Second optimization tip"]
}`;

  const prompt = `Problem: ${problemTitle}
Language: ${language}
Verdict: ${verdict}
Code:
\`\`\`${language}
${code}
\`\`\``;

  try {
    const rawText = await askGemini({
      systemInstruction,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.2,
      maxOutputTokens: 512,
    });

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('[GeminiService] Failed to parse AI review JSON, falling back:', e.message);
  }

  return {
    cleanlinessScore: verdict === 'ACCEPTED' ? 95 : 75,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    summary: verdict === 'ACCEPTED' 
      ? 'Optimal solution executed efficiently with solid time complexity.'
      : 'Solution requires edge-case handling and space-time optimization.',
    optimizations: ['Add early boundary check returns', 'Avoid unnecessary memory allocations']
  };
}

/**
 * AI Personalized Dashboard Insights Generator
 */
export async function generateDashboardAIInsights({
  userName = 'Scholar',
  completedLessonsCount = 0,
  totalLessonsCount = 25,
  activeSubjectTitle = 'Advanced Algorithms',
  activeChapterTitle = 'Dynamic Programming',
  codingCount = 0,
  quizCount = 0,
  streak = 1,
  totalXP = 0
}) {
  const systemInstruction = `You are ASCENDRA's Chief Academic AI Strategist.
Generate a concise, high-impact telemetry briefing for student "${userName}".
Output strict JSON with exact keys:
{
  "greetingInsight": "1-2 sentence personalized observation about their pace or streak.",
  "priorityFocus": "Short title of the single most important skill/topic to tackle next.",
  "priorityReason": "1 sentence why this topic is critical for upcoming technical benchmarks.",
  "dailyTargetMinutes": 25,
  "confidenceScore": 88
}`;

  const prompt = `Student Stats:
- Name: ${userName}
- Lessons Finished: ${completedLessonsCount} / ${totalLessonsCount}
- Active Module: ${activeSubjectTitle} › ${activeChapterTitle}
- CodeLab Solved: ${codingCount}
- Quizzes Completed: ${quizCount}
- Learning Streak: ${streak} Days
- Total XP: ${totalXP}`;

  try {
    const rawText = await askGemini({
      systemInstruction,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      temperature: 0.7,
      maxOutputTokens: 512,
    });

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('[GeminiService] Dashboard AI insight fallback:', e.message);
  }

  return {
    greetingInsight: `You are on a strong ${streak}-day momentum streak! Focus on ${activeChapterTitle} to maintain your technical growth curve.`,
    priorityFocus: `${activeChapterTitle} Mastery`,
    priorityReason: `Mastering core patterns in ${activeSubjectTitle} will directly increase your placement readiness score.`,
    dailyTargetMinutes: 20,
    confidenceScore: Math.min(96, 70 + completedLessonsCount * 3)
  };
}

