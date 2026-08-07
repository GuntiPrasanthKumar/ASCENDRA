import api from '../../utils/api';

const VIOLATION_WEIGHTS = {
  IDENTITY_MISMATCH: 20,
  PHONE_DETECTED: 15,
  ADDITIONAL_PERSON_DETECTED: 15,
  MULTIPLE_FACES_DETECTED: 15,
  FACE_ABSENT: 10,
  DEVTOOLS_SHORTCUT_ATTEMPT: 10,
  DEVTOOLS_OR_WINDOW_RESIZE: 10,
  TAB_SWITCH: 10,
  WINDOW_BLUR: 10,
  FULLSCREEN_EXIT: 5,
  CLIPBOARD_COPY: 5,
  CLIPBOARD_CUT: 5,
  CLIPBOARD_PASTE: 5,
  PAGE_REFRESH_ATTEMPT: 10,
  AUDIO_NOISE_DETECTED: 5,
  LOOKING_AWAY: 5
};

export class IntegrityEngine {
  constructor(sessionId = 'session-default') {
    this.sessionId = sessionId;
    this.evidenceLog = [];
    this.reportSaved = false;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  addEvidence(violation) {
    const evidenceItem = {
      evidenceId: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      engine: violation.engine || 'INTEGRITY',
      violationType: violation.violationType,
      severity: violation.severity || 'MEDIUM',
      metadata: violation.metadata || {}
    };

    this.evidenceLog.push(evidenceItem);

    // Asynchronously stream evidence to backend without blocking
    api.post('/proctor/evidence', {
      sessionId: this.sessionId,
      engine: evidenceItem.engine,
      violationType: evidenceItem.violationType,
      severity: evidenceItem.severity,
      metadata: evidenceItem.metadata
    }).catch(err => {
      console.warn('[IntegrityEngine] Evidence sync warning:', err?.message);
    });

    return evidenceItem;
  }

  calculateIntegrityScore() {
    let score = 100;
    
    this.evidenceLog.forEach(item => {
      const deduction = VIOLATION_WEIGHTS[item.violationType] || 5;
      score -= deduction;
    });

    return Math.max(0, score);
  }

  getRiskStatus(score) {
    if (score >= 80) return 'LOW_RISK';
    if (score >= 60) return 'MEDIUM_RISK';
    return 'HIGH_RISK';
  }

  getRecommendation(score, strikes) {
    if (strikes >= 3 || score < 50) return 'AUTOMATIC_DISQUALIFICATION';
    if (score < 80) return 'FLAGGED_FOR_MANUAL_REVIEW';
    return 'PASSED_VERIFICATION';
  }

  async generateFinalReport(meta = {}) {
    if (this.reportSaved) {
      console.log('[IntegrityEngine] Report already generated for session:', this.sessionId);
      return null;
    }

    const integrityScore = this.calculateIntegrityScore();
    const riskStatus = this.getRiskStatus(integrityScore);
    const strikes = meta.strikes || this.evidenceLog.length;
    const recommendation = this.getRecommendation(integrityScore, strikes);

    const reportPayload = {
      sessionId: this.sessionId,
      subject: meta.subject || 'General',
      topic: meta.topic || 'Assessment',
      integrityScore,
      riskStatus,
      recommendation,
      strikes,
      categoryBreakdown: {
        identityScore: Math.max(0, 100 - (this.evidenceLog.filter(e => e.engine === 'IDENTITY').length * 20)),
        behaviorScore: Math.max(0, 100 - (this.evidenceLog.filter(e => e.engine === 'BEHAVIOR').length * 10)),
        environmentScore: Math.max(0, 100 - (this.evidenceLog.filter(e => e.engine === 'ENVIRONMENT').length * 10))
      },
      evidences: this.evidenceLog
    };

    try {
      this.reportSaved = true;
      const response = await api.post('/proctor/report', reportPayload);
      return response.data?.report || reportPayload;
    } catch (err) {
      console.warn('[IntegrityEngine] Report save error, returning local report:', err);
      return reportPayload;
    }
  }
}
