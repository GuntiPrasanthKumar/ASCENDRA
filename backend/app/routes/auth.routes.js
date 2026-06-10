const express = require('express')
const router = express.Router()
const { register, login, faceLogin, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/register', register)
router.post('/login', login)
router.post('/face-login', faceLogin)
router.get('/me', protect, getMe)

router.get('/users-list', async (req, res) => {
  const User = require('../models/User.model')
  const users = await User.find({}, 'name email department faceImage createdAt')
  res.json({
    count: users.length,
    users: users.map(u => ({
      name: u.name,
      email: u.email,
      hasFace: !!u.faceImage,
      created: u.createdAt
    }))
  })
})

module.exports = router
