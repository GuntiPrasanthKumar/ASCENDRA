const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  getNotifications, 
  markAllRead, 
  generateMorningBrief, 
  generateEveningReview, 
  getDigest, 
  getPreferences, 
  updatePreferences 
} = require('../controllers/notification.controller');

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllRead);
router.post('/morning-brief', protect, generateMorningBrief);
router.post('/evening-review', protect, generateEveningReview);
router.get('/digest', protect, getDigest);
router.get('/preferences', protect, getPreferences);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
