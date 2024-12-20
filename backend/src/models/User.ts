import { Schema, model } from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isOnline: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  isOnline: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const User = model<IUser>('User', userSchema); 