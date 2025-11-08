import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Course, Enrollment, TimetableSlot, Assignment, Submission } from '../models/Course';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user enrollments
router.get('/enrollments', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const enrollments = await Enrollment.find({ userId }).populate('courseId');
    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enroll in course
router.post('/enroll', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user!._id;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({ userId, courseId });
    await enrollment.save();

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user timetable
router.get('/timetable', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const enrollments = await Enrollment.find({ userId, status: 'active' }).populate('courseId');
    const courseIds = enrollments.map(e => e.courseId);
    
    const timetableSlots = await TimetableSlot.find({ 
      courseId: { $in: courseIds } 
    }).populate('courseId');

    res.json(timetableSlots);
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assignments for user's courses
router.get('/assignments', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    
    const enrollments = await Enrollment.find({ userId, status: 'active' });
    const courseIds = enrollments.map(e => e.courseId);
    
    const assignments = await Assignment.find({ 
      courseId: { $in: courseIds } 
    }).populate('courseId');

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit assignment
router.post('/assignments/:assignmentId/submit', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { assignmentId } = req.params;
    const { submissionText, fileUrl } = req.body;
    const userId = req.user!._id;

    // Check if already submitted
    const existingSubmission = await Submission.findOne({ assignmentId, userId });
    if (existingSubmission) {
      return res.status(400).json({ error: 'Assignment already submitted' });
    }

    const submission = new Submission({
      assignmentId,
      userId,
      submissionText,
      fileUrl,
    });

    await submission.save();
    res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;