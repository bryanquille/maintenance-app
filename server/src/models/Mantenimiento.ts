import mongoose, { Schema, Document } from 'mongoose';
import type { IMantenimiento } from '../types/index.js';

export interface IMantenimientoDocument extends IMantenimiento, Document {}

const mantenimientoSchema = new Schema<IMantenimientoDocument>(
  {
    empresaId: { type: Schema.Types.ObjectId, ref: 'Empresa', required: true },
    carretillaId: { type: Schema.Types.ObjectId, ref: 'Carretilla', required: true },
    fecha: { type: Date, default: Date.now },
    tipoServicio: { type: String, required: true },
    descripcionGeneral: { type: String },
    mantenimientoPreventivo: {
      revisionSistemaHidraulico: { type: Boolean, default: false },
      rellenoLiquido: { type: Boolean, default: false },
      revisionLimpiezaRuedas: { type: Boolean, default: false },
      ajustePartes: { type: Boolean, default: false },
      lubricacionEngrase: { type: Boolean, default: false },
      limpiezaProfunda: { type: Boolean, default: false },
      evaluacionProximo: { type: Boolean, default: false },
    },
    mantenimientoCorrectivo: {
      revisionSistema: { type: Boolean, default: false },
      cambioEmpaques: { type: Boolean, default: false },
      cambioLiquido: { type: Boolean, default: false },
      cambioRuedasCarga: { type: Boolean, default: false },
      cambioRuedasDirectrices: { type: Boolean, default: false },
      correccionCadena: { type: Boolean, default: false },
      cambioRodamiento: { type: Boolean, default: false },
      otros: { type: String },
    },
    observaciones: { type: String },
    nombreEncargado: { type: String },
    ciEncargado: { type: String },
    nombreReceptor: { type: String },
    ciReceptor: { type: String },
  },
  { timestamps: true }
);

mantenimientoSchema.index({ empresaId: 1 });
mantenimientoSchema.index({ carretillaId: 1 });
mantenimientoSchema.index({ empresaId: 1, fecha: -1 });

export const MantenimientoModel = mongoose.model<IMantenimientoDocument>('Mantenimiento', mantenimientoSchema);