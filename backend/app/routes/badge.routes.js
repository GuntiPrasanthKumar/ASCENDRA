const express = require('express');
const { getBadges } = require('../controllers/badge.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getBadges);

module.exports = router;
