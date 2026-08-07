const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  evaluateSession, 
  generateFollowup, 
  getReport, 
  getHistory 
} = require('../controllers/interview.controller');

router.post('/evaluate', protect, evaluateSession);
router.post('/followup', protect, generateFollowup);
router.get('/report/:interviewId', protect, getReport);
router.get('/history', protect, getHistory);

module.exports = router;
