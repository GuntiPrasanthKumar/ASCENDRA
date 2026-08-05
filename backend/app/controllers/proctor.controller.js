const FaceProfile = require('../models/FaceProfile.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const { encryptEmbedding, decryptEmbedding, cosineSimilarity } = require('../utils/crypto.utils');

const SIMILARITY_THRESHOLD = 0.60;
const EXPECTED_DIMENSION = 512;
const EXPECTED_MODEL_VERSION = 'mediapipe-face-embedder-v1';

// Rate limiting memory map: userId -> lastVerifyTimestamp
const verifyRateLimitMap = new Map();

/**
 * @desc    Enroll User Biometric Face Profile
 * @route   POST /api/proctor/enroll
 * @access  Private
 */
exports.enrollFaceProfile = async (req, res, next) => {
  try {
    const { embedding, modelVersion } = req.body;

    if (!Array.isArray(embedding) || embedding.length !== EXPECTED_DIMENSION) {
      return res.status(400).json({ 
        success: false, 
        error: `Embedding must be a float array of length ${EXPECTED_DIMENSION}` 
      });
    }

    if (modelVersion && modelVersion !== EXPECTED_MODEL_VERSION) {
      return res.status(400).json({ 
        success: false, 
        error: `Model version must be '${EXPECTED_MODEL_VERSION}'` 
      });
    }

    const { ciphertext, iv, authTag } = encryptEmbedding(embedding);

    const faceProfile = await FaceProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        embeddingCipher: ciphertext,
        iv: iv,
        authTag: authTag,
        embeddingModelVersion: EXPECTED_MODEL_VERSION,
        enrolledAt: new Date(),
        lastVerifiedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`[AUDIT LOG] User ${req.user._id} enrolled biometric FaceProfile successfully.`);

    return res.status(200).json({
      success: true,
      enrolledAt: faceProfile.enrolledAt.toISOString()
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Verify Live Biometric Face Embedding against Enrolled Profile
 * @route   POST /api/proctor/verify
 * @access  Private (Active Session Scoped)
 */
exports.verifyIdentity = async (req, res, next) => {
  try {
    const { sessionId, embedding, modelVersion } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required for verification' });
    }

    if (!Array.isArray(embedding) || embedding.length !== EXPECTED_DIMENSION) {
      return res.status(400).json({ 
        success: false, 
        error: `Embedding must be a float array of length ${EXPECTED_DIMENSION}` 
      });
    }

    // Rate limiting: 1 verify call per 5 seconds per user
    const lastCall = verifyRateLimitMap.get(String(req.user._id)) || 0;
    const now = Date.now();
    if (now - lastCall < 5000) {
      return res.status(429).json({ success: false, error: 'Verification rate limit exceeded. Try again in a few seconds.' });
    }
    verifyRateLimitMap.set(String(req.user._id), now);

    const faceProfile = await FaceProfile.findOne({ userId: req.user._id });
    if (!faceProfile) {
      return res.status(404).json({ 
        match: false, 
        similarityScore: 0, 
        error: 'No enrolled face profile found. Please complete face enrollment.' 
      });
    }

    const enrolledEmbedding = decryptEmbedding(
      faceProfile.embeddingCipher, 
      faceProfile.iv, 
      faceProfile.authTag
    );

    const score = cosineSimilarity(enrolledEmbedding, embedding);
    const isMatch = score >= SIMILARITY_THRESHOLD;

    faceProfile.lastVerifiedAt = new Date();
    await faceProfile.save();

    if (!isMatch) {
      console.warn(`[AUDIT LOG] Identity Mismatch for user ${req.user._id} on session ${sessionId}. Similarity: ${score.toFixed(4)} (Threshold: ${SIMILARITY_THRESHOLD})`);
      
      // Update or create AssessmentResult violation record
      await AssessmentResult.findOneAndUpdate(
        { _id: sessionId, user: req.user._id },
        { 
          $inc: { strikes: 1 },
          $push: {
            details: {
              question: 'IDENTITY_VERIFICATION',
              userAnswer: `Similarity: ${score.toFixed(4)}`,
              correctAnswer: `Threshold: ${SIMILARITY_THRESHOLD}`,
              isCorrect: false,
              explanation: 'Identity Mismatch: Different person detected'
            }
          }
        },
        { upsert: false }
      ).catch(() => {}); // Gracefully handle if session ID is dynamic client session string
    }

    return res.status(200).json({
      match: isMatch,
      similarityScore: parseFloat(score.toFixed(4))
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get Session Violations Timeline
 * @route   GET /api/proctor/violations/:sessionId
 * @access  Private
 */
exports.getViolations = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const result = await AssessmentResult.findById(sessionId);

    if (!result) {
      return res.status(200).json({ success: true, strikes: 0, violations: [] });
    }

    return res.status(200).json({
      success: true,
      strikes: result.strikes,
      violations: result.details || []
    });
  } catch (err) {
    next(err);
  }
};
