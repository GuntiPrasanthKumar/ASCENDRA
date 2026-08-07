const SecureExecutionLayer = require('./SecureExecutionLayer');

// Central Test Suite Bank (Public + Hidden Test Cases)
const TEST_SUITES = {
  'reverse-string': [
    // Public
    { args: [["h","e","l","l","o"]], expected: ["o","l","l","e","h"] },
    { args: [["H","a","n","n","a","h"]], expected: ["h","a","n","n","a","H"] },
    // Hidden
    { args: [["a"]], expected: ["a"] },
    { args: [["A","b"]], expected: ["b","A"] }
  ],
  'two-sum': [
    // Public
    { args: [[2,7,11,15], 9], expected: [0,1] },
    { args: [[3,2,4], 6], expected: [1,2] },
    // Hidden
    { args: [[3,3], 6], expected: [0,1] },
    { args: [[1,5,8,3], 13], expected: [1,2] }
  ],
  'longest-palindromic-substring': [
    // Public
    { args: ["babad"], expected: "bab" },
    { args: ["cbbd"], expected: "bb" },
    // Hidden
    { args: ["a"], expected: "a" }
  ],
  'trapping-rain-water': [
    // Public
    { args: [[0,1,0,2,1,0,1,3,2,1,2,1]], expected: 6 },
    { args: [[4,2,0,3,2,5]], expected: 9 },
    // Hidden
    { args: [[4,2,3]], expected: 1 }
  ]
};

class JudgeEngine {
  normalizeOutput(val) {
    if (val === undefined || val === null) return '';
    return JSON.stringify(val);
  }

  judgeSubmission(problemId, language, code) {
    const suite = TEST_SUITES[problemId] || TEST_SUITES['reverse-string'];
    let passCount = 0;
    let maxTimeMs = 0;
    let finalVerdict = 'ACCEPTED';

    const testResults = [];

    for (let i = 0; i < suite.length; i++) {
      const testCase = suite[i];
      const exec = SecureExecutionLayer.executeJavaScript(code, testCase.args, 2000);

      maxTimeMs = Math.max(maxTimeMs, exec.executionTimeMs || 0);

      if (exec.verdict === 'SECURITY_VIOLATION') {
        return {
          verdict: 'SECURITY_VIOLATION',
          passCount: 0,
          totalCount: suite.length,
          executionTimeMs: 0,
          memoryMb: 12.4,
          error: exec.error,
          testResults: []
        };
      }

      if (exec.verdict === 'TIME_LIMIT_EXCEEDED') {
        return {
          verdict: 'TIME_LIMIT_EXCEEDED',
          passCount,
          totalCount: suite.length,
          executionTimeMs: 2000,
          memoryMb: 24.8,
          error: 'Execution timed out exceeding 2000ms',
          testResults
        };
      }

      if (exec.verdict === 'RUNTIME_ERROR') {
        return {
          verdict: 'RUNTIME_ERROR',
          passCount,
          totalCount: suite.length,
          executionTimeMs: exec.executionTimeMs,
          memoryMb: 15.2,
          error: exec.error,
          testResults
        };
      }

      const isMatch = this.normalizeOutput(exec.result) === this.normalizeOutput(testCase.expected);

      if (isMatch) {
        passCount++;
        testResults.push({ caseIndex: i, passed: true, output: exec.result });
      } else {
        if (finalVerdict === 'ACCEPTED') finalVerdict = 'WRONG_ANSWER';
        testResults.push({ 
          caseIndex: i, 
          passed: false, 
          actual: exec.result, 
          expected: testCase.expected 
        });
      }
    }

    return {
      verdict: finalVerdict,
      passCount,
      totalCount: suite.length,
      executionTimeMs: maxTimeMs || 12,
      memoryMb: parseFloat((14 + Math.random() * 4).toFixed(1)),
      testResults
    };
  }
}

module.exports = new JudgeEngine();
