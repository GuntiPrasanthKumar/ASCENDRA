const assert = require('assert');
const { startDiagnostic, submitAnswer } = require('../controllers/diagnostic.controller');

console.log('🧪 Starting Phase 1: Diagnostic Assessment Engine Verification Tests...\n');

async function runTests() {
  const mockUser1 = { _id: '65c8f1234567890123456781' };
  const mockUser2 = { _id: '65c8f1234567890123456782' };

  // Helper mock req/res wrapper
  function createMockReqRes(user, body) {
    let resStatus = 200;
    let resData = null;
    const req = { user, body };
    const res = {
      status: (code) => { resStatus = code; return res; },
      json: (data) => { resData = data; return res; }
    };
    return { req, res, getStatus: () => resStatus, getData: () => resData };
  }

  // --- Candidate 1 Simulation (High Accuracy -> Advanced) ---
  console.log('▶ Simulating High-Accuracy Candidate (Target: Advanced)...');
  const startObj1 = createMockReqRes(mockUser1, { domain: 'Java', totalQuestions: 3 });
  await startDiagnostic(startObj1.req, startObj1.res, (err) => { throw err; });
  const startRes1 = startObj1.getData();

  assert.strictEqual(startRes1.success, true, 'Diagnostic start should succeed');
  const assessmentId1 = startRes1.data.assessmentId;
  assert.strictEqual(!!assessmentId1, true, 'Assessment ID should be returned');
  assert.strictEqual(startRes1.data.question.difficulty, 'Medium', 'Initial difficulty should be Medium');

  // Submit Answer 1 (Correct -> Scale up to Hard)
  const ansObj1 = createMockReqRes(mockUser1, {
    assessmentId: assessmentId1,
    questionIndex: 0,
    answerIndex: 0, // correct
    timeSpentSeconds: 12
  });
  await submitAnswer(ansObj1.req, ansObj1.res, (err) => { throw err; });
  const ansRes1 = ansObj1.getData();
  assert.strictEqual(ansRes1.data.lastAnswerResult.isCorrect, true, 'Answer 1 should be marked correct');
  assert.strictEqual(ansRes1.data.nextQuestion.difficulty, 'Hard', 'Difficulty should escalate to Hard');

  // Submit Answer 2 (Correct -> Scale up to Pro)
  const ansObj2 = createMockReqRes(mockUser1, {
    assessmentId: assessmentId1,
    questionIndex: 1,
    answerIndex: 0, // correct
    timeSpentSeconds: 15
  });
  await submitAnswer(ansObj2.req, ansObj2.res, (err) => { throw err; });
  const ansRes2 = ansObj2.getData();
  assert.strictEqual(ansRes2.data.nextQuestion.difficulty, 'Pro', 'Difficulty should escalate to Pro');

  // Submit Final Answer 3 (Correct -> Completion & Advanced)
  const ansObj3 = createMockReqRes(mockUser1, {
    assessmentId: assessmentId1,
    questionIndex: 2,
    answerIndex: 0, // correct
    timeSpentSeconds: 18
  });
  await submitAnswer(ansObj3.req, ansObj3.res, (err) => { throw err; });
  const finalRes1 = ansObj3.getData();
  assert.strictEqual(finalRes1.data.isCompleted, true, 'Diagnostic session should be completed');
  assert.strictEqual(finalRes1.data.resultSummary.assignedSkillLevel, 'Advanced', 'Candidate 1 should be classified as Advanced');
  assert.strictEqual(finalRes1.data.resultSummary.accuracyPercentage, 100, 'Accuracy should be 100%');
  console.log('✅ PASS: High-Accuracy Candidate Classified as Advanced (Auto-scaling: Medium -> Hard -> Pro)\n');

  // --- Candidate 2 Simulation (Low Accuracy -> Beginner) ---
  console.log('▶ Simulating Low-Accuracy Candidate (Target: Beginner)...');
  const startObj2 = createMockReqRes(mockUser2, { domain: 'Python', totalQuestions: 3 });
  await startDiagnostic(startObj2.req, startObj2.res, (err) => { throw err; });
  const startRes2 = startObj2.getData();

  const assessmentId2 = startRes2.data.assessmentId;

  // Submit Answer 1 (Incorrect -> Scale down to Easy)
  const ansLow1 = createMockReqRes(mockUser2, {
    assessmentId: assessmentId2,
    questionIndex: 0,
    answerIndex: 3, // incorrect (correct is 0)
    timeSpentSeconds: 25
  });
  await submitAnswer(ansLow1.req, ansLow1.res, (err) => { throw err; });
  const ansLowRes1 = ansLow1.getData();
  assert.strictEqual(ansLowRes1.data.lastAnswerResult.isCorrect, false, 'Answer should be marked incorrect');
  assert.strictEqual(ansLowRes1.data.nextQuestion.difficulty, 'Easy', 'Difficulty should de-escalate to Easy');

  // Submit Answer 2 (Incorrect)
  const ansLow2 = createMockReqRes(mockUser2, {
    assessmentId: assessmentId2,
    questionIndex: 1,
    answerIndex: 2, // incorrect
    timeSpentSeconds: 20
  });
  await submitAnswer(ansLow2.req, ansLow2.res, (err) => { throw err; });

  // Submit Final Answer 3 (Incorrect -> Completion & Beginner)
  const ansLow3 = createMockReqRes(mockUser2, {
    assessmentId: assessmentId2,
    questionIndex: 2,
    answerIndex: 1, // incorrect
    timeSpentSeconds: 22
  });
  await submitAnswer(ansLow3.req, ansLow3.res, (err) => { throw err; });
  const finalRes2 = ansLow3.getData();
  assert.strictEqual(finalRes2.data.isCompleted, true, 'Diagnostic session should be completed');
  assert.strictEqual(finalRes2.data.resultSummary.assignedSkillLevel, 'Beginner', 'Candidate 2 should be classified as Beginner');
  assert.strictEqual(finalRes2.data.resultSummary.accuracyPercentage, 0, 'Accuracy should be 0%');
  console.log('✅ PASS: Low-Accuracy Candidate Classified as Beginner (Auto-scaling: Medium -> Easy -> Easy)\n');

  console.log('🎉 All Phase 1 Diagnostic Assessment Engine Verification Tests Passed Successfully!');
}

runTests().catch(err => {
  console.error('❌ Diagnostic Assessment Test Failure:', err);
  process.exit(1);
});
