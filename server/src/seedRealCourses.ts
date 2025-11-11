import mongoose from 'mongoose';
import { RealCourse } from './models/RealCourse';
import dotenv from 'dotenv';

dotenv.config();

const realCourses = [
  // Computer Science & Programming Courses
  {
    title: 'CS50: Introduction to Computer Science',
    provider: 'Harvard University',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming.',
    category: 'Computer Science',
    level: 'Beginner',
    duration: '12 weeks',
    price: 'Free (Certificate: $199)',
    rating: 4.9,
    enrollmentUrl: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
    skills: ['Programming', 'C', 'Python', 'SQL', 'JavaScript', 'HTML', 'CSS'],
    prerequisites: [],
    targetYear: [1, 2],
    relatedSubjects: ['Computer Science', 'Programming', 'Introduction to Computing'],
    certificateOffered: true,
    language: 'English',
    platform: 'edX'
  },
  {
    title: 'Python for Everybody Specialization',
    provider: 'University of Michigan',
    description: 'Learn to Program and Analyze Data with Python. Develop programs to gather, clean, analyze, and visualize data.',
    category: 'Programming',
    level: 'Beginner',
    duration: '8 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.8,
    enrollmentUrl: 'https://www.coursera.org/specializations/python',
    skills: ['Python', 'Data Analysis', 'Web Scraping', 'Databases'],
    prerequisites: [],
    targetYear: [1, 2, 3],
    relatedSubjects: ['Python', 'Programming', 'Data Structures'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Data Structures and Algorithms Specialization',
    provider: 'UC San Diego',
    description: 'Master Algorithmic Programming Techniques. Learn algorithms through programming and advance your software engineering career.',
    category: 'Computer Science',
    level: 'Intermediate',
    duration: '6 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.7,
    enrollmentUrl: 'https://www.coursera.org/specializations/data-structures-algorithms',
    skills: ['Data Structures', 'Algorithms', 'Problem Solving', 'C++', 'Java'],
    prerequisites: ['Basic Programming'],
    targetYear: [2, 3],
    relatedSubjects: ['Data Structures', 'Algorithms', 'Programming'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Full Stack Web Development with React',
    provider: 'Hong Kong University of Science and Technology',
    description: 'Learn front-end and hybrid mobile development, with server-side support, for implementing a multi-platform solution.',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '4 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.7,
    enrollmentUrl: 'https://www.coursera.org/specializations/full-stack-react',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Bootstrap'],
    prerequisites: ['HTML', 'CSS', 'JavaScript'],
    targetYear: [2, 3, 4],
    relatedSubjects: ['Web Development', 'JavaScript', 'Database Systems'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Machine Learning Specialization',
    provider: 'Stanford University & DeepLearning.AI',
    description: 'Break into AI with the Machine Learning Specialization. Master fundamental AI concepts and develop practical machine learning skills.',
    category: 'Machine Learning',
    level: 'Intermediate',
    duration: '3 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.9,
    enrollmentUrl: 'https://www.coursera.org/specializations/machine-learning-introduction',
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Neural Networks'],
    prerequisites: ['Python', 'Basic Math'],
    targetYear: [3, 4],
    relatedSubjects: ['Machine Learning', 'Artificial Intelligence', 'Data Science'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'Amazon Web Services',
    description: 'Learn cloud computing basics and prepare for the AWS Certified Cloud Practitioner exam.',
    category: 'Cloud Computing',
    level: 'Beginner',
    duration: '6 hours',
    price: 'Free',
    rating: 4.6,
    enrollmentUrl: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
    skills: ['AWS', 'Cloud Computing', 'Cloud Architecture'],
    prerequisites: [],
    targetYear: [2, 3, 4],
    relatedSubjects: ['Cloud Computing', 'Distributed Systems', 'Computer Networks'],
    certificateOffered: true,
    language: 'English',
    platform: 'AWS Training'
  },
  {
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Google',
    description: 'Prepare for a career in data analytics. Learn in-demand skills like data cleaning, analysis, and visualization.',
    category: 'Data Analytics',
    level: 'Beginner',
    duration: '6 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.8,
    enrollmentUrl: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    skills: ['Data Analysis', 'SQL', 'Tableau', 'R Programming', 'Data Visualization'],
    prerequisites: [],
    targetYear: [2, 3, 4],
    relatedSubjects: ['Data Analytics', 'Statistics', 'Database Systems'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Meta Front-End Developer Professional Certificate',
    provider: 'Meta (Facebook)',
    description: 'Launch your career as a front-end developer. Build job-ready skills for an in-demand career.',
    category: 'Web Development',
    level: 'Beginner',
    duration: '7 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.7,
    enrollmentUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'UI/UX', 'Git'],
    prerequisites: [],
    targetYear: [1, 2, 3],
    relatedSubjects: ['Web Development', 'HTML', 'CSS', 'JavaScript'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'IBM Data Science Professional Certificate',
    provider: 'IBM',
    description: 'Kickstart your career in data science. Master the most up-to-date practical skills and knowledge.',
    category: 'Data Science',
    level: 'Beginner',
    duration: '11 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.6,
    enrollmentUrl: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    skills: ['Python', 'Data Science', 'Machine Learning', 'SQL', 'Data Visualization'],
    prerequisites: [],
    targetYear: [2, 3, 4],
    relatedSubjects: ['Data Science', 'Python', 'Statistics', 'Machine Learning'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Cybersecurity Fundamentals',
    provider: 'IBM',
    description: 'Learn cybersecurity basics and prepare for entry-level cybersecurity roles.',
    category: 'Cybersecurity',
    level: 'Beginner',
    duration: '3 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.7,
    enrollmentUrl: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst',
    skills: ['Cybersecurity', 'Network Security', 'Incident Response', 'Compliance'],
    prerequisites: [],
    targetYear: [2, 3, 4],
    relatedSubjects: ['Cybersecurity', 'Computer Networks', 'Information Security'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Android App Development',
    provider: 'Google',
    description: 'Learn to build Android apps with Kotlin. Create beautiful, functional Android apps.',
    category: 'Mobile Development',
    level: 'Intermediate',
    duration: '5 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.6,
    enrollmentUrl: 'https://www.coursera.org/professional-certificates/google-android-developer',
    skills: ['Android', 'Kotlin', 'Mobile Development', 'UI Design'],
    prerequisites: ['Basic Programming'],
    targetYear: [2, 3, 4],
    relatedSubjects: ['Mobile Development', 'Android', 'Software Engineering'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Deep Learning Specialization',
    provider: 'DeepLearning.AI',
    description: 'Build and train deep neural networks. Master deep learning fundamentals.',
    category: 'Deep Learning',
    level: 'Advanced',
    duration: '5 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.9,
    enrollmentUrl: 'https://www.coursera.org/specializations/deep-learning',
    skills: ['Deep Learning', 'Neural Networks', 'TensorFlow', 'Python', 'CNN', 'RNN'],
    prerequisites: ['Machine Learning', 'Python', 'Linear Algebra'],
    targetYear: [3, 4],
    relatedSubjects: ['Deep Learning', 'Machine Learning', 'Artificial Intelligence'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'DevOps and Software Engineering',
    provider: 'IBM',
    description: 'Master DevOps, Agile, Scrum, CI/CD and Cloud Native with hands-on projects.',
    category: 'DevOps',
    level: 'Intermediate',
    duration: '4 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.6,
    enrollmentUrl: 'https://www.coursera.org/professional-certificates/devops-and-software-engineering',
    skills: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Git', 'Agile'],
    prerequisites: ['Basic Programming', 'Linux'],
    targetYear: [3, 4],
    relatedSubjects: ['Software Engineering', 'Cloud Computing', 'System Administration'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'UI/UX Design Specialization',
    provider: 'California Institute of the Arts',
    description: 'Learn to design and prototype effective, delightful user experiences for websites and mobile apps.',
    category: 'Design',
    level: 'Beginner',
    duration: '6 months',
    price: 'Free (Certificate: $49/month)',
    rating: 4.7,
    enrollmentUrl: 'https://www.coursera.org/specializations/ui-ux-design',
    skills: ['UI Design', 'UX Design', 'Prototyping', 'User Research', 'Figma'],
    prerequisites: [],
    targetYear: [2, 3, 4],
    relatedSubjects: ['UI/UX Design', 'Human-Computer Interaction', 'Web Development'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  },
  {
    title: 'Blockchain Basics',
    provider: 'University at Buffalo',
    description: 'Learn blockchain basics and understand the technology behind cryptocurrencies.',
    category: 'Blockchain',
    level: 'Beginner',
    duration: '4 weeks',
    price: 'Free (Certificate: $49)',
    rating: 4.6,
    enrollmentUrl: 'https://www.coursera.org/learn/blockchain-basics',
    skills: ['Blockchain', 'Cryptocurrency', 'Smart Contracts', 'Distributed Systems'],
    prerequisites: ['Basic Programming'],
    targetYear: [3, 4],
    relatedSubjects: ['Blockchain', 'Distributed Systems', 'Cryptography'],
    certificateOffered: true,
    language: 'English',
    platform: 'Coursera'
  }
];

export const seedRealCourses = async () => {
  try {
    console.log('🌱 Seeding real courses database...');
    
    // Clear existing courses
    await RealCourse.deleteMany({});
    console.log('Cleared existing courses');

    // Insert real courses
    await RealCourse.insertMany(realCourses);
    console.log(`✅ Successfully seeded ${realCourses.length} real courses`);

    return { success: true, count: realCourses.length };
  } catch (error) {
    console.error('❌ Error seeding real courses:', error);
    throw error;
  }
};

// Run this script directly if called
if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edu-career-ai')
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedRealCourses();
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}