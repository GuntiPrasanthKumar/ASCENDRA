export const mockResults = {
  run: {
    status: 'Success',
    stdout: 'Output: ["o","l","l","e","h"]',
    time: '25 ms',
    memory: '12 MB'
  },
  submit: {
    status: 'Accepted',
    runtime: '72 ms',
    memory: '42 MB',
    passedCount: 15,
    totalCount: 15,
    aiReview: {
      score: 95,
      quality: 'Excellent',
      complexity: 'Time: O(N) | Space: O(1)',
      suggestions: 'Use inline swapping to minimize space allocations.',
      bestPractices: 'Variables scoped correctly. Functional loops are highly readable.'
    }
  }
};
