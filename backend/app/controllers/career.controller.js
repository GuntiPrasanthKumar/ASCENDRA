const Resume = require('../models/Resume.model');
const ATSEngine = require('../services/career/ATSEngine');
const GitHubAnalyzer = require('../services/career/GitHubAnalyzer');
const SkillGapEngine = require('../services/career/SkillGapEngine');
const AIService = require('../ai/AIService');
const AIGateway = require('../ai/AIGateway');
const ResponseFormatter = require('../ai/ResponseFormatter');

/**
 * @desc    Analyze Resume with ATS Engine & AI Insights
 * @route   POST /api/career/ats/analyze
 * @access  Private
 */
exports.analyzeATS = async (req, res, next) => {
  try {
    const { resumeText, targetRole } = req.body;
    const userId = req.user._id;

    const evaluation = ATSEngine.evaluateResume(resumeText, targetRole || 'Full Stack Engineer');

    try {
      const prompt = `
Analyze the following candidate resume for target role "${targetRole || 'Full Stack Engineer'}":
\`\`\`
${(resumeText || '').substring(0, 1500)}
\`\`\`

Provide detailed ATS suggestions strictly in JSON format:
{
  "summary": "1-2 sentence executive feedback",
  "strengths": ["Strength 1", "Strength 2"],
  "formattingTips": ["Tip 1", "Tip 2"]
}
`;
      const aiRes = await AIGateway.processRequest({
        userId,
        promptType: 'ats_review',
        prompt,
        isJson: true,
        useCache: true
      });

      if (aiRes.success && aiRes.data) {
        evaluation.aiSummary = aiRes.data.summary;
        evaluation.aiStrengths = aiRes.data.strengths;
        evaluation.aiFormattingTips = aiRes.data.formattingTips;
      }
    } catch (aiErr) {
      console.warn('[Career] AI ATS analysis fallback:', aiErr.message);
    }

    return res.status(200).json(ResponseFormatter.formatSuccess(evaluation));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Save / Version Resume Draft
 * @route   POST /api/career/resume/save
 * @access  Private
 */
exports.saveResume = async (req, res, next) => {
  try {
    const { title, content, targetRole, versionId } = req.body;
    const userId = req.user._id;

    const evaluation = ATSEngine.evaluateResume(content, targetRole);

    const versionItem = {
      versionId: versionId || `v-${Date.now()}`,
      title: title || 'Software Engineer Resume',
      content: content || '',
      targetRole: targetRole || 'Full Stack Engineer',
      atsScore: evaluation.atsScore,
      keywordsMatched: evaluation.keywordsMatched,
      missingKeywords: evaluation.missingKeywords,
      formattingRating: evaluation.formattingRating,
      createdAt: new Date()
    };

    const resumeDoc = await Resume.findOneAndUpdate(
      { userId },
      {
        userId,
        activeVersionId: versionItem.versionId,
        $push: { versions: versionItem },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      activeVersion: versionItem,
      totalVersions: resumeDoc.versions.length
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get GitHub Profile Intelligence
 * @route   GET /api/career/github/:handle
 * @access  Private
 */
exports.getGitHubAnalysis = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const analysis = GitHubAnalyzer.analyzeProfile(handle || 'vjkiran');

    return res.status(200).json(ResponseFormatter.formatSuccess(analysis));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Analyze Skill Gaps against Role
 * @route   POST /api/career/skill-gap
 * @access  Private
 */
exports.getSkillGaps = async (req, res, next) => {
  try {
    const { candidateSkills, targetRole } = req.body;
    const gapAnalysis = SkillGapEngine.analyzeSkillGaps(candidateSkills || ['JavaScript', 'React', 'Algorithms'], targetRole || 'Full Stack Engineer');

    return res.status(200).json(ResponseFormatter.formatSuccess(gapAnalysis));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Multi-Phase Career Roadmap Timeline
 * @route   GET /api/career/roadmap
 * @access  Private
 */
exports.getRoadmap = async (req, res, next) => {
  try {
    const roadmap = {
      role: 'Full Stack AI Software Engineer',
      phases: [
        {
          phase: 1,
          title: 'Core Fundamentals & Algorithmic Proficiency',
          status: 'COMPLETED',
          topics: ['Data Structures & Algorithms', 'Python3 & ES6+ JavaScript', 'Recursion & Dynamic Programming']
        },
        {
          phase: 2,
          title: 'Enterprise System Architecture & AI Engineering',
          status: 'IN_PROGRESS',
          topics: ['Distributed Systems', 'MediaPipe Biometric Proctoring', 'REST & SSE Streaming AI Core']
        },
        {
          phase: 3,
          title: 'Placement Rehearsals & Executive Portfolio Polish',
          status: 'UPCOMING',
          topics: ['FAANG Mock Interview Studio', 'ATS Resume Optimization', 'Verified Portfolio Dossier']
        }
      ]
    };

    return res.status(200).json(ResponseFormatter.formatSuccess(roadmap));
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Overall Job Readiness & Company Target Match Scores
 * @route   GET /api/career/readiness
 * @access  Private
 */
exports.getJobReadiness = async (req, res, next) => {
  try {
    const readiness = {
      overallJobReadinessScore: 88,
      readinessStatus: 'PLACEMENENT_READY',
      companyReadiness: [
        { companyName: 'Google', matchPercentage: 86, status: 'READY' },
        { companyName: 'Microsoft', matchPercentage: 92, status: 'READY' },
        { companyName: 'Amazon', matchPercentage: 88, status: 'READY' },
        { companyName: 'Stripe', matchPercentage: 90, status: 'READY' }
      ]
    };

    return res.status(200).json(ResponseFormatter.formatSuccess(readiness));
  } catch (err) {
    next(err);
  }
};
