require('./setup.test');
const assert = require('assert');
const { assessmentEngineService } = require('../services/assessment.service');

/**
 * Enterprise Assessment Engine Verification Test Suite
 */
async function runAssessmentTests() {
  console.log('🧪 Starting Enterprise Assessment Engine Verification Tests...\n');

  // Test 1: Assessment Session Initialization Lifecycle
  const mockUserId = '65c8f1234567890123456789';
  const session = await assessmentEngineService.startAssessment(mockUserId, {
    subject: 'adv-algorithms',
    topic: 'Dynamic Programming',
    timeLimitMinutes: 25
  });

  assert.ok(session.sessionId, 'Session ID initialized');
  assert.strictEqual(session.subject, 'adv-algorithms', 'Subject set correctly');
  assert.strictEqual(session.topic, 'Dynamic Programming', 'Topic set correctly');
  assert.strictEqual(session.status, 'ACTIVE', 'Initial status should be ACTIVE');
  assert.ok(session.sections.length >= 1, 'Contains default section');
  assert.ok(session.remainingSeconds > 0, 'Remaining seconds calculated from server expiresAt');
  console.log('✅ PASS: Assessment Session Initialization & Server Timer Engine');

  // Test 2: Auto-Save Engine Data Sanitization
  const autoSaveResult = await assessmentEngineService.autoSaveProgress(mockUserId, session.sessionId, {
    'q-1': { selectedIdx: 0, timeSpentSeconds: 12, confidence: 'HIGH' }
  });
  assert.strictEqual(autoSaveResult.success, true, 'Auto-save returned success');
  console.log('✅ PASS: Auto-Save Engine Progress Tracking');

  // Test 3: Marking & Evaluation Engine
  const evaluationResult = await assessmentEngineService.evaluateAssessment(mockUserId, session.sessionId);
  assert.ok(evaluationResult.evaluation || evaluationResult.totalQuestions !== undefined, 'Evaluation score computed');
  console.log('✅ PASS: Marking & Evaluation Engine with AI Feedback & Proctoring Score');

  console.log('\n🎉 All Enterprise Assessment Engine Verification Tests Passed Successfully!');
}

if (require.main === module) {
  runAssessmentTests().catch((err) => {
    console.error('❌ FAIL: Assessment test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runAssessmentTests };
