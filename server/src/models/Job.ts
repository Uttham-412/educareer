import mongoose, { Document, Schema } from 'mongoose';

export interface IJobOpportunity extends Document {
  title: string;
  company: string;
  description?: string;
  requirements?: string;
  location?: string;
  jobType: 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote';
  salaryRange?: string;
  applicationDeadline?: Date;
  applicationUrl?: string;
  contactEmail?: string;
  isActive: boolean;
  postedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'rejected' | 'accepted';
  appliedAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  summary?: string;
  education: any[];
  experience: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  languages: any[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobOpportunitySchema: Schema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  requirements: { type: String },
  location: { type: String },
  jobType: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract', 'remote'], default: 'full-time' },
  salaryRange: { type: String },
  applicationDeadline: { type: Date },
  applicationUrl: { type: String },
  contactEmail: { type: String },
  isActive: { type: Boolean, default: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

const JobApplicationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'JobOpportunity', required: true },
  coverLetter: { type: String },
  resumeUrl: { type: String },
  status: { type: String, enum: ['applied', 'under_review', 'interview_scheduled', 'rejected', 'accepted'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now },
  notes: { type: String },
}, {
  timestamps: true
});

const ResumeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  summary: { type: String },
  education: [{ type: Schema.Types.Mixed }],
  experience: [{ type: Schema.Types.Mixed }],
  skills: [{ type: Schema.Types.Mixed }],
  projects: [{ type: Schema.Types.Mixed }],
  certifications: [{ type: Schema.Types.Mixed }],
  languages: [{ type: Schema.Types.Mixed }],
  isDefault: { type: Boolean, default: false },
}, {
  timestamps: true
});

// Create unique compound indexes
JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const JobOpportunity = mongoose.model<IJobOpportunity>('JobOpportunity', JobOpportunitySchema);
export const JobApplication = mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
export const Resume = mongoose.model<IResume>('Resume', ResumeSchema);