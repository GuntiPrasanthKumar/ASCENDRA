const assert = require('assert');
const ATSEngine = require('../services/career/ATSEngine');
const SkillGapEngine = require('../services/career/SkillGapEngine');

console.log('🧪 Starting Enterprise Career Hub Verification Tests...\n');

// Test 1: ATS Resume Evaluation
const resumeText = "Experienced Software Engineer proficient in React, Node.js, TypeScript, Python, and System Design.";
const atsRes = ATSEngine.evaluateResume(resumeText, 'Full Stack Engineer');
assert.strictEqual(typeof atsRes.atsScore, 'number', 'ATS Score should be a numeric value');
assert.strictEqual(atsRes.keywordsMatched.includes('React'), true, 'Should detect React keyword match');
console.log('✅ PASS: ATS Resume Benchmark & Keyword Evaluation');

// Test 2: Skill Gap Analysis
const gapRes = SkillGapEngine.analyzeSkillGaps(['React', 'Node.js'], 'Full Stack Engineer');
assert.strictEqual(gapRes.skillGaps.length > 0, true, 'Should identify missing skill gaps');
console.log('✅ PASS: Skill Gap Graph & Competency Mapping');

console.log('\n🎉 All Enterprise Career Hub Verification Tests Passed Successfully!');
