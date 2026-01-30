import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config.js/config.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@selection.com';
        const adminPassword = 'admin123';
        const adminName = 'Admin User';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });

        await newAdmin.save();
        console.log('Admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
