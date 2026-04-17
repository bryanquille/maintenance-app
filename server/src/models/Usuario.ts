import mongoose, { Schema, Document } from 'mongoose';
import type { IUser } from '../types/index.js';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'tecnico', 'lector'], default: 'tecnico' },
    empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa' },
    nombre: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('Usuario', userSchema);