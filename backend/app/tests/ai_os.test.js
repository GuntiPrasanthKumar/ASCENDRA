const assert = require('assert');
const AIActionRegistry = require('../ai/AIActionRegistry');
const AIPlannerService = require('../ai/AIPlannerService');

console.log('🧪 Starting Phase A: AI Operating System Verification Tests...\n');

async function runTests() {
  // Test 1: Action Registry Metadata & Action Resolution
  const actions = AIActionRegistry.getAvailableActions();
  assert.strictEqual(actions.length >= 5, true, 'AI Action Registry should expose at least 5 core actions');
  const navAction = actions.find(a => a.name === 'openLearningModule');
  assert.strictEqual(!!navAction, true, 'openLearningModule action should be registered');
  console.log('✅ PASS: AI Action Registry Registration & Metadata Inspection');

  // Test 2: Action Execution
  const actionRes = await AIActionRegistry.executeAction('openLearningModule', { subjectId: 'cs-101', chapterId: 'ch-2', lessonId: 'les-1' });
  assert.strictEqual(actionRes.type, 'NAVIGATE', 'Action execution should return NAVIGATE result');
  assert.strictEqual(actionRes.route, '/learn/cs-101/ch-2/les-1', 'Should resolve correct target route');
  console.log('✅ PASS: Single AI Action Execution & Route Parameter Resolution');

  // Test 3: Multi-Action Workflow Chaining
  const chain = [
    { action: 'updateUserGoal', params: { currentGoal: 'Senior Engineer', targetCompany: 'Google' } },
    { action: 'openCodeLabProblem', params: { problemId: 'knapsack-01' } }
  ];
  const chainRes = await AIActionRegistry.executeChain(chain);
  assert.strictEqual(chainRes.length, 2, 'Execution chain should execute all 2 steps');
  assert.strictEqual(chainRes[0].result.type, 'MEMORY_UPDATE', 'Step 1 should be MEMORY_UPDATE');
  assert.strictEqual(chainRes[1].result.type, 'NAVIGATE', 'Step 2 should be NAVIGATE');
  console.log('✅ PASS: Multi-Action Chained Workflow Resolution');

  // Test 4: AI Planner Service
  const mockUserId = '65c8f1234567890123456789';
  const plan = await AIPlannerService.generateDailyPlan(mockUserId);
  assert.strictEqual(typeof plan.dailyGoal, 'string', 'Plan should contain a daily goal string');
  assert.strictEqual(Array.isArray(plan.tasks), true, 'Plan should contain tasks array');
  assert.strictEqual(plan.tasks.length > 0, true, 'Plan should contain tasks');
  console.log('✅ PASS: AI Planner Service Task Payload Generation');

  console.log('\n🎉 All Phase A AI Operating System Verification Tests Passed Successfully!');
}

runTests().catch(err => {
  console.error('❌ Test Failure:', err);
  process.exit(1);
});
