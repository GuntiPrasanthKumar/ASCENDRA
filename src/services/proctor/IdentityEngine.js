import api from '../../utils/api';

export class IdentityEngine {
  constructor(sessionId = 'session-default') {
    this.sessionId = sessionId;
    this.lastVerifyTime = 0;
    this.VERIFY_INTERVAL = 15000; // 15 seconds continuous verification interval
    this.isVerifying = false;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  async verifyContinuous(faceData, onViolation) {
    const now = Date.now();
    if (
      !faceData ||
      !faceData.detected ||
      !Array.isArray(faceData.descriptor) ||
      faceData.descriptor.length !== 512 ||
      now - this.lastVerifyTime < this.VERIFY_INTERVAL ||
      this.isVerifying
    ) {
      return null;
    }

    this.lastVerifyTime = now;
    this.isVerifying = true;

    try {
      const response = await api.post('/proctor/verify', {
        sessionId: this.sessionId,
        embedding: faceData.descriptor,
        modelVersion: 'mediapipe-face-embedder-v1'
      });

      const { match, similarityScore } = response.data || {};

      if (match === false) {
        const evidence = {
          engine: 'IDENTITY',
          violationType: 'IDENTITY_MISMATCH',
          severity: 'CRITICAL',
          metadata: { similarityScore, threshold: 0.60 }
        };
        if (typeof onViolation === 'function') {
          onViolation(evidence);
        }
      }

      return { match, similarityScore };
    } catch (err) {
      console.warn('[IdentityEngine] Continuous verification warning:', err?.response?.data || err.message);
      return null;
    } finally {
      this.isVerifying = false;
    }
  }
}
