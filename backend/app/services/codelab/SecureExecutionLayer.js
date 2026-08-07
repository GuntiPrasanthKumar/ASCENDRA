const vm = require('vm');

const DISALLOWED_PATTERNS = [
  /require\s*\(/i,
  /import\s+/i,
  /child_process/i,
  /process\./i,
  /\bexec\b/i,
  /\beval\b/i,
  /\bfs\b/i,
  /\bos\b/i,
  /Global/i,
  /Function\s*\(/i
];

class SecureExecutionLayer {
  sanitizeCode(code) {
    if (!code || typeof code !== 'string') {
      return { safe: false, error: 'Empty or invalid code string' };
    }

    for (const pattern of DISALLOWED_PATTERNS) {
      if (pattern.test(code)) {
        return {
          safe: false,
          error: `Security Violation: Restricted usage detected pattern (${pattern.toString()})`
        };
      }
    }

    return { safe: true };
  }

  executeJavaScript(userCode, testArgs = [], timeoutMs = 2000) {
    const securityCheck = this.sanitizeCode(userCode);
    if (!securityCheck.safe) {
      return {
        verdict: 'SECURITY_VIOLATION',
        error: securityCheck.error,
        executionTimeMs: 0
      };
    }

    const sandbox = {
      console: {
        log: (...args) => sandbox.logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
      },
      logs: [],
      testArgs: testArgs,
      result: null
    };

    const context = vm.createContext(sandbox);

    const scriptText = `
      ${userCode}
      
      // Determine target function name from user code or fallback
      let fn = null;
      if (typeof reverseString === 'function') fn = reverseString;
      else if (typeof twoSum === 'function') fn = twoSum;
      else if (typeof longestPalindrome === 'function') fn = longestPalindrome;
      else if (typeof trap === 'function') fn = trap;

      if (fn) {
        result = fn(...testArgs);
      }
    `;

    const start = Date.now();
    try {
      const script = new vm.Script(scriptText);
      script.runInContext(context, { timeout: timeoutMs });
      const executionTimeMs = Date.now() - start;

      return {
        verdict: 'SUCCESS',
        result: sandbox.result,
        logs: sandbox.logs,
        executionTimeMs
      };
    } catch (err) {
      const executionTimeMs = Date.now() - start;

      if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT' || executionTimeMs >= timeoutMs) {
        return {
          verdict: 'TIME_LIMIT_EXCEEDED',
          error: 'Time Limit Exceeded (Limit: 2000ms)',
          executionTimeMs: timeoutMs
        };
      }

      return {
        verdict: 'RUNTIME_ERROR',
        error: err.message,
        executionTimeMs
      };
    }
  }
}

module.exports = new SecureExecutionLayer();
