const express = require('express');
const router = express.Router();
const { saveResult, getMyResults, generateQuestions, discoverTopics } = require('../controllers/assessment.controller');
const { 
  startAssessment, 
  autoSaveProgress, 
  recoverSession, 
  submitAssessment, 
  getReview 
} = require('../controllers/assessmentEngine.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const startSchema = {
  subject: { required: true, type: 'string' },
  topic: { required: true, type: 'string' }
};

const autoSaveSchema = {
  sessionId: { required: true, type: 'string' }
};

const submitSchema = {
  sessionId: { required: true, type: 'string' }
};

// All Assessment routes require JWT protection
router.use(protect);

// Legacy Assessment Endpoints (Preserved for Backward Compatibility)
router.post('/discover', discoverTopics);
router.post('/save', saveResult);
router.get('/my-results', getMyResults);
router.post('/generate', generateQuestions);

// Enterprise Assessment Engine Lifecycle Endpoints
router.post('/start', validateRequest(startSchema), startAssessment);
router.post('/autosave', validateRequest(autoSaveSchema), autoSaveProgress);
router.get('/recover/:sessionId', recoverSession);
router.post('/submit', validateRequest(submitSchema), submitAssessment);
router.get('/review/:sessionId', getReview);

module.exports = router;
