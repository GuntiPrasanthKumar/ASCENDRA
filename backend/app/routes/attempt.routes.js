const express = require('express');
const {
  startAttempt,
  submitAttempt
} = require('../controllers/attempt.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/start', startAttempt);
router.post('/:id/submit', submitAttempt);

module.exports = router;
