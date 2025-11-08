import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import { Course, TimetableSlot, Assignment } from './models/Course';
import { JobOpportunity } from './models/Job';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await TimetableSlot.deleteMany({});
    await Assignment.deleteMany({});
    await JobOpportunity.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleUsers = [
      {
        email: 'john.doe@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Computer Science student passionate about web development',
        location: 'New York, NY',
        occupation: 'Student',
        experienceLevel: 'Beginner',
        skills: ['JavaScript', 'React', 'Node.js'],
      },
      {
        email: 'jane.smith@example.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Data Science enthusiast with a focus on machine learning',
        location: 'San Francisco, CA',
        occupation: 'Student',
        experienceLevel: 'Intermediate',
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
      },
    ];

    const users = await User.insertMany(sampleUsers);
    console.log('Sample users created');

    // Create sample courses
    const sampleCourses = [
      {
        name: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'Fundamental concepts of computer science and programming',
        credits: 3,
        department: 'Computer Science',
        instructor: 'Dr. Smith',
        semester: 'Fall',
        year: 2024,
      },
      {
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        description: 'Advanced data structures and algorithmic problem solving',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Prof. Johnson',
        semester: 'Spring',
        year: 2024,
      },
      {
        name: 'Web Development',
        code: 'CS301',
        description: 'Full-stack web development with modern frameworks',
        credits: 3,
        department: 'Computer Science',
        instructor: 'Dr. Brown',
        semester: 'Fall',
        year: 2024,
      },
      {
        name: 'Database Systems',
        code: 'CS302',
        description: 'Database design, implementation, and management',
        credits: 3,
        department: 'Computer Science',
        instructor: 'Prof. Davis',
        semester: 'Spring',
        year: 2024,
      },
    ];

    const courses = await Course.insertMany(sampleCourses);
    console.log('Sample courses created');

    // Create sample timetable slots
    const sampleTimetableSlots = [
      {
        courseId: courses[0]._id,
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
        slotType: 'lecture',
      },
      {
        courseId: courses[0]._id,
        dayOfWeek: 3, // Wednesday
        startTime: '09:00',
        endTime: '10:30',
        room: 'Room 101',
        slotType: 'lecture',
      },
      {
        courseId: courses[1]._id,
        dayOfWeek: 2, // Tuesday
        startTime: '11:00',
        endTime: '12:30',
        room: 'Room 201',
        slotType: 'lecture',
      },
      {
        courseId: courses[1]._id,
        dayOfWeek: 4, // Thursday
        startTime: '11:00',
        endTime: '12:30',
        room: 'Room 201',
        slotType: 'lecture',
      },
    ];

    await TimetableSlot.insertMany(sampleTimetableSlots);
    console.log('Sample timetable slots created');

    // Create sample assignments
    const sampleAssignments = [
      {
        courseId: courses[0]._id,
        title: 'Programming Assignment 1',
        description: 'Implement basic sorting algorithms',
        dueDate: new Date('2024-12-15'),
        totalPoints: 100,
        assignmentType: 'homework',
      },
      {
        courseId: courses[1]._id,
        title: 'Data Structure Implementation',
        description: 'Implement a binary search tree',
        dueDate: new Date('2024-12-20'),
        totalPoints: 150,
        assignmentType: 'project',
      },
    ];

    await Assignment.insertMany(sampleAssignments);
    console.log('Sample assignments created');

    // Create sample job opportunities
    const sampleJobs = [
      {
        title: 'Frontend Developer Intern',
        company: 'TechCorp Inc.',
        description: 'Join our team as a frontend developer intern and work on exciting web applications',
        requirements: 'Knowledge of React, JavaScript, HTML, CSS',
        location: 'New York, NY',
        jobType: 'internship',
        salaryRange: '$15-20/hour',
        applicationDeadline: new Date('2024-12-31'),
        contactEmail: 'hr@techcorp.com',
        isActive: true,
        postedBy: users[0]._id,
      },
      {
        title: 'Data Science Intern',
        company: 'DataTech Solutions',
        description: 'Work with our data science team on machine learning projects',
        requirements: 'Python, pandas, scikit-learn, statistics background',
        location: 'San Francisco, CA',
        jobType: 'internship',
        salaryRange: '$18-25/hour',
        applicationDeadline: new Date('2024-12-25'),
        contactEmail: 'careers@datatech.com',
        isActive: true,
        postedBy: users[1]._id,
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        description: 'Join our growing startup as a full stack developer',
        requirements: 'React, Node.js, MongoDB, 2+ years experience',
        location: 'Remote',
        jobType: 'full-time',
        salaryRange: '$70,000-90,000',
        applicationDeadline: new Date('2025-01-15'),
        contactEmail: 'jobs@startupxyz.com',
        isActive: true,
        postedBy: users[0]._id,
      },
    ];

    await JobOpportunity.insertMany(sampleJobs);
    console.log('Sample job opportunities created');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
// Run this script directly if called
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-career-ai')
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedDatabase();
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}