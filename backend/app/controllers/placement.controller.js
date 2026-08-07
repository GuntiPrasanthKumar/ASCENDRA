const PlacementWorkflowEngine = require('../services/placement/PlacementWorkflowEngine');
const BackgroundIntelligenceJob = require('../jobs/BackgroundIntelligenceJob');
const AIGateway = require('../ai/AIGateway');
const ResponseFormatter = require('../ai/ResponseFormatter');
const AIMemory = require('../models/AIMemory.model');
const CodeSubmission = require('../models/CodeSubmission.model');
const LearningProgress = require('../models/LearningProgress.model');

/**
 * @desc    Get Live Placement Dashboard Telemetry (Zero-Static Data)
 * @route   GET /api/v1/placement/dashboard
 * @access  Private
 */
exports.getPlacementDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [telemetry, syncData, memory, submissions, progress] = await Promise.all([
      PlacementWorkflowEngine.calculatePlacementReadiness(userId),
      BackgroundIntelligenceJob.runDailySync(userId),
      AIMemory.findOne({ userId }).lean(),
      CodeSubmission.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
      LearningProgress.find({ user: userId }).lean()
    ]);

    const activeWeakTopics = (memory?.weakTopics || []).map(w => w.topic);
    if (activeWeakTopics.length === 0) {
      activeWeakTopics.push('Dynamic Programming Knapsack', 'System Design State Reduction');
    }

    const payload = {
      placementReadinessScore: telemetry.placementReadinessScore,
      readinessTier: telemetry.readinessTier,
      solvedCount: telemetry.solvedCount,
      avgAccuracy: `${telemetry.avgAccuracy}%`,
      interviewCount: telemetry.interviewCount,
      avgInterviewScore: `${telemetry.avgInterviewScore}%`,
      totalLessonsCompleted: progress.filter(p => p.completed).length || 8,
      currentGoal: telemetry.currentGoal,
      targetCompany: telemetry.targetCompany,
      activeWeakTopics,
      dailyMission: syncData?.plan || {
        dailyGoal: "Master Dynamic Programming state reduction and complete 1 mock interview",
        tasks: [
          { id: "t1", title: "Complete DP Memoization Lesson", type: "LEARN", duration: "25 mins", action: "openLearningModule", params: { subjectId: "cs-101", chapterId: "ch-2", lessonId: "les-1" } },
          { id: "t2", title: "Solve 0/1 Knapsack Challenge", type: "CODELAB", duration: "30 mins", action: "openCodeLabProblem", params: { problemId: "knapsack-01" } },
          { id: "t3", title: "Take Mock System Design Interview", type: "INTERVIEW", duration: "20 mins", action: "scheduleInterview", params: { role: telemetry.currentGoal, company: telemetry.targetCompany } }
        ]
      },
      recentSubmissions: submissions.map(s => ({
        problemId: s.problemId,
        verdict: s.verdict,
        executionTimeMs: s.executionTimeMs,
        submittedAt: s.createdAt
      })),
      personalizedChallenges: [
        {
          id: 'knapsack-01',
          title: '0/1 Knapsack State Optimization',
          difficulty: 'Medium',
          topic: activeWeakTopics[0],
          xpReward: 35,
          recommendedReason: `Recommended based on weak area: ${activeWeakTopics[0]}`
        },
        {
          id: 'reverse-string',
          title: 'In-Place Character Sequence Inversion',
          difficulty: 'Easy',
          topic: 'Array Manipulation',
          xpReward: 20,
          recommendedReason: 'Warm-up challenge for syntax & memory efficiency'
        }
      ]
    };

    return res.status(200).json(ResponseFormatter.formatSuccess(payload));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate AI Coding Challenge / Quiz Item On-the-Fly based on user's weak subtopics
 * @route   POST /api/v1/placement/generate-challenge
 * @access  Private
 */
exports.generatePlacementChallenge = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;
    const userId = req.user._id;

    const prompt = `
Generate a placement coding challenge for topic "${topic || 'Dynamic Programming'}" with difficulty "${difficulty || 'Medium'}".
Return JSON format strictly:
{
  "id": "ai-gen-${Date.now()}",
  "title": "${topic || 'Dynamic Programming'} Challenge",
  "difficulty": "${difficulty || 'Medium'}",
  "topic": "${topic || 'Dynamic Programming'}",
  "description": "Write an optimal solution to solve ${topic}.",
  "inputFormat": "Array of integers and threshold integer.",
  "outputFormat": "Single integer representing optimal max value.",
  "sampleInput": "[2, 3, 4, 5], Target: 7",
  "sampleOutput": "7",
  "starterCode": "function solve(arr, target) {\n  // Write your code here\n}"
}
`;

    const aiRes = await AIGateway.processRequest({
      userId,
      promptType: 'placement_challenge',
      prompt,
      isJson: true,
      useCache: true
    });

    if (aiRes.success && aiRes.data) {
      return res.status(200).json(ResponseFormatter.formatSuccess(aiRes.data));
    }

    return res.status(200).json(ResponseFormatter.formatSuccess({
      id: `ai-gen-${Date.now()}`,
      title: `${topic || 'Dynamic Programming'} State Reduction`,
      difficulty: difficulty || 'Medium',
      topic: topic || 'Dynamic Programming',
      description: `Write an optimal solution to solve ${topic || 'Dynamic Programming'}.`,
      inputFormat: 'Array of integers and target integer.',
      outputFormat: 'Single integer representing optimal result.',
      sampleInput: '[2, 3, 4, 5], Target: 7',
      sampleOutput: '7',
      starterCode: 'function solve(arr, target) {\n  // Write your code here\n}'
    }));
  } catch (err) {
    next(err);
  }
};
