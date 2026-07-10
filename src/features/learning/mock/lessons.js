export const mockLessons = [
  {
    id: 'dp-introduction',
    chapterId: 'dynamic-programming',
    title: 'Introduction to Dynamic Programming',
    estimatedMinutes: 10,
    pointsAwarded: 50,
    contentBlocks: [
      {
        id: 'b-1',
        type: 'heading',
        value: 'The Paradigm of Overlapping Subproblems'
      },
      {
        id: 'b-2',
        type: 'paragraph',
        value: 'Dynamic Programming is a mathematical optimization method and a computer programming method. It simplifies a complicated problem by breaking it down into simpler sub-problems in a recursive manner.'
      },
      {
        id: 'b-3',
        type: 'info_card',
        value: 'Whenever we see a recursive solution that has repeated calls for the same inputs, we can optimize it using Dynamic Programming to store the results.'
      },
      {
        id: 'b-4',
        type: 'example_card',
        language: 'javascript',
        value: 'function solveRecursive(n) {\n  if (n <= 1) return n;\n  return solveRecursive(n - 1) + solveRecursive(n - 2);\n}'
      },
      {
        id: 'b-5',
        type: 'important_note',
        value: 'Naive recursion of Fibonacci takes O(2^N) time. DP optimizes this to O(N) linear time.'
      },
      {
        id: 'b-6',
        type: 'image_placeholder',
        value: 'Recursive tree diagram representing overlapping compute loops for fib(5)'
      },
      {
        id: 'b-7',
        type: 'summary',
        value: 'Dynamic Programming is an optimization technique that reduces exponential complexity by storing results of solved subproblems.'
      },
      {
        id: 'b-8',
        type: 'key_takeaway',
        value: 'Use Tabulation (Bottom-Up) or Memoization (Top-Down) based on the sparsity of state transitions.'
      }
    ]
  },
  {
    id: 'memoization-basics',
    chapterId: 'dynamic-programming',
    title: 'Memoization Basics',
    estimatedMinutes: 15,
    pointsAwarded: 70,
    contentBlocks: [
      {
        id: 'm-1',
        type: 'heading',
        value: 'Top-Down Recursive Caching'
      },
      {
        id: 'm-2',
        type: 'paragraph',
        value: 'Memoization is an optimization technique used primarily to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again.'
      },
      {
        id: 'm-3',
        type: 'info_card',
        value: 'A lookup map or dictionary acts as the cache registry. If keys are registered, operations return immediately.'
      },
      {
        id: 'm-4',
        type: 'code_block',
        language: 'javascript',
        value: 'const cache = new Map();\nfunction memoizedFib(n) {\n  if (n <= 1) return n;\n  if (cache.has(n)) return cache.get(n);\n  const result = memoizedFib(n-1) + memoizedFib(n-2);\n  cache.set(n, result);\n  return result;\n}'
      }
    ]
  }
];
