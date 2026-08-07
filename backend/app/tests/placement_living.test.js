const assert = require('assert');
const PlacementWorkflowEngine = require('../services/placement/PlacementWorkflowEngine');
const BackgroundIntelligenceJob = require('../jobs/BackgroundIntelligenceJob');
const { eventBus, DOMAIN_EVENTS } = require('../core/events/event.bus');

console.log('🧪 Starting Phase B: Living Product & Placement Engine Verification Tests...\n');

async function runTests() {
  const mockUserId = '65c8f1234567890123456789';

  // Test 1: Event Bus Code Submission Dispatch
  eventBus.publish(DOMAIN_EVENTS.CODE_SUBMITTED, {
    userId: mockUserId,
    problemId: 'knapsack-01',
    verdict: 'ACCEPTED',
    points: 35
  });
  console.log('✅ PASS: EventBus Domain Event Publishing (code.submitted)');

  // Test 2: Placement Readiness Score Formula
  const telemetry = await PlacementWorkflowEngine.calculatePlacementReadiness(mockUserId);
  assert.strictEqual(typeof telemetry.placementReadinessScore, 'number', 'Placement readiness score should be numeric');
  assert.strictEqual(telemetry.placementReadinessScore >= 50 && telemetry.placementReadinessScore <= 99, true, 'Score should fall between 50 and 99');
  assert.strictEqual(typeof telemetry.readinessTier, 'string', 'Readiness tier should be string enum');
  console.log('✅ PASS: Placement Readiness Telemetry Calculation & Tier Qualification');

  // Test 3: Background Intelligence Daily Sync
  const syncRes = await BackgroundIntelligenceJob.runDailySync(mockUserId);
  assert.strictEqual(!!syncRes, true, 'Daily sync should execute and return payload');
  assert.strictEqual(!!syncRes.readiness, true, 'Sync should contain readiness telemetry');
  assert.strictEqual(!!syncRes.plan, true, 'Sync should contain daily mission plan');
  console.log('✅ PASS: Background Intelligence Sync & Daily Mission Preparation');

  console.log('\n🎉 All Phase B Placement Engine Verification Tests Passed Successfully!');
}

runTests().catch(err => {
  console.error('❌ Test Failure:', err);
  process.exit(1);
});
