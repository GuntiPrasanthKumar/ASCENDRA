const BaseController = require('./base.controller');
const { assessmentEngineService } = require('../services/assessment.service');

class AssessmentEngineController extends BaseController {
  constructor() {
    super();
    this.startAssessment = this.asyncHandler(this.startAssessment.bind(this));
    this.autoSaveProgress = this.asyncHandler(this.autoSaveProgress.bind(this));
    this.recoverSession = this.asyncHandler(this.recoverSession.bind(this));
    this.submitAssessment = this.asyncHandler(this.submitAssessment.bind(this));
    this.getReview = this.asyncHandler(this.getReview.bind(this));
  }

  /**
   * @route POST /api/v1/assessment/start
   */
  async startAssessment(req, res) {
    const userId = req.user._id || req.user.id;
    const session = await assessmentEngineService.startAssessment(userId, req.body);
    return this.sendCreated(res, session, 'Assessment session initialized successfully');
  }

  /**
   * @route POST /api/v1/assessment/autosave
   */
  async autoSaveProgress(req, res) {
    const userId = req.user._id || req.user.id;
    const { sessionId, answers } = req.body;
    const result = await assessmentEngineService.autoSaveProgress(userId, sessionId, answers);
    return this.sendSuccess(res, result, 'Assessment progress auto-saved');
  }

  /**
   * @route GET /api/v1/assessment/recover/:sessionId
   */
  async recoverSession(req, res) {
    const userId = req.user._id || req.user.id;
    const { sessionId } = req.params;
    const session = await assessmentEngineService.recoverSession(userId, sessionId);
    return this.sendSuccess(res, session, 'Session state recovered');
  }

  /**
   * @route POST /api/v1/assessment/submit
   */
  async submitAssessment(req, res) {
    const userId = req.user._id || req.user.id;
    const { sessionId } = req.body;
    const evaluation = await assessmentEngineService.evaluateAssessment(userId, sessionId);
    return this.sendSuccess(res, evaluation, 'Assessment submitted and evaluated successfully');
  }

  /**
   * @route GET /api/v1/assessment/review/:sessionId
   */
  async getReview(req, res) {
    const userId = req.user._id || req.user.id;
    const { sessionId } = req.params;
    const review = await assessmentEngineService.getReview(userId, sessionId);
    return this.sendSuccess(res, review, 'Assessment review details retrieved');
  }
}

const assessmentEngineController = new AssessmentEngineController();
module.exports = {
  startAssessment: assessmentEngineController.startAssessment,
  autoSaveProgress: assessmentEngineController.autoSaveProgress,
  recoverSession: assessmentEngineController.recoverSession,
  submitAssessment: assessmentEngineController.submitAssessment,
  getReview: assessmentEngineController.getReview,
  assessmentEngineController
};
