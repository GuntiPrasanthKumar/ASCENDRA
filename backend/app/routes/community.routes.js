const express = require('express');
const {
  getPosts,
  createPost,
  upvotePost
} = require('../controllers/community.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getPosts)
  .post(createPost);

router.post('/:id/upvote', upvotePost);

module.exports = router;
