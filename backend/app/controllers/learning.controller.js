const BaseController = require('./base.controller');
const { learningService } = require('../services/learning.service');

class LearningController extends BaseController {
  constructor() {
    super();
    this.getLearningGraph = this.asyncHandler(this.getLearningGraph.bind(this));
    this.recordProgress = this.asyncHandler(this.recordProgress.bind(this));
    this.getResumeLearning = this.asyncHandler(this.getResumeLearning.bind(this));
    this.createGoal = this.asyncHandler(this.createGoal.bind(this));
    this.getGoals = this.asyncHandler(this.getGoals.bind(this));
    this.createNote = this.asyncHandler(this.createNote.bind(this));
    this.getNotes = this.asyncHandler(this.getNotes.bind(this));
    this.toggleBookmark = this.asyncHandler(this.toggleBookmark.bind(this));
    this.getBookmarks = this.asyncHandler(this.getBookmarks.bind(this));
    this.getRecommendations = this.asyncHandler(this.getRecommendations.bind(this));
  }

  /**
   * @route GET /api/v1/learning/graph
   */
  async getLearningGraph(req, res) {
    const userId = req.user._id || req.user.id;
    const { subjectId } = req.query;
    const graph = await learningService.getLearningGraph(userId, subjectId);
    return this.sendSuccess(res, { graph }, 'Learning graph retrieved successfully');
  }

  /**
   * @route POST /api/v1/learning/progress
   */
  async recordProgress(req, res) {
    const userId = req.user._id || req.user.id;
    const progress = await learningService.recordProgress(userId, req.body);
    return this.sendSuccess(res, { progress }, 'Learning progress recorded');
  }

  /**
   * @route GET /api/v1/learning/resume
   */
  async getResumeLearning(req, res) {
    const userId = req.user._id || req.user.id;
    const resumeData = await learningService.getResumeLearning(userId);
    return this.sendSuccess(res, { resumeData }, 'Resume learning state retrieved');
  }

  /**
   * @route POST /api/v1/learning/goals
   */
  async createGoal(req, res) {
    const userId = req.user._id || req.user.id;
    const goal = await learningService.createGoal(userId, req.body);
    return this.sendCreated(res, { goal }, 'Learning goal created');
  }

  /**
   * @route GET /api/v1/learning/goals
   */
  async getGoals(req, res) {
    const userId = req.user._id || req.user.id;
    const goals = await learningService.getGoals(userId);
    return this.sendSuccess(res, { goals }, 'Learning goals retrieved');
  }

  /**
   * @route POST /api/v1/learning/notes
   */
  async createNote(req, res) {
    const userId = req.user._id || req.user.id;
    const note = await learningService.createNote(userId, req.body);
    return this.sendCreated(res, { note }, 'AI Note created successfully');
  }

  /**
   * @route GET /api/v1/learning/notes
   */
  async getNotes(req, res) {
    const userId = req.user._id || req.user.id;
    const { lessonId } = req.query;
    const notes = await learningService.getNotes(userId, lessonId);
    return this.sendSuccess(res, { notes }, 'Learning notes retrieved');
  }

  /**
   * @route POST /api/v1/learning/bookmarks
   */
  async toggleBookmark(req, res) {
    const userId = req.user._id || req.user.id;
    const result = await learningService.toggleBookmark(userId, req.body);
    return this.sendSuccess(res, result, result.message);
  }

  /**
   * @route GET /api/v1/learning/bookmarks
   */
  async getBookmarks(req, res) {
    const userId = req.user._id || req.user.id;
    const bookmarks = await learningService.getBookmarks(userId);
    return this.sendSuccess(res, { bookmarks }, 'Bookmarks retrieved');
  }

  /**
   * @route GET /api/v1/learning/recommendations
   */
  async getRecommendations(req, res) {
    const userId = req.user._id || req.user.id;
    const recommendations = await learningService.getRecommendations(userId);
    return this.sendSuccess(res, { recommendations }, 'Smart learning recommendations retrieved');
  }
}

const learningController = new LearningController();
module.exports = {
  getLearningGraph: learningController.getLearningGraph,
  recordProgress: learningController.recordProgress,
  getResumeLearning: learningController.getResumeLearning,
  createGoal: learningController.createGoal,
  getGoals: learningController.getGoals,
  createNote: learningController.createNote,
  getNotes: learningController.getNotes,
  toggleBookmark: learningController.toggleBookmark,
  getBookmarks: learningController.getBookmarks,
  getRecommendations: learningController.getRecommendations,
  learningController
};
