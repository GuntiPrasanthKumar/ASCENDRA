const assert = require('assert');
const VoiceAnalyzer = require('../services/interview/VoiceAnalyzer');
const ReadinessEngine = require('../services/interview/ReadinessEngine');

console.log('🧪 Starting Enterprise Interview Studio Verification Tests...\n');

// Test 1: Voice Analytics WPM & Filler Extraction
const transcript = "Um basically I think we should like use dynamic programming to solve this problem.";
const voiceRes = VoiceAnalyzer.analyzeSpeech(transcript, 30);
assert.strictEqual(voiceRes.wordCount, 14, 'Should count words correctly');
assert.strictEqual(voiceRes.fillerCount, 3, 'Should extract filler words (um, basically, like)');
console.log('✅ PASS: Speech Analytics (WPM & Filler Word Extraction)');

// Test 2: Readiness Score Calculation
const readiness = ReadinessEngine.calculateReadiness({
  technicalScore: 90,
  communicationScore: 85,
  problemSolvingScore: 88
});
assert.strictEqual(readiness.readinessBadge, 'TIER_1_READY', 'Score >= 85 qualifies for TIER_1_READY badge');
console.log('✅ PASS: Interview Readiness Engine & Tier Qualification');

console.log('\n🎉 All Enterprise Interview Studio Verification Tests Passed Successfully!');
