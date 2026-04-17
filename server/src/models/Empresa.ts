import mongoose, { Schema, Document } from 'mongoose';
import type { IEmpresa } from '../types/index.js';

export interface IEmpresaDocument extends IEmpresa, Document {}

const empresaSchema = new Schema<IEmpresaDocument>(
  {
    nombre: { type: String, required: true },
    identificacionFiscal: { type: String },
    contacto: { type: String },
    telefono: { type: String },
    correo: { type: String },
    direccion: { type: String },
    estado: { type: String, enum: ['activa', 'inactiva'], default: 'activa' },
  },
  { timestamps: true }
);

export const EmpresaModel = mongoose.model<IEmpresaDocument>('Empresa', empresaSchema);