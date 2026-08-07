const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getPlacementDashboard, generatePlacementChallenge } = require('../controllers/placement.controller');

router.get('/dashboard', protect, getPlacementDashboard);
router.post('/generate-challenge', protect, generatePlacementChallenge);

module.exports = router;
