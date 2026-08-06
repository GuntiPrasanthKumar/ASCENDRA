const User = require('../models/User.model.js');
const FaceProfile = require('../models/FaceProfile.model.js');
const { decryptEmbedding, cosineSimilarity } = require('../utils/crypto.utils.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
};

// Euclidean distance fallback
const getEuclideanDistance = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) return 1.0;
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
  }
  return Math.sqrt(sum);
};

const register = async (req, res) => {
  try {
    const { name, email, password, department, role, faceDescriptor } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    let passwordHash = null;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password_hash: passwordHash,
      department: department || 'CSE',
      role: role || 'Student',
      faceDescriptor: faceDescriptor || []
    });

    const savedUser = await user.save();
    const token = generateToken(savedUser);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        department: savedUser.department
      }
    });

  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        message: 'Login successful',
        token: generateToken(user),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const faceLogin = async (req, res) => {
  try {
    const { email, faceDescriptor } = req.body;

    if (!email || !faceDescriptor) {
      return res.status(400).json({ message: 'Email and face data required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let isMatch = false;

    // Check encrypted FaceProfile first (MediaPipe 512-float vector)
    const faceProfile = await FaceProfile.findOne({ userId: user._id });
    if (faceProfile && Array.isArray(faceDescriptor) && faceDescriptor.length === 512) {
      try {
        const enrolledEmbedding = decryptEmbedding(
          faceProfile.embeddingCipher,
          faceProfile.iv,
          faceProfile.authTag
        );
        const score = cosineSimilarity(enrolledEmbedding, faceDescriptor);
        if (score >= 0.60) {
          isMatch = true;
        }
      } catch (decryptErr) {
        console.warn('FaceProfile decryption error:', decryptErr.message);
      }
    }

    // Fallback: check user.faceDescriptor (Euclidean distance)
    if (!isMatch && user.faceDescriptor && user.faceDescriptor.length > 0) {
      const distance = getEuclideanDistance(user.faceDescriptor, faceDescriptor);
      if (distance <= 0.6) {
        isMatch = true;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Face not recognized' });
    }

    res.json({
      message: 'Face login successful',
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error('Face login error:', err.message);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const user = await User.findById(userId).select('-password_hash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, faceLogin, getMe };
