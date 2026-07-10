export const mockQuestions = {
  'aptitude-1': [
    {
      id: 'q-1',
      text: 'If A\'s income is 25% more than B\'s income, by what percentage is B\'s income less than A\'s?',
      options: ['15%', '20%', '25%', '30%'],
      correctIdx: 1,
      aiHints: [
        'Assume B\'s income is 100. What would A\'s income be?',
        'Use the percentage difference formula: (Diff / A\'s income) * 105.'
      ],
      explanation: 'Let B\'s income be 100. Then A\'s income = 125. B\'s income is less than A\'s by 25. Percentage less = (25 / 125) * 100 = 20%.'
    },
    {
      id: 'q-2',
      text: 'Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new ratio is 12:23. Find the smaller number.',
      options: ['27', '33', '49', '55'],
      correctIdx: 1,
      aiHints: [
        'Let the numbers be 3x and 5x.',
        'Set up the equation: (3x - 9) / (5x - 9) = 12 / 23.'
      ],
      explanation: 'Let the numbers be 3x and 5x. (3x - 9) / (5x - 9) = 12/23 => 23(3x - 9) = 12(5x - 9) => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number is 3x = 33.'
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
  ],
  'logical-1': [
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
};
