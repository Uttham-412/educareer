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

    // Create real job opportunities and internships
    const sampleJobs = [
      {
        title: 'Google STEP Internship Program',
        company: 'Google',
        description: 'Student Training in Engineering Program for first and second-year undergraduate students. Work on real projects with Google engineers.',
        requirements: 'Currently enrolled in CS or related field, First or second year student, Programming experience',
        location: 'Multiple locations (Mountain View, New York, etc.)',
        jobType: 'internship',
        salaryRange: '$7,500/month',
        applicationDeadline: new Date('2025-01-15'),
        applicationUrl: 'https://careers.google.com/students/',
        contactEmail: 'step-program@google.com',
        isActive: true,
        postedBy: users[0]._id,
      },
      {
        title: 'Microsoft Explore Program',
        company: 'Microsoft',
        description: '12-week internship program for first and second-year college students. Gain hands-on experience in software engineering or program management.',
        requirements: 'First or second year student, CS or related major, Strong problem-solving skills',
        location: 'Redmond, WA',
        jobType: 'internship',
        salaryRange: '$7,000/month',
        applicationDeadline: new Date('2025-02-01'),
        applicationUrl: 'https://careers.microsoft.com/students/us/en/usexploremicrosoftprogram',
        contactEmail: 'explore@microsoft.com',
        isActive: true,
        postedBy: users[1]._id,
      },
      {
        title: 'Amazon Future Engineer Internship',
        company: 'Amazon',
        description: 'Paid internship program for students from underrepresented communities in tech. Work on real Amazon projects.',
        requirements: 'Underrepresented in tech, CS or related major, Strong programming skills',
        location: 'Seattle, WA',
        jobType: 'internship',
        salaryRange: '$6,500/month',
        applicationDeadline: new Date('2025-03-01'),
        applicationUrl: 'https://www.amazonfutureengineer.com/internships',
        contactEmail: 'future-engineer@amazon.com',
        isActive: true,
        postedBy: users[0]._id,
      },
      {
        title: 'Meta University Internship',
        company: 'Meta (Facebook)',
        description: 'Hands-on software engineering experience for underrepresented students. Build real products used by billions.',
        requirements: 'Underrepresented in tech, First or second year student, Programming experience',
        location: 'Menlo Park, CA',
        jobType: 'internship',
        salaryRange: '$8,000/month',
        applicationDeadline: new Date('2025-01-30'),
        applicationUrl: 'https://www.metacareers.com/students/',
        contactEmail: 'university@meta.com',
        isActive: true,
        postedBy: users[1]._id,
      },
      {
        title: 'Salesforce Futureforce Internship',
        company: 'Salesforce',
        description: 'Summer internship program across various technology roles. Work on cutting-edge cloud technologies.',
        requirements: 'Currently enrolled student, CS or related field, Passion for technology',
        location: 'San Francisco, CA',
        jobType: 'internship',
        salaryRange: '$6,800/month',
        applicationDeadline: new Date('2025-04-01'),
        applicationUrl: 'https://salesforce.wd1.myworkdayjobs.com/Futureforce_Internships',
        contactEmail: 'futureforce@salesforce.com',
        isActive: true,
        postedBy: users[0]._id,
      },
      {
        title: 'Software Engineer - New Grad',
        company: 'Stripe',
        description: 'Join our engineering team to build the economic infrastructure for the internet. Work on payments, financial services, and developer tools.',
        requirements: 'BS/MS in Computer Science or related field, Strong programming skills, Experience with web technologies',
        location: 'San Francisco, CA / Remote',
        jobType: 'full-time',
        salaryRange: '$130,000-180,000',
        applicationDeadline: new Date('2025-06-01'),
        applicationUrl: 'https://stripe.com/jobs/search?q=new%20grad',
        contactEmail: 'university-recruiting@stripe.com',
        isActive: true,
        postedBy: users[1]._id,
      },
      {
        title: 'Data Scientist - Entry Level',
        company: 'Netflix',
        description: 'Use data to help Netflix create amazing experiences for our members. Work with recommendation algorithms, A/B testing, and analytics.',
        requirements: 'MS/PhD in quantitative field, Python/R programming, Machine learning experience, Statistics background',
        location: 'Los Gatos, CA',
        jobType: 'full-time',
        salaryRange: '$140,000-200,000',
        applicationDeadline: new Date('2025-05-15'),
        applicationUrl: 'https://jobs.netflix.com/jobs',
        contactEmail: 'data-science-recruiting@netflix.com',
        isActive: true,
        postedBy: users[0]._id,
      },
      {
        title: 'Frontend Engineer - React',
        company: 'Airbnb',
        description: 'Build beautiful, accessible, and performant user interfaces that help people belong anywhere. Work with React, TypeScript, and modern web technologies.',
        requirements: 'BS in Computer Science or equivalent, 0-2 years experience, Strong JavaScript/React skills, Eye for design',
        location: 'San Francisco, CA',
        jobType: 'full-time',
        salaryRange: '$120,000-160,000',
        applicationDeadline: new Date('2025-07-01'),
        applicationUrl: 'https://careers.airbnb.com/positions/',
        contactEmail: 'frontend-recruiting@airbnb.com',
        isActive: true,
        postedBy: users[1]._id,
      }
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