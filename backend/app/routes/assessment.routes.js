const express = require('express');
const router = express.Router();
const { saveResult, getMyResults, generateQuestions, discoverTopics } = require('../controllers/assessment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/discover', protect, discoverTopics);
router.post('/save', protect, saveResult);
router.get('/my-results', protect, getMyResults);
router.post('/generate', protect, generateQuestions);

module.exports = router;
