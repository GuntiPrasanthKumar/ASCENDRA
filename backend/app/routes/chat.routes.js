const express = require('express');
const {
  getChatHistory,
  sendMessage,
  clearChat
} = require('../controllers/chat.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getChatHistory)
  .post(sendMessage)
  .delete(clearChat);

module.exports = router;
