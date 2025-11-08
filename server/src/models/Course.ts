import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  code: string;
  description?: string;
  credits: number;
  department?: string;
  instructor?: string;
  semester?: string;
  year?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  status: 'active' | 'completed' | 'dropped' | 'withdrawn';
  grade?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITimetableSlot extends Document {
  courseId: mongoose.Types.ObjectId;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  room?: string;
  slotType: 'lecture' | 'lab' | 'tutorial' | 'seminar';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignment extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  totalPoints: number;
  assignmentType: 'homework' | 'quiz' | 'exam' | 'project' | 'presentation';
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  submissionText?: string;
  fileUrl?: string;
  submittedAt: Date;
  pointsEarned?: number;
  feedback?: string;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String },
  credits: { type: Number, default: 3 },
  department: { type: String },
  instructor: { type: String },
  semester: { type: String },
  year: { type: Number },
}, {
  timestamps: true
});

const EnrollmentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'completed', 'dropped', 'withdrawn'], default: 'active' },
  grade: { type: String },
}, {
  timestamps: true
});

const TimetableSlotSchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String },
  slotType: { type: String, enum: ['lecture', 'lab', 'tutorial', 'seminar'], default: 'lecture' },
}, {
  timestamps: true
});

const AssignmentSchema: Schema = new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  totalPoints: { type: Number, default: 100 },
  assignmentType: { type: String, enum: ['homework', 'quiz', 'exam', 'project', 'presentation'], default: 'homework' },
}, {
  timestamps: true
});

const SubmissionSchema: Schema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  submissionText: { type: String },
  fileUrl: { type: String },
  submittedAt: { type: Date, default: Date.now },
  pointsEarned: { type: Number },
  feedback: { type: String },
  status: { type: String, enum: ['draft', 'submitted', 'graded', 'returned'], default: 'submitted' },
}, {
  timestamps: true
});

// Create unique compound indexes
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
SubmissionSchema.index({ assignmentId: 1, userId: 1 }, { unique: true });

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
export const TimetableSlot = mongoose.model<ITimetableSlot>('TimetableSlot', TimetableSlotSchema);
export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);