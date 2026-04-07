require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@elroyale.com' });
    if (existing) {
      console.log('⚠️  Admin already exists');
      process.exit();
    }

    await User.create({
      name: 'Admin',
      email: 'admin@elroyale.com',
      password: 'Admin@1234',
      role: 'admin'
    });

    console.log('✅ Admin account created!');
    console.log('   Email: admin@elroyale.com');
    console.log('   Password: Admin@1234');
    process.exit();

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();