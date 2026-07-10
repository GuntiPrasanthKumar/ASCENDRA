export const mockQuizQuestions = {
  'quiz-1': [
    {
      id: 'q-1',
      text: 'Which data structure is typically used internally by Memoization to store solved states?',
      options: ['Priority Queue', 'Stack', 'Lookup Map or Array', 'Graph Nodes List'],
      correctIdx: 2
    },
    {
      id: 'q-2',
      text: 'If a problem has overlapping subproblems but lacks optimal substructure, can we apply Dynamic Programming?',
      options: ['Yes, always', 'No, both criteria are mandatory', 'Only if using tabulation', 'Only for Fibonacci structures'],
      correctIdx: 1
    },
    {
      id: 'q-3',
      text: 'What is the space complexity of bottom-up Tabulation for a 1D Fibonacci state array?',
      options: ['O(1) space', 'O(N) space', 'O(N^2) space', 'O(Log N) space'],
      correctIdx: 1
    }
  ]
};
