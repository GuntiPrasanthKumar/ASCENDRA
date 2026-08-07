const FaceProfile = require('../models/FaceProfile.model');
const AssessmentResult = require('../models/AssessmentResult.model');
const ProctorReport = require('../models/ProctorReport.model');
const { encryptEmbedding, decryptEmbedding, cosineSimilarity } = require('../utils/crypto.utils');

const SIMILARITY_THRESHOLD = 0.60;
const EXPECTED_DIMENSION = 512;
const EXPECTED_MODEL_VERSION = 'mediapipe-face-embedder-v1';

// In-memory rate limiting & evidence buffering
const verifyRateLimitMap = new Map();
const sessionEvidenceStore = new Map(); // sessionId -> Evidence Array

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
 * @desc    Verify Live Biometric Face Embedding against Enrolled Profile (Identity Engine)
 * @route   POST /api/proctor/verify
 * @access  Private (Active Session Scoped)
 */
exports.verifyIdentity = async (req, res, next) => {
  try {
    const { sessionId, embedding } = req.body;

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
      
      // Store evidence item
      const evidenceList = sessionEvidenceStore.get(sessionId) || [];
      evidenceList.push({
        evidenceId: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date(),
        engine: 'IDENTITY',
        violationType: 'IDENTITY_MISMATCH',
        severity: 'CRITICAL',
        metadata: { similarityScore: parseFloat(score.toFixed(4)), threshold: SIMILARITY_THRESHOLD }
      });
      sessionEvidenceStore.set(sessionId, evidenceList);

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
      ).catch(() => {});
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
 * @desc    Record Evidence Log Item (Identity, Behavior, Environment)
 * @route   POST /api/proctor/evidence
 * @access  Private
 */
exports.recordEvidence = async (req, res, next) => {
  try {
    const { sessionId, engine, violationType, severity, metadata } = req.body;

    if (!sessionId || !engine || !violationType) {
      return res.status(400).json({ success: false, error: 'sessionId, engine, and violationType are required.' });
    }

    const item = {
      evidenceId: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date(),
      engine: engine.toUpperCase(),
      violationType,
      severity: severity || 'MEDIUM',
      metadata: metadata || {}
    };

    const evidenceList = sessionEvidenceStore.get(sessionId) || [];
    evidenceList.push(item);
    sessionEvidenceStore.set(sessionId, evidenceList);

    return res.status(200).json({ success: true, recorded: item });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Generate / Save AI Integrity Report (Integrity Engine)
 * @route   POST /api/proctor/report
 * @access  Private
 */
exports.generateReport = async (req, res, next) => {
  try {
    const { 
      sessionId, subject, topic, integrityScore, riskStatus, 
      recommendation, strikes, categoryBreakdown, evidences 
    } = req.body;

    if (!sessionId || integrityScore === undefined) {
      return res.status(400).json({ success: false, error: 'sessionId and integrityScore are required.' });
    }

    // Merge in-memory evidence with client-submitted evidence without losing items
    const storedEvidence = sessionEvidenceStore.get(sessionId) || [];
    const combinedEvidences = [...storedEvidence, ...(evidences || [])];

    // Prevent duplicate report creation using findOneAndUpdate with upsert
    const report = await ProctorReport.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        userId: req.user._id,
        subject: subject || 'General',
        topic: topic || 'Assessment',
        integrityScore: Math.max(0, Math.min(100, Number(integrityScore))),
        riskStatus: riskStatus || (integrityScore >= 80 ? 'LOW_RISK' : integrityScore >= 60 ? 'MEDIUM_RISK' : 'HIGH_RISK'),
        recommendation: recommendation || (integrityScore >= 80 ? 'PASSED_VERIFICATION' : integrityScore >= 60 ? 'FLAGGED_FOR_MANUAL_REVIEW' : 'AUTOMATIC_DISQUALIFICATION'),
        strikes: strikes || 0,
        categoryBreakdown: categoryBreakdown || { identityScore: 100, behaviorScore: 100, environmentScore: 100 },
        evidences: combinedEvidences,
        generatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      report
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get AI Integrity Report by Session ID
 * @route   GET /api/proctor/report/:sessionId
 * @access  Private
 */
exports.getReport = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const report = await ProctorReport.findOne({ sessionId });

    if (!report) {
      return res.status(404).json({ success: false, error: 'Report not found for session.' });
    }

    return res.status(200).json({
      success: true,
      report
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
    const storedEvidence = sessionEvidenceStore.get(sessionId) || [];

    if (!result) {
      return res.status(200).json({ success: true, strikes: 0, violations: storedEvidence });
    }

    return res.status(200).json({
      success: true,
      strikes: result.strikes,
      violations: [...(result.details || []), ...storedEvidence]
    });
  } catch (err) {
    next(err);
  }
};
