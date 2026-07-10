const { GoogleGenerativeAI } = require('@google/generative-ai');

const discoverKnowledgeAI = async (query) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Analyze the user's search query: "${query}".
    Identify the overarching academic/professional Domain (e.g., "Computer Science", "Physics", "Finance", "Network Security").
    Discover 6 to 8 critical, factual subtopics or concepts related to this query.
    
    Output strictly in the following JSON format:
    {
      "domain": "Discovered Domain Name",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3", "Subtopic 4", "Subtopic 5", "Subtopic 6"]
    }
    
    Return ONLY the JSON object. No markdown formatting like \`\`\`json or conversational text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.domain && Array.isArray(parsed.subtopics)) {
        return parsed;
      }
    }
    throw new Error('Invalid JSON format in AI discovery response');
  } catch (err) {
    console.error('Discovery AI failed:', err.message);
    throw err;
  }
};

const generateAssessmentAI = async (subject, topic) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Try models in order of preference
  const models = ['gemini-1.5-flash'];
  const allErrors = [];

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
        }
      });

      const prompt = `
        You are an expert academic examiner.
        Your task is to generate EXACTLY 20 UNIQUE, highly factual assessment questions for the topic "${topic}" within the domain "${subject}".
        
        CRITICAL RULES:
        1. Base every question on real facts, definitions, formulae, or case studies related to the topic.
        2. NEVER use generic repetitive phrasing. Each question must read like a real exam question (e.g., CBSE, University level).
        3. Follow Bloom's Taxonomy exactly.
        
        EXAMPLE GOOD QUESTION:
        { "type": "multiple_choice", "text": "Which algorithm technique divides a problem into smaller subproblems and combines the results?", "options": ["Dynamic Programming", "Divide and Conquer", "Greedy Method", "Backtracking"], "correctOptionIndex": 1, "bloomsLevel": "Remember", "explanation": "Divide and conquer works by recursively breaking down a problem into two or more sub-problems." }
        
        Question Distribution:
        - 10 Multiple Choice (MCQ): Mix of Remember, Understand, Analyze.
        - 5 Fill in the Blanks (FIB): Mix of Remember, Understand.
        - 5 Short Answer: Mix of Apply, Evaluate, Create.

        Output strictly as a JSON array of objects following this schema:
        [
          { "type": "multiple_choice", "text": "Specific factual question...", "options": ["A", "B", "C", "D"], "correctOptionIndex": 0, "bloomsLevel": "Remember", "explanation": "Detailed factual explanation." },
          { "type": "fill_in_the_blanks", "text": "Specific factual statement with a ___ in the middle.", "correctAnswer": "Exact word", "bloomsLevel": "Understand", "explanation": "Detailed factual explanation." },
          { "type": "short_answer", "text": "Specific analytical or creative question...", "correctAnswer": "Comprehensive but concise 1-2 line factual answer.", "bloomsLevel": "Analyze", "explanation": "Detailed factual explanation." }
        ]

        Return ONLY the JSON array. No markdown, no conversational text.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (parseErr) {
          console.error(`JSON Parse Error for ${modelName}:`, parseErr.message);
        }
      }
      throw new Error('Invalid JSON format in AI response');
    } catch (err) {
      console.error(`Model ${modelName} failed:`, err.message);
      allErrors.push(`[${modelName}]: ${err.message}`);
    }
  }

  throw new Error(`AI Models failed. Details: ${allErrors.join(' | ')}`);
};

module.exports = { generateAssessmentAI, discoverKnowledgeAI };
