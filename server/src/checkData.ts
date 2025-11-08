import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import { Course, Enrollment, TimetableSlot, Assignment, Submission } from './models/Course';
import { JobOpportunity, JobApplication, Resume } from './models/Job';
import Notification from './models/Notification';

dotenv.config();

export const checkDatabaseStatus = async () => {
  try {
    console.log('📊 Checking database status...\n');

    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const enrollmentCount = await Enrollment.countDocuments();
    const timetableCount = await TimetableSlot.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const submissionCount = await Submission.countDocuments();
    const jobCount = await JobOpportunity.countDocuments();
    const applicationCount = await JobApplication.countDocuments();
    const resumeCount = await Resume.countDocuments();
    const notificationCount = await Notification.countDocuments();

    console.log('📈 Database Statistics:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`📚 Courses: ${courseCount}`);
    console.log(`📝 Enrollments: ${enrollmentCount}`);
    console.log(`🗓️  Timetable Slots: ${timetableCount}`);
    console.log(`📋 Assignments: ${assignmentCount}`);
    console.log(`📄 Submissions: ${submissionCount}`);
    console.log(`💼 Job Opportunities: ${jobCount}`);
    console.log(`📨 Job Applications: ${applicationCount}`);
    console.log(`📄 Resumes: ${resumeCount}`);
    console.log(`🔔 Notifications: ${notificationCount}`);

    const totalRecords = userCount + courseCount + enrollmentCount + timetableCount + 
                        assignmentCount + submissionCount + jobCount + applicationCount + 
                        resumeCount + notificationCount;

    console.log(`\n📊 Total Records: ${totalRecords}`);
    
    if (totalRecords === 0) {
      console.log('✅ Database is clean - no sample data present');
    } else {
      console.log('📦 Database contains data');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
};

// Run this script directly if called
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-career-ai')
    .then(async () => {
      console.log('Connected to MongoDB');
      await checkDatabaseStatus();
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}