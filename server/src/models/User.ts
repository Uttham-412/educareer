import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  company?: string;
  dateOfBirth?: Date;
  experienceLevel?: string;
  location?: string;
  occupation?: string;
  phone?: string;
  preferredWorkType?: string;
  skills?: string[];
  courses?: string[];
  timetable?: any;
  // Academic fields
  studentId?: string;
  rollNumber?: string;
  institutionName?: string;
  department?: string;
  branch?: string;
  currentYear?: number;
  currentSemester?: number;
  cgpa?: number;
  currentPercentage?: number;
  whatsappNumber?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  company: { type: String },
  dateOfBirth: { type: Date },
  experienceLevel: { type: String },
  location: { type: String },
  occupation: { type: String },
  phone: { type: String },
  preferredWorkType: { type: String },
  skills: [{ type: String }],
  courses: [{ type: String }],
  timetable: { type: Schema.Types.Mixed },
  // Academic fields
  studentId: { type: String },
  rollNumber: { type: String },
  institutionName: { type: String },
  department: { type: String },
  branch: { type: String },
  currentYear: { type: Number, min: 1, max: 5 },
  currentSemester: { type: Number, min: 1, max: 10 },
  cgpa: { type: Number, min: 0, max: 10 },
  currentPercentage: { type: Number, min: 0, max: 100 },
  whatsappNumber: { type: String },
  linkedin: { type: String },
  github: { type: String },
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);