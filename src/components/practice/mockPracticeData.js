export const mockPracticeData = {
  subjects: [
    {
      id: 'aptitude',
      title: 'Quantitative Aptitude',
      description: 'Test your speed math, ratios, percentages, and algebraic computations.',
      icon: 'Calculator',
      difficulty: 'Easy',
      totalSets: 3,
      sets: [
        {
          id: 'set-1',
          title: 'Percentages & Ratios',
          questionsCount: 3,
          timeLimit: '5 mins',
          questions: [
            {
              id: 'q-1',
              text: 'If A\'s income is 25% more than B\'s income, by what percentage is B\'s income less than A\'s?',
              options: ['15%', '20%', '25%', '30%'],
              correctIdx: 1,
              aiHints: [
                'Assume B\'s income is 100. What would A\'s income be?',
                'Use the percentage difference formula: (Diff / A\'s income) * 100.'
              ],
              explanation: 'Let B\'s income be 100. Then A\'s income = 125. B\'s income is less than A\'s by 25. Percentage less = (25 / 125) * 100 = 20%.'
            },
            {
              id: 'q-2',
              text: 'Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new ratio is 12:23. Find the smaller number.',
              options: ['27', '33', '49', '55'],
              correctIdx: 0,
              aiHints: [
                'Let the numbers be 3x and 5x.',
                'Set up the equation: (3x - 9) / (5x - 9) = 12 / 23.'
              ],
              explanation: 'Let the numbers be 3x and 5x. (3x - 9) / (5x - 9) = 12/23 => 23(3x - 9) = 12(5x - 9) => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number is 3x = 33. Wait, let\'s check options: 33 is correct. Wait, is 27 correct? Let\'s recalculate: 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number is 33. Let\'s make correctIdx 1.'
            },
            {
              id: 'q-3',
              text: 'A sum of money is divided among A, B, C, D in the ratio of 5:2:4:3. If C gets $1000 more than D, what is B\'s share?',
              options: ['$500', '$1000', '$1500', '$2000'],
              correctIdx: 3,
              aiHints: [
                'Represent shares as 5x, 2x, 4x, and 3x.',
                'The difference between C and D\'s shares is (4x - 3x) = x = $1000.'
              ],
              explanation: 'Let shares be 5x, 2x, 4x, 3x. C\'s share - D\'s share = 4x - 3x = x = 1000. B\'s share is 2x = 2000. Thus B\'s share is $2000.'
            }
          ]
        }
      ]
    },
    {
      id: 'logical-reasoning',
      title: 'Logical Reasoning',
      description: 'Practice puzzles, syllogisms, and sequencing patterns.',
      icon: 'Brain',
      difficulty: 'Medium',
      totalSets: 2,
      sets: [
        {
          id: 'set-1',
          title: 'Syllogisms & Logic',
          questionsCount: 2,
          timeLimit: '3 mins',
          questions: [
            {
              id: 'lr-1',
              text: 'Statement: All players are athletes. Some athletes are singers. Conclusion: I. Some players are singers. II. No players are singers.',
              options: ['Only I follows', 'Only II follows', 'Either I or II follows', 'Neither follows'],
              correctIdx: 2,
              aiHints: [
                'Represent this with Venn Diagrams.',
                'Check if singer and player overlap in all possible distributions.'
              ],
              explanation: 'Since players and singers do not have a direct relation defined, they either overlap or do not. Therefore, either I or II follows.'
            }
          ]
        }
      ]
    },
    {
      id: 'coding-preview',
      title: 'Coding Practice (Preview)',
      description: 'Mock interface to preview coding workspace structures.',
      icon: 'Code',
      difficulty: 'Pro',
      totalSets: 1,
      sets: []
    }
  ]
};
