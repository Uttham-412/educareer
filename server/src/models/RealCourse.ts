import mongoose, { Document, Schema } from 'mongoose';

export interface IRealCourse extends Document {
  title: string;
  provider: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: string;
  rating: number;
  enrollmentUrl: string;
  skills: string[];
  prerequisites: string[];
  targetYear: number[]; // Which academic years this is suitable for
  relatedSubjects: string[]; // Subjects from timetable that match this course
  certificateOffered: boolean;
  language: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
}

const RealCourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: { type: String, required: true },
  price: { type: String, default: 'Free' },
  rating: { type: Number, default: 4.5 },
  enrollmentUrl: { type: String, required: true },
  skills: [{ type: String }],
  prerequisites: [{ type: String }],
  targetYear: [{ type: Number }], // 1, 2, 3, 4 for college years
  relatedSubjects: [{ type: String }],
  certificateOffered: { type: Boolean, default: true },
  language: { type: String, default: 'English' },
  platform: { type: String, required: true },
}, {
  timestamps: true
});

// Create indexes for better search performance
RealCourseSchema.index({ category: 1, level: 1 });
RealCourseSchema.index({ relatedSubjects: 1 });
RealCourseSchema.index({ targetYear: 1 });

export const RealCourse = mongoose.model<IRealCourse>('RealCourse', RealCourseSchema);