import mongoose, { Schema, Document, Types } from 'mongoose';
import type { ICarretilla } from '../types/index.js';

export interface ICarretillaDocument extends ICarretilla, Document<Types.ObjectId> {}

const carretillaSchema = new Schema<ICarretillaDocument>(
  {
    empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    fecha: { type: Date, default: Date.now },
    tipoDeMaquina: { type: String, required: true },
    nroSerie: { type: String, required: true },
    modelo: { type: String, required: true },
    idMaquina: { type: String, required: true },
    tipoDeServicio: { type: String, enum: ['nuevo', 'usado'], default: 'usado' },
    tiempoUsoOperacion: { type: Number },
    fechaUltimoMantenimiento: { type: Date },
    observacionesUltimoMantenimiento: { type: String },
    estado: { type: String, enum: ['activa', 'inactiva', 'mantenimiento'], default: 'activa' },
  },
  { timestamps: true }
);

carretillaSchema.index({ empresaId: 1 });
carretillaSchema.index({ empresaId: 1, tipoDeMaquina: 'text', modelo: 'text', nroSerie: 'text', idMaquina: 'text' });

export const CarretillaModel = mongoose.model<ICarretillaDocument>('Carretilla', carretillaSchema);