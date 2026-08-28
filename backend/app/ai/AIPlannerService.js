const mongoose = require('mongoose');
const AIMemory = require('../models/AIMemory.model');
const AIGateway = require('./AIGateway');

class AIPlannerService {
  async generateDailyPlan(userId) {
    let memory = null;

    try {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        memory = await AIMemory.findOne({ userId }).lean();
      }
    } catch (dbErr) {
      console.warn('[AIPlannerService] DB query warning:', dbErr.message);
    }

    if (!memory) {
      memory = {
        currentGoal: 'Full Stack Software Engineer',
        targetCompany: 'Tier 1 Tech',
        weakTopics: [{ topic: 'Dynamic Programming Knapsack' }],
        interviewHistory: { recommendedFocus: 'System Design & State Reduction' }
      };
    }

    try {
      const prompt = `
Generate a structured daily learning and practice plan for a student.
Target Goal: ${memory.currentGoal}
Target Company: ${memory.targetCompany}
Weak Subtopics: ${(memory.weakTopics || []).map(t => t.topic).join(', ') || 'General Algorithms'}
Interview Focus: ${memory.interviewHistory?.recommendedFocus || 'System Design'}

Return JSON format strictly:
{
  "date": "${new Date().toISOString().split('T')[0]}",
  "dailyGoal": "Master Dynamic Programming state reduction and complete 1 mock interview",
  "tasks": [
    { "id": "t1", "title": "Complete DP Memoization Lesson", "type": "LEARN", "duration": "25 mins", "action": "openLearningModule", "params": { "subjectId": "cs-101", "chapterId": "ch-2", "lessonId": "les-1" } },
    { "id": "t2", "title": "Solve 0/1 Knapsack Challenge", "type": "CODELAB", "duration": "30 mins", "action": "openCodeLabProblem", "params": { "problemId": "knapsack-01" } },
    { "id": "t3", "title": "Take Mock System Design Interview", "type": "INTERVIEW", "duration": "20 mins", "action": "scheduleInterview", "params": { "role": "${memory.currentGoal}", "company": "${memory.targetCompany}" } }
  ]
}
`;

      const aiRes = await AIGateway.processRequest({
        userId,
        promptType: 'ai_planner',
        prompt,
        isJson: true,
        useCache: true,
        cacheTtlMs: 3600 * 1000 // 1 hour
      });

      if (aiRes.success && aiRes.data && Array.isArray(aiRes.data.tasks)) {
        return aiRes.data;
      }
    } catch (err) {
      console.warn('[AIPlannerService] AI Gateway query warning:', err.message);
    }

    // Default Fallback Plan
    return {
      date: new Date().toISOString().split('T')[0],
      dailyGoal: "Master Dynamic Programming state reduction and complete 1 mock interview",
      tasks: [
        { id: "t1", title: "Complete DP Memoization Lesson", type: "LEARN", duration: "25 mins", action: "openLearningModule", params: { subjectId: "cs-101", chapterId: "ch-2", lessonId: "les-1" } },
        { id: "t2", title: "Solve 0/1 Knapsack Challenge", type: "CODELAB", duration: "30 mins", action: "openCodeLabProblem", params: { problemId: "knapsack-01" } },
        { id: "t3", title: "Take Mock System Design Interview", type: "INTERVIEW", duration: "20 mins", action: "scheduleInterview", params: { role: memory.currentGoal, company: memory.targetCompany } }
      ]
    };
  }
}

module.exports = new AIPlannerService();
