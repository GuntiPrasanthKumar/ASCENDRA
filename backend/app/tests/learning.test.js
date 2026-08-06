require('./setup.test');
const assert = require('assert');
const { learningService } = require('../services/learning.service');

/**
 * Enterprise Learning Engine Verification Test Suite
 */
async function runLearningTests() {
  console.log('🧪 Starting Enterprise Learning Engine Verification Tests...\n');

  // Test 1: Seed Graph Nodes Check
  const graph = await learningService.getLearningGraph('mock_user_id', 'adv-algorithms');
  assert.ok(Array.isArray(graph) && graph.length >= 3, 'Graph nodes should exist for adv-algorithms');
  const memoNode = graph.find(n => n.lessonId === 'memoization-basics');
  assert.ok(memoNode && memoNode.prerequisites.includes('dp-introduction'), 'Memoization should depend on dp-introduction');
  console.log('✅ PASS: Learning Graph Prerequisite Dependency Structure');

  // Test 2: Prerequisite Integrity Validation
  try {
    await learningService.validatePrerequisites('mock_user_id_uncompleted', 'memoization-basics');
    assert.fail('Should throw ForbiddenError for missing prerequisite');
  } catch (err) {
    assert.strictEqual(err.name, 'ForbiddenError', 'Missing prerequisite should throw ForbiddenError');
    assert.ok(err.message.includes('Learning Integrity Protected'), 'Error message contains integrity notice');
  }
  console.log('✅ PASS: Learning Integrity & Prerequisite Gatekeeper');

  // Test 3: Resume Learning State Calculation
  const resumeState = await learningService.getResumeLearning('new_user_no_history');
  assert.strictEqual(resumeState.hasResumeData, false, 'New user should fallback to default resume data');
  assert.strictEqual(resumeState.recommendedLessonId, 'dp-introduction', 'Fallback recommendation is dp-introduction');
  console.log('✅ PASS: Resume Learning Engine Fallback State');

  console.log('\n🎉 All Enterprise Learning Engine Verification Tests Passed Successfully!');
}

if (require.main === module) {
  runLearningTests().catch((err) => {
    console.error('❌ FAIL: Learning test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runLearningTests };
