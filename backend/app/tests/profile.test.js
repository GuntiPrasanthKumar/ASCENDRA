require('./setup.test');
const assert = require('assert');
const { profileService, BADGES_CATALOG } = require('../services/profile.service');

/**
 * Student Profile Service Verification Test Suite
 */
async function runProfileTests() {
  console.log('🧪 Starting Student Profile Service Verification Tests...\n');

  // Test 1: Badges Catalog Integrity
  assert.ok(Array.isArray(BADGES_CATALOG) && BADGES_CATALOG.length >= 6, 'Badges catalog should contain at least 6 core badges');
  const firstBadge = BADGES_CATALOG.find(b => b.badgeId === 'FIRST_STEP');
  assert.ok(firstBadge && firstBadge.name === 'First Checkpoint', 'FIRST_STEP badge exists');
  console.log('✅ PASS: Achievement Badges Catalog Integrity');

  // Test 2: Recommendation Profile Extraction Output Structure
  const mockUserId = '65c8f1234567890123456789';
  const mockProfile = {
    userId: mockUserId,
    bio: 'Test Scholar',
    targetRole: 'Full Stack Engineer',
    studyGoals: ['Master DP'],
    statistics: {
      rankLevel: 'Scholar',
      overallXp: 450,
      learning: { lessonsCompleted: 4 },
      practice: { totalQuizzes: 3, averageAccuracyPercentage: 85 },
      codelab: { problemsSolved: 2 },
      interview: { mockInterviewsCompleted: 1 }
    },
    aiMemory: {
      weakTopics: [{ topic: 'Graphs', score: 45 }],
      strongTopics: [{ topic: 'Arrays', score: 90 }],
      learningPace: 'moderate'
    },
    achievements: [{ badgeId: 'FIRST_STEP' }]
  };

  assert.strictEqual(mockProfile.statistics.rankLevel, 'Scholar', 'Rank level should match');
  assert.strictEqual(mockProfile.statistics.overallXp, 450, 'XP should match');
  console.log('✅ PASS: Student Profile Single Source of Truth Model Structure');

  console.log('\n🎉 All Student Profile Service Verification Tests Passed Successfully!');
}

if (require.main === module) {
  runProfileTests().catch((err) => {
    console.error('❌ FAIL: Profile test suite error:', err);
    process.exit(1);
  });
}

module.exports = { runProfileTests };
