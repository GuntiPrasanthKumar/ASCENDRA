const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');
const FaceProfile = require('../models/FaceProfile.model');
const Session = require('../models/Session.model');
const LoginHistory = require('../models/LoginHistory.model');
const PasswordResetToken = require('../models/PasswordResetToken.model');
const { encryptEmbedding, decryptEmbedding, cosineSimilarity } = require('../utils/crypto.utils');
const { config } = require('../config/env.config');
const logger = require('../core/logger/logger');
const { eventBus, DOMAIN_EVENTS } = require('../core/events/event.bus');
const { 
  ValidationError, UnauthorizedError, NotFoundError, ConflictError, ForbiddenError 
} = require('../core/errors/app.error');

class AuthService {
  // Generate Access Token (JWT)
  generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, userId: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire || '2h' }
    );
  }

  // Generate Opaque Refresh Token
  generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }

  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  // Create Session and Refresh Token Pair
  async createSession(user, reqContext = {}, rememberMe = false) {
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    const durationDays = rememberMe ? 30 : 7;
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      userId: user._id,
      refreshTokenHash,
      ipAddress: reqContext.ip || '127.0.0.1',
      userAgent: reqContext.userAgent || 'Unknown Browser',
      deviceId: reqContext.deviceId || 'browser_client',
      expiresAt
    });

    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      refreshToken,
      sessionId: session._id,
      expiresAt: session.expiresAt
    };
  }

  // Record Login Audit Trail
  async recordLoginHistory(userId, email, method, status, reqContext = {}, failureReason = null) {
    await LoginHistory.create({
      userId: userId || null,
      email: email.toLowerCase().trim(),
      method,
      status,
      ipAddress: reqContext.ip || '127.0.0.1',
      userAgent: reqContext.userAgent || 'Unknown',
      failureReason
    });
  }

  // Register New User
  async register(data, reqContext = {}) {
    const { name, email, password, department, role, faceDescriptor } = data;

    if (!name || !email) {
      throw new ValidationError('Name and email are required fields');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      throw new ConflictError('Email address is already registered');
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      department: department || 'CSE',
      role: role || 'Student',
      faceDescriptor: Array.isArray(faceDescriptor) ? faceDescriptor : []
    });

    const savedUser = await user.save();

    // If faceDescriptor provided during registration, encrypt and enroll in FaceProfile
    if (Array.isArray(faceDescriptor) && faceDescriptor.length === 512) {
      const { ciphertext, iv, authTag } = encryptEmbedding(faceDescriptor);
      await FaceProfile.create({
        userId: savedUser._id,
        embeddingCipher: ciphertext,
        iv,
        authTag,
        embeddingModelVersion: 'mediapipe-face-embedder-v1'
      });
      eventBus.publish('auth.face_enrolled', { userId: savedUser._id });
    }

    const sessionData = await this.createSession(savedUser, reqContext);
    await this.recordLoginHistory(savedUser._id, savedUser.email, 'PASSWORD', 'SUCCESS', reqContext);

    eventBus.publish(DOMAIN_EVENTS.USER_REGISTERED, {
      userId: savedUser._id,
      email: savedUser.email,
      role: savedUser.role
    });

    return {
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        department: savedUser.department
      },
      token: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      sessionId: sessionData.sessionId
    };
  }

  // Password Authentication Login with Brute-Force Lockout
  async login(email, password, reqContext = {}, rememberMe = false) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      await this.recordLoginHistory(null, email, 'PASSWORD', 'FAILED', reqContext, 'User not found');
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check brute-force lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockoutUntil - new Date()) / 60000);
      await this.recordLoginHistory(user._id, user.email, 'PASSWORD', 'LOCKED_OUT', reqContext, `Locked out for ${remainingMinutes}m`);
      throw new ForbiddenError(`Account temporarily locked due to multiple failed attempts. Try again in ${remainingMinutes} minutes.`);
    }

    const isMatch = user.password_hash ? await bcrypt.compare(password, user.password_hash) : false;

    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
        logger.warn(`[SECURITY LOCKOUT] User ${user.email} locked out for 15 minutes due to 5 failed password attempts`);
      }
      await user.save();
      await this.recordLoginHistory(user._id, user.email, 'PASSWORD', 'FAILED', reqContext, 'Invalid password');
      eventBus.publish('auth.failed_login_attempt', { userId: user._id, email: user.email, attempts: user.failedLoginAttempts });

      throw new UnauthorizedError('Invalid email or password');
    }

    // Reset failed login counter on success
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.last_active = new Date();
    await user.save();

    const sessionData = await this.createSession(user, reqContext, rememberMe);
    await this.recordLoginHistory(user._id, user.email, 'PASSWORD', 'SUCCESS', reqContext);

    eventBus.publish(DOMAIN_EVENTS.USER_LOGGED_IN, {
      userId: user._id,
      email: user.email,
      method: 'PASSWORD'
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      token: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      sessionId: sessionData.sessionId
    };
  }

  // Face Biometric Login
  async faceLogin(email, faceDescriptor, reqContext = {}) {
    if (!email || !Array.isArray(faceDescriptor)) {
      throw new ValidationError('Email and face vector descriptor are required');
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      await this.recordLoginHistory(null, email, 'FACE', 'FAILED', reqContext, 'User not found');
      throw new NotFoundError('User not found');
    }

    let isMatch = false;

    // Verify encrypted FaceProfile first (MediaPipe 512-float vector)
    const faceProfile = await FaceProfile.findOne({ userId: user._id });
    if (faceProfile && faceDescriptor.length === 512) {
      try {
        const enrolledEmbedding = decryptEmbedding(
          faceProfile.embeddingCipher,
          faceProfile.iv,
          faceProfile.authTag
        );
        const score = cosineSimilarity(enrolledEmbedding, faceDescriptor);
        if (score >= 0.60) {
          isMatch = true;
          faceProfile.lastVerifiedAt = new Date();
          await faceProfile.save();
        }
      } catch (decryptErr) {
        logger.error(`FaceProfile decryption failure for user ${user._id}`, { error: decryptErr.message });
      }
    }

    // Fallback: check legacy user.faceDescriptor
    if (!isMatch && user.faceDescriptor && user.faceDescriptor.length > 0) {
      let sum = 0;
      for (let i = 0; i < Math.min(user.faceDescriptor.length, faceDescriptor.length); i++) {
        sum += Math.pow(user.faceDescriptor[i] - faceDescriptor[i], 2);
      }
      const distance = Math.sqrt(sum);
      if (distance <= 0.60) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      await this.recordLoginHistory(user._id, user.email, 'FACE', 'FAILED', reqContext, 'Face biometric mismatch');
      throw new UnauthorizedError('Face identity not recognized');
    }

    user.last_active = new Date();
    await user.save();

    const sessionData = await this.createSession(user, reqContext);
    await this.recordLoginHistory(user._id, user.email, 'FACE', 'SUCCESS', reqContext);

    eventBus.publish('auth.face_verified', { userId: user._id });
    eventBus.publish(DOMAIN_EVENTS.USER_LOGGED_IN, { userId: user._id, email: user.email, method: 'FACE' });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      token: sessionData.accessToken,
      refreshToken: sessionData.refreshToken,
      sessionId: sessionData.sessionId
    };
  }

  // Enroll Encrypted Face Biometric Profile
  async enrollFace(userId, faceDescriptor, modelVersion = 'mediapipe-face-embedder-v1') {
    if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 512) {
      throw new ValidationError('Face descriptor must be a 512-float vector array');
    }

    const { ciphertext, iv, authTag } = encryptEmbedding(faceDescriptor);

    const faceProfile = await FaceProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        embeddingCipher: ciphertext,
        iv,
        authTag,
        embeddingModelVersion: modelVersion,
        enrolledAt: new Date(),
        lastVerifiedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    eventBus.publish('auth.face_enrolled', { userId, enrolledAt: faceProfile.enrolledAt });
    logger.info(`[BIOMETRIC ENROLLMENT] User ${userId} successfully enrolled encrypted 512d face vector`);

    return {
      success: true,
      enrolledAt: faceProfile.enrolledAt.toISOString()
    };
  }

  // Refresh Token Rotation
  async refreshSession(refreshToken, reqContext = {}) {
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    const refreshTokenHash = this.hashToken(refreshToken);
    const session = await Session.findOne({ refreshTokenHash, isRevoked: false });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw new UnauthorizedError('User associated with session no longer exists');
    }

    // Revoke old session token (Rotation)
    session.isRevoked = true;
    await session.save();

    // Issue new session & token pair
    const newSessionData = await this.createSession(user, reqContext);
    await this.recordLoginHistory(user._id, user.email, 'REFRESH_TOKEN', 'SUCCESS', reqContext);

    return {
      token: newSessionData.accessToken,
      refreshToken: newSessionData.refreshToken,
      sessionId: newSessionData.sessionId
    };
  }

  // Logout / Revoke Single Session
  async logoutSession(refreshToken) {
    if (!refreshToken) return true;
    const refreshTokenHash = this.hashToken(refreshToken);
    const session = await Session.findOne({ refreshTokenHash });
    if (session) {
      session.isRevoked = true;
      await session.save();
      eventBus.publish('auth.session_revoked', { sessionId: session._id, userId: session.userId });
    }
    return true;
  }

  // List Active User Sessions
  async getUserSessions(userId) {
    return await Session.find({ userId, isRevoked: false })
      .select('deviceId ipAddress userAgent lastActiveAt expiresAt createdAt')
      .sort({ lastActiveAt: -1 });
  }

  // Revoke Specific Session
  async revokeSession(userId, sessionId) {
    const session = await Session.findOne({ _id: sessionId, userId });
    if (!session) {
      throw new NotFoundError('Session not found');
    }
    session.isRevoked = true;
    await session.save();
    eventBus.publish('auth.session_revoked', { sessionId, userId });
    return true;
  }

  // Revoke All Other Sessions
  async revokeOtherSessions(userId, currentSessionId) {
    await Session.updateMany(
      { userId, _id: { $ne: currentSessionId }, isRevoked: false },
      { $set: { isRevoked: true } }
    );
    return true;
  }

  // Request Password Reset
  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return { message: 'If email exists, password reset instructions have been generated.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt
    });

    logger.info(`[SECURITY EVENT] Password reset token generated for ${user.email}: ${resetToken}`);
    eventBus.publish('auth.password_reset_requested', { userId: user._id, email: user.email });

    return {
      message: 'Password reset token generated successfully',
      resetToken // Returned for local development/api usage
    };
  }

  // Reset Password
  async resetPassword(token, newPassword) {
    if (!token || !newPassword || newPassword.length < 6) {
      throw new ValidationError('Token and new password (min 6 characters) are required');
    }

    const tokenHash = this.hashToken(token);
    const resetRecord = await PasswordResetToken.findOne({
      tokenHash,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      throw new UnauthorizedError('Invalid or expired password reset token');
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    await user.save();

    resetRecord.isUsed = true;
    await resetRecord.save();

    // Revoke all active sessions on password change
    await Session.updateMany({ userId: user._id }, { $set: { isRevoked: true } });

    eventBus.publish('auth.password_reset', { userId: user._id, email: user.email });
    logger.info(`[SECURITY EVENT] Password reset completed successfully for ${user.email}`);

    return { success: true, message: 'Password reset successfully. Please log in with your new password.' };
  }
}

const authService = new AuthService();
module.exports = {
  authService,
  AuthService
};
