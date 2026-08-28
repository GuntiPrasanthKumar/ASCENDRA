const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { requireFaculty } = require('../middleware/faculty.middleware');
const { 
  getWorkspaceOverview, 
  getCourses, 
  createCourse, 
  generateAIContent, 
  getAtRiskStudents, 
  getAssignments, 
  gradeSubmissionAI, 
  getBatchAnalytics 
} = require('../controllers/faculty.controller');

router.get('/workspace', protect, requireFaculty, getWorkspaceOverview);
router.get('/courses', protect, requireFaculty, getCourses);
router.post('/courses', protect, requireFaculty, createCourse);
router.post('/ai/generate-content', protect, requireFaculty, generateAIContent);
router.get('/students/risk-detection', protect, requireFaculty, getAtRiskStudents);
router.get('/assignments', protect, requireFaculty, getAssignments);
router.post('/assignments/grade', protect, requireFaculty, gradeSubmissionAI);
router.get('/analytics/batch', protect, requireFaculty, getBatchAnalytics);

module.exports = router;
