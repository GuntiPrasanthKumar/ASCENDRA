const BaseController = require('./base.controller');
const { authService } = require('../services/auth.service');
const User = require('../models/User.model');

class AuthController extends BaseController {
  constructor() {
    super();
    this.register = this.asyncHandler(this.register.bind(this));
    this.login = this.asyncHandler(this.login.bind(this));
    this.faceLogin = this.asyncHandler(this.faceLogin.bind(this));
    this.enrollFace = this.asyncHandler(this.enrollFace.bind(this));
    this.refreshToken = this.asyncHandler(this.refreshToken.bind(this));
    this.logout = this.asyncHandler(this.logout.bind(this));
    this.getSessions = this.asyncHandler(this.getSessions.bind(this));
    this.revokeSession = this.asyncHandler(this.revokeSession.bind(this));
    this.revokeOtherSessions = this.asyncHandler(this.revokeOtherSessions.bind(this));
    this.forgotPassword = this.asyncHandler(this.forgotPassword.bind(this));
    this.resetPassword = this.asyncHandler(this.resetPassword.bind(this));
    this.getMe = this.asyncHandler(this.getMe.bind(this));
  }

  extractRequestContext(req) {
    return {
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Browser',
      deviceId: req.headers['x-device-id'] || 'browser_client'
    };
  }

  /**
   * @route POST /api/auth/register
   */
  async register(req, res) {
    const reqContext = this.extractRequestContext(req);
    const result = await authService.register(req.body, reqContext);
    
    // Retain exact backward-compatible response shape
    return res.status(201).json({
      message: 'Registration successful',
      token: result.token,
      refreshToken: result.refreshToken,
      user: result.user
    });
  }

  /**
   * @route POST /api/auth/login
   */
  async login(req, res) {
    const { email, password, rememberMe } = req.body;
    const reqContext = this.extractRequestContext(req);
    const result = await authService.login(email, password, reqContext, rememberMe);

    // Retain exact backward-compatible response shape
    return res.status(200).json({
      message: 'Login successful',
      token: result.token,
      refreshToken: result.refreshToken,
      user: result.user
    });
  }

  /**
   * @route POST /api/auth/face-login
   */
  async faceLogin(req, res) {
    const { email, faceDescriptor } = req.body;
    const reqContext = this.extractRequestContext(req);
    const result = await authService.faceLogin(email, faceDescriptor, reqContext);

    // Retain exact backward-compatible response shape
    return res.status(200).json({
      message: 'Face login successful',
      token: result.token,
      refreshToken: result.refreshToken,
      user: result.user
    });
  }

  /**
   * @route POST /api/auth/face-enroll
   */
  async enrollFace(req, res) {
    const userId = req.user._id || req.user.id;
    const { faceDescriptor, modelVersion } = req.body;
    const result = await authService.enrollFace(userId, faceDescriptor, modelVersion);
    return this.sendSuccess(res, result, 'Face profile enrolled successfully');
  }

  /**
   * @route POST /api/auth/refresh
   */
  async refreshToken(req, res) {
    const { refreshToken } = req.body;
    const reqContext = this.extractRequestContext(req);
    const result = await authService.refreshSession(refreshToken, reqContext);
    return this.sendSuccess(res, result, 'Token refreshed successfully');
  }

  /**
   * @route POST /api/auth/logout
   */
  async logout(req, res) {
    const { refreshToken } = req.body;
    await authService.logoutSession(refreshToken);
    return this.sendSuccess(res, null, 'Logged out successfully');
  }

  /**
   * @route GET /api/auth/sessions
   */
  async getSessions(req, res) {
    const userId = req.user._id || req.user.id;
    const sessions = await authService.getUserSessions(userId);
    return this.sendSuccess(res, { sessions }, 'Active sessions retrieved successfully');
  }

  /**
   * @route DELETE /api/auth/sessions/:sessionId
   */
  async revokeSession(req, res) {
    const userId = req.user._id || req.user.id;
    const { sessionId } = req.params;
    await authService.revokeSession(userId, sessionId);
    return this.sendSuccess(res, null, 'Session revoked successfully');
  }

  /**
   * @route DELETE /api/auth/sessions
   */
  async revokeOtherSessions(req, res) {
    const userId = req.user._id || req.user.id;
    const { currentSessionId } = req.body;
    await authService.revokeOtherSessions(userId, currentSessionId);
    return this.sendSuccess(res, null, 'All other sessions revoked successfully');
  }

  /**
   * @route POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return this.sendSuccess(res, result, result.message);
  }

  /**
   * @route POST /api/auth/reset-password
   */
  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    return this.sendSuccess(res, result, result.message);
  }

  /**
   * @route GET /api/auth/me
   */
  async getMe(req, res) {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId).select('-password_hash');
    return res.json(user);
  }
}

const authController = new AuthController();
module.exports = {
  register: authController.register,
  login: authController.login,
  faceLogin: authController.faceLogin,
  enrollFace: authController.enrollFace,
  refreshToken: authController.refreshToken,
  logout: authController.logout,
  getSessions: authController.getSessions,
  revokeSession: authController.revokeSession,
  revokeOtherSessions: authController.revokeOtherSessions,
  forgotPassword: authController.forgotPassword,
  resetPassword: authController.resetPassword,
  getMe: authController.getMe,
  authController
};
