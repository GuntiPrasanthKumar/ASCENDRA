const User = require('../models/User.model.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
};

// Euclidean distance for face matching
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

    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      // password_hash removed
      department: department || 'CSE',
      role: role || 'Student',
      faceDescriptor: faceDescriptor // 128-float array from frontend
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

    if (!user.faceDescriptor || user.faceDescriptor.length === 0) {
      return res.status(400).json({ message: 'No face data found for this account' });
    }

    // Compare descriptors using Euclidean distance
    const distance = getEuclideanDistance(user.faceDescriptor, faceDescriptor);

    // face-api.js recommended threshold is usually 0.6
    if (distance > 0.6) {
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
    const user = await User.findById(req.user.id).select('-password_hash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, faceLogin, getMe };
