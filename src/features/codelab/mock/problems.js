export const mockProblems = [
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    tags: ['Strings', 'Two Pointers'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    starterTemplates: {
      javascript: 'function reverseString(s) {\n  // Write your code here\n  return s.reverse();\n}',
      python: 'def reverseString(self, s: List[str]) -> None:\n    # Write your code here\n    s.reverse()',
      cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n        reverse(s.begin(), s.end());\n    }\n};'
    }
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    starterTemplates: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    # Write your code here\n    pass',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};'
    }
  }
];
