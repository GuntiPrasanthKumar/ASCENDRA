const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { 
  runCode, 
  submitCode, 
  getHints, 
  debugCode, 
  getSubmissions, 
  autoSaveDraft 
} = require('../controllers/codelab.controller');

router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.post('/hints', protect, getHints);
router.post('/debug', protect, debugCode);
router.get('/submissions/:problemId', protect, getSubmissions);
router.post('/autosave', protect, autoSaveDraft);

module.exports = router;
