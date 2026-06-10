const express = require('express');
const {
  logViolation,
  getLogs
} = require('../controllers/proctoring.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(protect);

router.post('/log', logViolation);
router.get('/user/:userId', authorize('admin', 'instructor'), getLogs);

module.exports = router;
