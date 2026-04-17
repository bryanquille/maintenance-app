import { z } from 'zod';

export const mantenimientoPreventivoSchema = z.object({
  revisionSistemaHidraulico: z.boolean().optional().default(false),
  rellenoLiquido: z.boolean().optional().default(false),
  revisionLimpiezaRuedas: z.boolean().optional().default(false),
  ajustePartes: z.boolean().optional().default(false),
  lubricacionEngrase: z.boolean().optional().default(false),
  limpiezaProfunda: z.boolean().optional().default(false),
  evaluacionProximo: z.boolean().optional().default(false),
});

export const mantenimientoCorrectivoSchema = z.object({
  revisionSistema: z.boolean().optional().default(false),
  cambioEmpaques: z.boolean().optional().default(false),
  cambioLiquido: z.boolean().optional().default(false),
  cambioRuedasCarga: z.boolean().optional().default(false),
  cambioRuedasDirectrices: z.boolean().optional().default(false),
  correccionCadena: z.boolean().optional().default(false),
  cambioRodamiento: z.boolean().optional().default(false),
  otros: z.string().optional(),
});

export const createMantenimientoSchema = z.object({
  empresaId: z.string().min(1, 'Empresa es requerida'),
  carretillaId: z.string().min(1, 'Carretilla es requerida'),
  fecha: z.string().optional(),
  tipoServicio: z.string().min(1, 'Tipo de servicio es requerido'),
  descripcionGeneral: z.string().optional(),
  mantenimientoPreventivo: mantenimientoPreventivoSchema.optional(),
  mantenimientoCorrectivo: mantenimientoCorrectivoSchema.optional(),
  observaciones: z.string().optional(),
  nombreEncargado: z.string().optional(),
  ciEncargado: z.string().optional(),
  nombreReceptor: z.string().optional(),
  ciReceptor: z.string().optional(),
});

export const updateMantenimientoSchema = z.object({
  fecha: z.string().optional(),
  tipoServicio: z.string().optional(),
  descripcionGeneral: z.string().optional(),
  mantenimientoPreventivo: mantenimientoPreventivoSchema.optional(),
  mantenimientoCorrectivo: mantenimientoCorrectivoSchema.optional(),
  observaciones: z.string().optional(),
  nombreEncargado: z.string().optional(),
  ciEncargado: z.string().optional(),
  nombreReceptor: z.string().optional(),
  ciReceptor: z.string().optional(),
});

export const mantenimientoFilterSchema = z.object({
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  tipoServicio: z.string().optional(),
  responsable: z.string().optional(),
});

export type CreateMantenimientoInput = z.infer<typeof createMantenimientoSchema>;
export type UpdateMantenimientoInput = z.infer<typeof updateMantenimientoSchema>;
export type MantenimientoFilterInput = z.infer<typeof mantenimientoFilterSchema>;