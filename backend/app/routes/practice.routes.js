const express = require('express');
const router = express.Router();
const { 
  getAdaptiveDifficulty, 
  submitAssessment, 
  getPendingRetries, 
  getWeakTopics, 
  explainAnswer 
} = require('../controllers/practice.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const submitSchema = {
  subject: { required: true, type: 'string' },
  topic: { required: true, type: 'string' },
  score: { required: true, type: 'number' },
  totalQuestions: { required: true, type: 'number' }
};

const explainSchema = {
  questionText: { required: true, type: 'string' },
  correctAnswer: { required: true, type: 'string' }
};

// All Practice Engine routes require JWT protection
router.use(protect);

router.get('/adaptive-difficulty', getAdaptiveDifficulty);
router.post('/submit', validateRequest(submitSchema), submitAssessment);
router.get('/retry-queue', getPendingRetries);
router.get('/weak-topics', getWeakTopics);
router.post('/explain-answer', validateRequest(explainSchema), explainAnswer);

module.exports = router;
