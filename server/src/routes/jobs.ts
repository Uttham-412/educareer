import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { JobOpportunity, JobApplication, Resume } from '../models/Job';

const router = express.Router();

// Get all active job opportunities
router.get('/', async (req, res) => {
  try {
    const jobs = await JobOpportunity.find({ isActive: true }).populate('postedBy', 'firstName lastName');
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create job opportunity
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const jobData = {
      ...req.body,
      postedBy: req.user!._id,
    };

    const job = new JobOpportunity(jobData);
    await job.save();

    res.status(201).json({ message: 'Job opportunity created successfully', job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Apply for job
router.post('/:jobId/apply', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;
    const userId = req.user!._id;

    // Check if already applied
    const existingApplication = await JobApplication.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    const application = new JobApplication({
      userId,
      jobId,
      coverLetter,
      resumeUrl,
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's job applications
router.get('/applications', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const applications = await JobApplication.find({ userId }).populate('jobId');
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's resumes
router.get('/resumes', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!._id;
    const resumes = await Resume.find({ userId });
    res.json(resumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create/Update resume
router.post('/resumes', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const resumeData = {
      ...req.body,
      userId: req.user!._id,
    };

    const resume = new Resume(resumeData);
    await resume.save();

    res.status(201).json({ message: 'Resume created successfully', resume });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;