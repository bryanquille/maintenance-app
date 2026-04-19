import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInvite {
  email: string;
  nombre: string;
  rol: 'admin' | 'tecnico' | 'lector';
  empresaId: Types.ObjectId;
  codigoRegistro: string;
  usado: boolean;
  fechaExpiracion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInviteDocument extends IInvite, Document<Types.ObjectId> {}

const inviteSchema = new Schema<IInviteDocument>(
  {
    email: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    rol: { type: String, enum: ['admin', 'tecnico', 'lector'], default: 'tecnico' },
    empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    codigoRegistro: { type: String, required: true, unique: true },
    usado: { type: Boolean, default: false },
    fechaExpiracion: { type: Date },
  },
  { timestamps: true }
);

export const InviteModel = mongoose.model<IInviteDocument>('Invite', inviteSchema);