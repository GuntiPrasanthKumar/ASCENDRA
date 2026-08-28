const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  analyzeATS, 
  saveResume, 
  getGitHubAnalysis, 
  getSkillGaps, 
  getRoadmap, 
  getJobReadiness 
} = require('../controllers/career.controller');

router.post('/ats/analyze', protect, analyzeATS);
router.post('/resume/save', protect, saveResume);
router.get('/github/:handle', protect, getGitHubAnalysis);
router.post('/skill-gap', protect, getSkillGaps);
router.get('/roadmap', protect, getRoadmap);
router.get('/readiness', protect, getJobReadiness);

module.exports = router;
