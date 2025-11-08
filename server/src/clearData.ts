import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import { Course, Enrollment, TimetableSlot, Assignment, Submission } from './models/Course';
import { JobOpportunity, JobApplication, Resume } from './models/Job';
import Notification from './models/Notification';

dotenv.config();

export const clearAllData = async () => {
  try {
    console.log('🗑️  Clearing all sample data from database...');

    // Clear all collections
    await User.deleteMany({});
    console.log('✅ Cleared users');

    await Course.deleteMany({});
    console.log('✅ Cleared courses');

    await Enrollment.deleteMany({});
    console.log('✅ Cleared enrollments');

    await TimetableSlot.deleteMany({});
    console.log('✅ Cleared timetable slots');

    await Assignment.deleteMany({});
    console.log('✅ Cleared assignments');

    await Submission.deleteMany({});
    console.log('✅ Cleared submissions');

    await JobOpportunity.deleteMany({});
    console.log('✅ Cleared job opportunities');

    await JobApplication.deleteMany({});
    console.log('✅ Cleared job applications');

    await Resume.deleteMany({});
    console.log('✅ Cleared resumes');

    await Notification.deleteMany({});
    console.log('✅ Cleared notifications');

    console.log('🎉 All sample data has been cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

// Run this script directly if called
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-career-ai')
    .then(async () => {
      console.log('Connected to MongoDB');
      await clearAllData();
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}