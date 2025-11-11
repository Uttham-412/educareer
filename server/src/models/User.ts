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
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);