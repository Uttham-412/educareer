import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      company: user.company,
      location: user.location,
      occupation: user.occupation,
      phone: user.phone,
      experienceLevel: user.experienceLevel,
      preferredWorkType: user.preferredWorkType,
      skills: user.skills,
      // Academic fields
      studentId: user.studentId,
      rollNumber: user.rollNumber,
      institutionName: user.institutionName,
      department: user.department,
      branch: user.branch,
      currentYear: user.currentYear,
      currentSemester: user.currentSemester,
      cgpa: user.cgpa,
      currentPercentage: user.currentPercentage,
      whatsappNumber: user.whatsappNumber,
      linkedin: user.linkedin,
      github: user.github,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('bio').optional().trim(),
  body('company').optional().trim(),
  body('location').optional().trim(),
  body('occupation').optional().trim(),
  body('phone').optional().trim(),
  body('experienceLevel').optional().trim(),
  body('preferredWorkType').optional().trim(),
  body('skills').optional().isArray(),
  // Academic fields validation
  body('studentId').optional().trim(),
  body('rollNumber').optional().trim(),
  body('institutionName').optional().trim(),
  body('department').optional().trim(),
  body('branch').optional().trim(),
  body('currentYear').optional().isInt({ min: 1, max: 5 }),
  body('currentSemester').optional().isInt({ min: 1, max: 10 }),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }),
  body('currentPercentage').optional().isFloat({ min: 0, max: 100 }),
  body('whatsappNumber').optional().trim(),
  body('linkedin').optional().trim(),
  body('github').optional().trim(),
  body('dateOfBirth').optional().trim(),
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user!._id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        company: user.company,
        location: user.location,
        occupation: user.occupation,
        phone: user.phone,
        experienceLevel: user.experienceLevel,
        preferredWorkType: user.preferredWorkType,
        skills: user.skills,
        // Academic fields
        studentId: user.studentId,
        rollNumber: user.rollNumber,
        institutionName: user.institutionName,
        department: user.department,
        branch: user.branch,
        currentYear: user.currentYear,
        currentSemester: user.currentSemester,
        cgpa: user.cgpa,
        currentPercentage: user.currentPercentage,
        whatsappNumber: user.whatsappNumber,
        linkedin: user.linkedin,
        github: user.github,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save timetable
router.post('/timetable', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const { timetable, courses } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        timetable,
        courses: courses || []
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Timetable saved successfully',
      timetable: user.timetable,
      courses: user.courses
    });
  } catch (error) {
    console.error('Save timetable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get timetable
router.get('/timetable', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const user = await User.findById(userId).select('timetable courses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      timetable: user.timetable || null,
      courses: user.courses || []
    });
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;