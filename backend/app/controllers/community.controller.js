const CommunityPost = require('../models/CommunityPost.model');

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Private
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find()
      .populate('author', 'name department')
      .sort('-createdAt');

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// @desc    Create post
// @route   POST /api/community/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    const post = await CommunityPost.create(req.body);

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Upvote post
// @route   POST /api/community/posts/:id/upvote
// @access  Private
exports.upvotePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (!post.upvotedBy.includes(req.user.id)) {
      post.upvotes += 1;
      post.upvotedBy.push(req.user.id);
      await post.save();
    }

    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};
