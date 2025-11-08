import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

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
], async (req: AuthRequest, res) => {
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
    );

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
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;