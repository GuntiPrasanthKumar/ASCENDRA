export const mockProblems = [
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    estimatedTime: '15 mins',
    solved: true,
    tags: ['Strings', 'Two Pointers'],
    description: 'Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    starterTemplates: {
      javascript: 'function reverseString(s) {\n  // Write your code here\n  return s.reverse();\n}',
      python: 'def reverseString(self, s: List[str]) -> None:\n    # Write your code here\n    s.reverse()',
      java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Write your code here\n        int left = 0, right = s.length - 1;\n        while (left < right) {\n            char temp = s[left];\n            s[left] = s[right];\n            s[right] = temp;\n            left++; right--;\n        }\n    }\n}',
      cpp: 'class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your code here\n        reverse(s.begin(), s.end());\n    }\n};'
    }
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    estimatedTime: '20 mins',
    solved: false,
    tags: ['Arrays', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    starterTemplates: {
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(self, nums: List[int], target: int) -> List[int]:\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
      cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};'
    }
  },
  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    estimatedTime: '30 mins',
    solved: false,
    tags: ['Strings', 'Dynamic Programming'],
    description: 'Given a string s, return the longest palindromic substring in s. Optimize for O(N^2) time complexity or better using expand around center or dynamic programming table.',
    examples: [
      { input: 's = "babad"', output: '"bab"' },
      { input: 's = "cbbd"', output: '"bb"' }
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consists of only digits and English letters.'
    ],
    starterTemplates: {
      javascript: 'function longestPalindrome(s) {\n  // Write your code here\n  return "";\n}',
      python: 'def longestPalindrome(self, s: str) -> str:\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public String longestPalindrome(String s) {\n        // Write your code here\n        return "";\n    }\n}',
      cpp: 'class Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Write your code here\n        return "";\n    }\n};'
    }
  },
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    estimatedTime: '45 mins',
    solved: false,
    tags: ['Arrays', 'Two Pointers', 'Stack'],
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    starterTemplates: {
      javascript: 'function trap(height) {\n  // Write your code here\n  return 0;\n}',
      python: 'def trap(self, height: List[int]) -> int:\n    # Write your code here\n    pass',
      java: 'class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your code here\n        return 0;\n    }\n};'
    }
  }
];
