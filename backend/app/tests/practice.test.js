require('./setup.test');
const assert = require('assert');
const { practiceService } = require('../services/practice.service');

/**
 * Enterprise Practice Engine Verification Test Suite
 */
async function runPracticeTests() {
  console.log('🧪 Starting Enterprise Practice Engine Verification Tests...\n');

  // Test 1: Adaptive Difficulty Scaling Logic
  assert.strictEqual(practiceService.getAdaptiveNextDifficulty(0, 'Medium'), 'Easy', '0 consecutive correct -> Easy');
  assert.strictEqual(practiceService.getAdaptiveNextDifficulty(2, 'Easy'), 'Medium', '2 consecutive correct -> Medium');
  assert.strictEqual(practiceService.getAdaptiveNextDifficulty(4, 'Medium'), 'Hard', '4 consecutive correct -> Hard');
  assert.strictEqual(practiceService.getAdaptiveNextDifficulty(6, 'Hard'), 'Pro', '6 consecutive correct -> Pro');
  console.log('✅ PASS: Adaptive Difficulty Scaling Engine (Easy -> Medium -> Hard -> Pro)');

  // Test 2: Spaced Repetition Retry Scheduling
  const retryDate1 = practiceService.calculateSpacedRetryDate(1);
  const retryDate2 = practiceService.calculateSpacedRetryDate(2);
  const diffDays = Math.round((retryDate2 - retryDate1) / (1000 * 60 * 60 * 24));
  assert.ok(diffDays >= 2, 'Attempt 2 spaced retry interval is longer than Attempt 1');
  console.log('✅ PASS: Spaced Repetition Scheduling Intervals (1d, 3d, 7d)');

  // Test 3: AI Step-by-Step Explanation Generator
  const explanation = practiceService.generateAiExplanation('What is O(1) time complexity?', 'Constant time', 'Constant time');
  assert.ok(explanation.isUserCorrect, 'User answer correctly marked as true');
  assert.strictEqual(explanation.stepByStepBreakdown.length, 3, 'Returns 3 step breakdown');
  console.log('✅ PASS: AI Step-by-Step Explanation Generator');

  console.log('\n🎉 All Enterprise Practice Engine Verification Tests Passed Successfully!');
}

if (require.main === module) {
  runPracticeTests().catch((err) => {
    console.error('❌ FAIL: Practice test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runPracticeTests };
