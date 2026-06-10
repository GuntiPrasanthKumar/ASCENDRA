const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: false },
  role: { 
    type: String, 
    enum: ['Student', 'Faculty', 'Admin', 'student', 'faculty', 'admin'], 
    default: 'Student' 
  },
  department: { type: String, default: 'CSE' },
  faceImage: { type: String, default: null },
  faceDescriptor: { type: [Number], default: [] },
  total_score: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  badges: { type: Array, default: [] },
  last_active: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  strict: false
})

// Modern Mongoose async pre-save hook
userSchema.pre('save', async function() {
  if (this.role) {
    this.role = this.role.charAt(0).toUpperCase() + this.role.slice(1).toLowerCase();
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
