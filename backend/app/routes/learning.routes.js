const express = require('express');
const router = express.Router();
const { 
  getLearningGraph, 
  recordProgress, 
  getResumeLearning, 
  createGoal, 
  getGoals, 
  createNote, 
  getNotes, 
  toggleBookmark, 
  getBookmarks, 
  getRecommendations 
} = require('../controllers/learning.controller');
const { startDiagnostic, submitAnswer } = require('../controllers/diagnostic.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateRequest } = require('../middleware/validation.middleware');

const progressSchema = {
  subjectId: { required: true, type: 'string' },
  chapterId: { required: true, type: 'string' },
  lessonId: { required: true, type: 'string' }
};

const goalSchema = {
  title: { required: true, type: 'string' },
  targetSubjectId: { required: true, type: 'string' },
  targetCompletionDate: { required: true, type: 'string' }
};

const noteSchema = {
  subjectId: { required: true, type: 'string' },
  lessonId: { required: true, type: 'string' },
  content: { required: true, type: 'string', minLength: 3 }
};

const bookmarkSchema = {
  subjectId: { required: true, type: 'string' },
  chapterId: { required: true, type: 'string' },
  lessonId: { required: true, type: 'string' }
};

// All Learning Engine routes require JWT protection
router.use(protect);

router.get('/graph', getLearningGraph);
router.post('/progress', validateRequest(progressSchema), recordProgress);
router.get('/resume', getResumeLearning);
router.post('/goals', validateRequest(goalSchema), createGoal);
router.get('/goals', getGoals);
router.post('/notes', validateRequest(noteSchema), createNote);
router.get('/notes', getNotes);
router.post('/bookmarks', validateRequest(bookmarkSchema), toggleBookmark);
router.get('/bookmarks', getBookmarks);
router.get('/recommendations', getRecommendations);

// Diagnostic Assessment Engine Routes
router.post('/diagnostic/start', startDiagnostic);
router.post('/diagnostic/answer', submitAnswer);

module.exports = router;
