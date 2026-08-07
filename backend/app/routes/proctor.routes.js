const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  enrollFaceProfile, 
  verifyIdentity, 
  recordEvidence,
  generateReport,
  getReport,
  getViolations 
} = require('../controllers/proctor.controller');

router.post('/enroll', protect, enrollFaceProfile);
router.post('/verify', protect, verifyIdentity);
router.post('/evidence', protect, recordEvidence);
router.post('/report', protect, generateReport);
router.get('/report/:sessionId', protect, getReport);
router.get('/violations/:sessionId', protect, getViolations);

module.exports = router;
