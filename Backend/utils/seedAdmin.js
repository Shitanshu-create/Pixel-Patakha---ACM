import mongoose from 'mongoose';
import { mongoUri, adminName, adminEmail, adminPassword } from '../config/env.js';
import User from '../models/User.model.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for admin seeding...');

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingAdmin) {
      console.log(`Admin account with email "${adminEmail}" already exists.`);
      process.exit(0);
    }

    const admin = new User({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'admin',
    });

    await admin.save();
    console.log(`Admin account created successfully: ${adminEmail}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
