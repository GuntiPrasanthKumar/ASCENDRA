const BaseController = require('./base.controller');
const { profileService, BADGES_CATALOG } = require('../services/profile.service');

class ProfileController extends BaseController {
  constructor() {
    super();
    this.getProfile = this.asyncHandler(this.getProfile.bind(this));
    this.updatePreferences = this.asyncHandler(this.updatePreferences.bind(this));
    this.getJourneyTimeline = this.asyncHandler(this.getJourneyTimeline.bind(this));
    this.logActivity = this.asyncHandler(this.logActivity.bind(this));
    this.getAchievements = this.asyncHandler(this.getAchievements.bind(this));
    this.evaluateAchievements = this.asyncHandler(this.evaluateAchievements.bind(this));
    this.getStatistics = this.asyncHandler(this.getStatistics.bind(this));
    this.getAiMemory = this.asyncHandler(this.getAiMemory.bind(this));
    this.addAiNote = this.asyncHandler(this.addAiNote.bind(this));
    this.getRecommendationContext = this.asyncHandler(this.getRecommendationContext.bind(this));
  }

  /**
   * @route GET /api/v1/profile/me
   */
  async getProfile(req, res) {
    const userId = req.user._id || req.user.id;
    const data = await profileService.getProfileByUserId(userId);
    return this.sendSuccess(res, data, 'Student profile single source of truth retrieved');
  }

  /**
   * @route PATCH /api/v1/profile/preferences
   */
  async updatePreferences(req, res) {
    const userId = req.user._id || req.user.id;
    const profile = await profileService.updatePreferences(userId, req.body);
    return this.sendSuccess(res, { profile }, 'Profile preferences updated successfully');
  }

  /**
   * @route GET /api/v1/profile/journey
   */
  async getJourneyTimeline(req, res) {
    const userId = req.user._id || req.user.id;
    const { page, limit, module } = req.query;
    const data = await profileService.getJourneyTimeline(userId, { page, limit, module });
    return this.sendPaginated(res, data.activities, data.pagination, 'Unified journey timeline retrieved');
  }

  /**
   * @route POST /api/v1/profile/journey
   */
  async logActivity(req, res) {
    const userId = req.user._id || req.user.id;
    const { module, action, title, description, xpEarned, metadata } = req.body;
    const activity = await profileService.logJourneyActivity(userId, module, action, title, description, xpEarned, metadata);
    return this.sendCreated(res, { activity }, 'Journey activity logged');
  }

  /**
   * @route GET /api/v1/profile/achievements
   */
  async getAchievements(req, res) {
    const userId = req.user._id || req.user.id;
    const profileData = await profileService.getProfileByUserId(userId);
    const unlocked = profileData.profile.achievements;
    const unlockedIds = new Set(unlocked.map(a => a.badgeId));

    const allBadges = BADGES_CATALOG.map(b => ({
      ...b,
      unlocked: unlockedIds.has(b.badgeId),
      unlockedAt: unlocked.find(a => a.badgeId === b.badgeId)?.unlockedAt || null
    }));

    return this.sendSuccess(res, { achievements: allBadges, unlockedCount: unlocked.length }, 'Achievements catalog retrieved');
  }

  /**
   * @route POST /api/v1/profile/achievements/evaluate
   */
  async evaluateAchievements(req, res) {
    const userId = req.user._id || req.user.id;
    const achievements = await profileService.evaluateAchievements(userId);
    return this.sendSuccess(res, { achievements }, 'Achievements evaluated successfully');
  }

  /**
   * @route GET /api/v1/profile/statistics
   */
  async getStatistics(req, res) {
    const userId = req.user._id || req.user.id;
    const profileData = await profileService.getProfileByUserId(userId);
    return this.sendSuccess(res, { statistics: profileData.profile.statistics }, 'Aggregated statistics retrieved');
  }

  /**
   * @route GET /api/v1/profile/ai-memory
   */
  async getAiMemory(req, res) {
    const userId = req.user._id || req.user.id;
    const aiMemory = await profileService.getAiMemoryContext(userId);
    return this.sendSuccess(res, { aiMemory }, 'AI Memory context retrieved');
  }

  /**
   * @route POST /api/v1/profile/ai-memory/note
   */
  async addAiNote(req, res) {
    const userId = req.user._id || req.user.id;
    const { note } = req.body;
    const notes = await profileService.addAiNote(userId, note);
    return this.sendSuccess(res, { notes }, 'AI Memory note added');
  }

  /**
   * @route GET /api/v1/profile/recommendation-context
   */
  async getRecommendationContext(req, res) {
    const userId = req.user._id || req.user.id;
    const recommendationProfile = await profileService.getRecommendationProfile(userId);
    return this.sendSuccess(res, { recommendationProfile }, 'Recommendation context extracted');
  }
}

const profileController = new ProfileController();
module.exports = {
  getProfile: profileController.getProfile,
  updatePreferences: profileController.updatePreferences,
  getJourneyTimeline: profileController.getJourneyTimeline,
  logActivity: profileController.logActivity,
  getAchievements: profileController.getAchievements,
  evaluateAchievements: profileController.evaluateAchievements,
  getStatistics: profileController.getStatistics,
  getAiMemory: profileController.getAiMemory,
  addAiNote: profileController.addAiNote,
  getRecommendationContext: profileController.getRecommendationContext,
  profileController
};
