const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  enrollFaceProfile, 
  verifyIdentity, 
  getViolations 
} = require('../controllers/proctor.controller');

router.post('/enroll', protect, enrollFaceProfile);
router.post('/verify', protect, verifyIdentity);
router.get('/violations/:sessionId', protect, getViolations);

module.exports = router;
