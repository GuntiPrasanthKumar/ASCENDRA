export const mockLearnData = {
  subjects: [
    {
      id: 'adv-algorithms',
      title: 'Advanced Algorithms',
      description: 'Master Dynamic Programming, Heap operations, and complex graph algorithms.',
      difficulty: 'Pro',
      estimatedHours: 20,
      chaptersCount: 4,
      lessonsCount: 16,
      progress: 74,
      chapters: [
        {
          id: 'dynamic-programming',
          title: 'Dynamic Programming',
          order: 1,
          lessonsCount: 4,
          completedLessons: 3,
          lessons: [
            {
              id: 'dp-introduction',
              title: 'Introduction to Dynamic Programming',
              type: 'theory',
              estimatedMinutes: 10,
              pointsAwarded: 50,
              contentBlocks: [
                {
                  id: 'block-1',
                  type: 'heading',
                  value: 'Core Paradigms: Dynamic Solver'
                },
                {
                  id: 'block-2',
                  type: 'explanation',
                  value: 'Dynamic Programming (DP) is an algorithmic optimization paradigm that solves complex problems by breaking them down into smaller overlapping subproblems. The core secret is avoiding redundant calculations by storing previously calculated answers in a memory table (memoization/tabulation).'
                },
                {
                  id: 'block-3',
                  type: 'takeaway',
                  value: 'Overlapping Subproblems and Optimal Substructure form the two golden criteria to successfully apply DP.'
                },
                {
                  id: 'block-4',
                  type: 'example',
                  language: 'javascript',
                  value: 'const memo = {};\nfunction fib(n) {\n  if (n <= 1) return n;\n  if (memo[n] !== undefined) return memo[n];\n  return memo[n] = fib(n - 1) + fib(n - 2);\n}'
                },
                {
                  id: 'block-5',
                  type: 'practice_preview',
                  title: 'Longest Common Subsequence',
                  difficulty: 'Medium',
                  points: 150,
                  url: '/practice'
                },
                {
                  id: 'block-6',
                  type: 'quiz_preview',
                  question: 'What is the primary difference between Memoization and Tabulation?',
                  options: [
                    'Memoization is top-down (recursive) caching; Tabulation is bottom-up (iterative) table building.',
                    'Tabulation runs in exponential O(2^N) time whereas Memoization runs in linear O(N) time.',
                    'Memoization uses heaps, Tabulation relies on queues.',
                    'There is no functional difference between them.'
                  ],
                  correctIndex: 0,
                  explanation: 'Memoization solves subproblems recursively (top-down) and saves cache; Tabulation fills a state array iteratively (bottom-up).'
                }
              ]
            },
            {
              id: 'memoization-basics',
              title: 'Memoization Basics',
              type: 'theory',
              estimatedMinutes: 15,
              pointsAwarded: 70,
              contentBlocks: [
                {
                  id: 'memo-1',
                  type: 'heading',
                  value: 'Top-Down Optimization Caching'
                },
                {
                  id: 'memo-2',
                  type: 'explanation',
                  value: 'Memoization intercepts recursive calls and stores computed outputs. If the same arguments are requested, the cached value is returned directly, bypassing the recursive call stack.'
                },
                {
                  id: 'memo-3',
                  type: 'takeaway',
                  value: 'Memoization is best suited when the subproblem space is sparse and you do not need to solve all intermediate subproblems.'
                },
                {
                  id: 'memo-4',
                  type: 'example',
                  language: 'javascript',
                  value: '// Quick memo helper\nconst memo = new Map();\nfunction solve(state) {\n  if (memo.has(state)) return memo.get(state);\n  let result = compute(state);\n  memo.set(state, result);\n  return result;\n}'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
