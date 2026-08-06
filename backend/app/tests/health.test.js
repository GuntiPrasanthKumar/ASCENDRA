require('./setup.test');
const assert = require('assert');
const { config } = require('../config/env.config');
const healthController = require('../controllers/health.controller');

/**
 * Health Endpoints Unit & Integration Test Suite
 */
async function runHealthTests() {
  console.log('🧪 Starting Health Infrastructure Verification Tests...\n');

  // Test 1: Configuration System Validation
  assert.strictEqual(config.isTest, true, 'Config should recognize test environment');
  console.log('✅ PASS: Configuration System Environment Check');

  // Test 2: Liveness Probe Handler
  const mockResLiveness = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };

  await healthController.getLiveness({}, mockResLiveness);
  assert.strictEqual(mockResLiveness.statusCode, 200, 'Liveness probe should return HTTP 200');
  assert.strictEqual(mockResLiveness.body.success, true, 'Liveness response success should be true');
  assert.strictEqual(mockResLiveness.body.data.status, 'UP', 'Liveness status should be UP');
  console.log('✅ PASS: Liveness Probe (/health/liveness)');

  // Test 3: System Health Check Handler
  const mockResHealth = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };

  await healthController.getHealthStatus({}, mockResHealth);
  assert.strictEqual(mockResHealth.statusCode, 200, 'Health check should return HTTP 200 in test mode');
  assert.strictEqual(mockResHealth.body.data.status, 'UP', 'Health check status should be UP');
  console.log('✅ PASS: System Health Check (/health)');

  // Test 4: Readiness Probe Handler
  const mockResReadiness = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };

  await healthController.getReadiness({}, mockResReadiness);
  assert.strictEqual(mockResReadiness.statusCode, 200, 'Readiness probe should return HTTP 200 in test mode');
  assert.strictEqual(mockResReadiness.body.data.status, 'READY', 'Readiness status should be READY');
  console.log('✅ PASS: Readiness Probe (/health/readiness)');

  console.log('\n🎉 All Health Infrastructure Verification Tests Passed Successfully!');
}

if (require.main === module) {
  runHealthTests().catch((err) => {
    console.error('❌ FAIL: Test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runHealthTests };
