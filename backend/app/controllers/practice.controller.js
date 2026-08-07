const BaseController = require('./base.controller');
const { practiceService } = require('../services/practice.service');

class PracticeController extends BaseController {
  constructor() {
    super();
    this.getAdaptiveDifficulty = this.asyncHandler(this.getAdaptiveDifficulty.bind(this));
    this.submitAssessment = this.asyncHandler(this.submitAssessment.bind(this));
    this.getPendingRetries = this.asyncHandler(this.getPendingRetries.bind(this));
    this.getWeakTopics = this.asyncHandler(this.getWeakTopics.bind(this));
    this.explainAnswer = this.asyncHandler(this.explainAnswer.bind(this));
  }

  /**
   * @route GET /api/v1/practice/adaptive-difficulty
   */
  async getAdaptiveDifficulty(req, res) {
    const { consecutiveCorrect, currentDifficulty } = req.query;
    const nextDifficulty = practiceService.getAdaptiveNextDifficulty(
      parseInt(consecutiveCorrect || '0', 10),
      currentDifficulty || 'Medium'
    );
    return this.sendSuccess(res, { nextDifficulty }, 'Adaptive difficulty calculated');
  }

  /**
   * @route POST /api/v1/practice/submit
   */
  async submitAssessment(req, res) {
    const userId = req.user._id || req.user.id;
    const resultData = await practiceService.processAssessmentSubmission(userId, req.body);
    return this.sendCreated(res, resultData, 'Assessment submitted and metrics updated');
  }

  /**
   * @route GET /api/v1/practice/retry-queue
   */
  async getPendingRetries(req, res) {
    const userId = req.user._id || req.user.id;
    const retries = await practiceService.getPendingRetries(userId);
    return this.sendSuccess(res, { retries, count: retries.length }, 'Spaced repetition retry queue retrieved');
  }

  /**
   * @route GET /api/v1/practice/weak-topics
   */
  async getWeakTopics(req, res) {
    const userId = req.user._id || req.user.id;
    const topicData = await practiceService.calculateWeakTopics(userId);
    return this.sendSuccess(res, topicData, 'Weak & strong topics calculated');
  }

  /**
   * @route POST /api/v1/practice/explain-answer
   */
  async explainAnswer(req, res) {
    const { questionText, correctAnswer, userAnswer } = req.body;
    const explanation = practiceService.generateAiExplanation(questionText, correctAnswer, userAnswer);
    return this.sendSuccess(res, { explanation }, 'AI answer explanation generated');
  }
}

const practiceController = new PracticeController();
module.exports = {
  getAdaptiveDifficulty: practiceController.getAdaptiveDifficulty,
  submitAssessment: practiceController.submitAssessment,
  getPendingRetries: practiceController.getPendingRetries,
  getWeakTopics: practiceController.getWeakTopics,
  explainAnswer: practiceController.explainAnswer,
  practiceController
};
