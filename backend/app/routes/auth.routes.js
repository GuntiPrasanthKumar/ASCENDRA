const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  faceLogin, 
  enrollFace, 
  refreshToken, 
  logout, 
  getSessions, 
  revokeSession, 
  revokeOtherSessions, 
  forgotPassword, 
  resetPassword, 
  getMe 
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const rateLimiterMiddleware = require('../middleware/rateLimiter.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

// Validation Schemas
const registerSchema = {
  name: { required: true, type: 'string', minLength: 2 },
  email: { required: true, type: 'string', email: true },
  password: { required: false, type: 'string', minLength: 6 }
};

const loginSchema = {
  email: { required: true, type: 'string', email: true },
  password: { required: true, type: 'string' }
};

const faceLoginSchema = {
  email: { required: true, type: 'string', email: true },
  faceDescriptor: { required: true, type: 'array' }
};

// Rate-limited Auth Endpoints
const strictRateLimiter = rateLimiterMiddleware({ windowMs: 15 * 60 * 1000, max: 20 });

// Core Authentication Routes (Backward Compatible)
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', strictRateLimiter, validateRequest(loginSchema), login);
router.post('/face-login', strictRateLimiter, validateRequest(faceLoginSchema), faceLogin);
router.post('/face-enroll', protect, enrollFace);
router.get('/me', protect, getMe);

// Enterprise Token & Session Management Routes
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/sessions', protect, getSessions);
router.delete('/sessions/:sessionId', protect, revokeSession);
router.delete('/sessions', protect, revokeOtherSessions);

// Enterprise Password Reset Routes
router.post('/forgot-password', strictRateLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Legacy Utility Route
router.get('/users-list', async (req, res) => {
  const User = require('../models/User.model');
  const users = await User.find({}, 'name email department faceImage createdAt');
  res.json({
    count: users.length,
    users: users.map(u => ({
      name: u.name,
      email: u.email,
      hasFace: !!u.faceImage,
      created: u.createdAt
    }))
  });
});

module.exports = router;
