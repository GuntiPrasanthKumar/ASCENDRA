const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  chat, 
  streamChat, 
  discover, 
  generateAssessment, 
  getRecommendations, 
  clearMemory,
  executeAction,
  getMemory,
  updateMemory,
  getPlanner
} = require('../controllers/ai.controller');

router.post('/chat', protect, chat);
router.post('/chat/stream', protect, streamChat);
router.post('/discover', protect, discover);
router.post('/assessments/generate', protect, generateAssessment);
router.get('/recommendations', protect, getRecommendations);
router.delete('/chat/memory', protect, clearMemory);

// Phase A AI Operating System Core Endpoints
router.post('/action', protect, executeAction);
router.get('/memory', protect, getMemory);
router.put('/memory', protect, updateMemory);
router.get('/planner', protect, getPlanner);

module.exports = router;
