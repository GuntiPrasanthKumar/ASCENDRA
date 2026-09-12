const assert = require('assert');
const SecureExecutionLayer = require('../services/codelab/SecureExecutionLayer');
const JudgeEngine = require('../services/codelab/JudgeEngine');

console.log('🧪 Starting Enterprise CodeLab Engine Verification Tests...\n');

// Test 1: Security Sanitization (Malicious Code Block)
const maliciousCode = "const fs = require('fs'); process.exit(1);";
const secCheck = SecureExecutionLayer.sanitizeCode(maliciousCode);
assert.strictEqual(secCheck.safe, false, 'Should block restricted require(fs)');
console.log('✅ PASS: Security Sanitization & Malicious Code Prevention');

// Test 2: Secure VM Execution Timeout
const infiniteLoopCode = "while(true){}";
const timeoutExec = SecureExecutionLayer.executeJavaScript(infiniteLoopCode, [], 500);
assert.strictEqual(timeoutExec.verdict, 'TIME_LIMIT_EXCEEDED', 'Should detect 500ms timeout boundary');
console.log('✅ PASS: Sandboxed VM Timeout Boundary Enforcement (500ms)');

// Test 3: Judge Engine Evaluation
const validSolution = "function reverseString(s) { return s.reverse(); }";
const judgeRes = JudgeEngine.judgeSubmission('reverse-string', 'javascript', validSolution);
assert.strictEqual(judgeRes.verdict, 'ACCEPTED', 'Should accept valid solution against test suite');
assert.strictEqual(judgeRes.passCount, judgeRes.totalCount, 'Should pass all test cases');
console.log('✅ PASS: Judge Engine Evaluation (Public & Hidden Test Cases)');

console.log('\n🎉 All Enterprise CodeLab Engine Verification Tests Passed Successfully!');
