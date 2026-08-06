const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../app/models/User.model');
const FaceProfile = require('../app/models/FaceProfile.model');

const clearAuthData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Error: MONGODB_URI missing in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const userCount = await User.countDocuments();
    const profileCount = await FaceProfile.countDocuments();

    console.log(`Found ${userCount} users and ${profileCount} face profiles.`);

    await User.deleteMany({});
    await FaceProfile.deleteMany({});

    console.log('[SUCCESS] All users and face profiles have been deleted from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
};

clearAuthData();
