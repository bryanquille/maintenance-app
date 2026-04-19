import crypto from 'crypto';
import { Types } from 'mongoose';
import { InviteModel } from '../models/index.js';
import type { IInviteDocument } from '../models/Invite.js';
import type { CreateInviteInput } from '../validators/invite.js';

export class InviteService {
  async create(data: CreateInviteInput): Promise<IInviteDocument> {
    const existingInvite = await InviteModel.findOne({ email: data.email });
    if (existingInvite) {
      throw new Error('Ya existe una invitación para este email');
    }

    const codigoRegistro = crypto.randomBytes(16).toString('hex');

    const invite = await InviteModel.create({
      email: data.email,
      nombre: data.nombre,
      rol: data.rol,
      empresaId: new Types.ObjectId(data.empresaId),
      codigoRegistro,
      usado: false,
      fechaExpiracion: data.fechaExpiracion ? new Date(data.fechaExpiracion) : undefined,
    });

    return invite;
  }

  async validateCodigo(email: string, codigoRegistro: string): Promise<IInviteDocument | null> {
    const invite = await InviteModel.findOne({
      email,
      codigoRegistro,
      usado: false,
    });

    if (!invite) {
      return null;
    }

    if (invite.fechaExpiracion && invite.fechaExpiracion < new Date()) {
      throw new Error('La invitación ha expirado');
    }

    return invite;
  }

  async markAsUsed(codigoRegistro: string): Promise<void> {
    await InviteModel.updateOne({ codigoRegistro }, { usado: true });
  }

  async getAll(): Promise<IInviteDocument[]> {
    return InviteModel.find().sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<IInviteDocument | null> {
    return InviteModel.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await InviteModel.findByIdAndDelete(id);
    return !!result;
  }
}

export const inviteService = new InviteService();