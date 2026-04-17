import { z } from 'zod';

export const createCarretillaSchema = z.object({
  empresaId: z.string().min(1, 'Empresa es requerida'),
  fecha: z.string().optional(),
  tipoDeMaquina: z.string().min(1, 'Tipo de máquina es requerido'),
  nroSerie: z.string().min(1, 'Número de serie es requerido'),
  modelo: z.string().min(1, 'Modelo es requerido'),
  idMaquina: z.string().min(1, 'ID de máquina es requerido'),
  tipoDeServicio: z.enum(['nuevo', 'usado']).optional().default('usado'),
  tiempoUsoOperacion: z.number().optional(),
  fechaUltimoMantenimiento: z.string().optional(),
  observacionesUltimoMantenimiento: z.string().optional(),
  estado: z.enum(['activa', 'inactiva', 'mantenimiento']).optional().default('activa'),
});

export const updateCarretillaSchema = z.object({
  fecha: z.string().optional(),
  tipoDeMaquina: z.string().optional(),
  nroSerie: z.string().optional(),
  modelo: z.string().optional(),
  idMaquina: z.string().optional(),
  tipoDeServicio: z.enum(['nuevo', 'usado']).optional(),
  tiempoUsoOperacion: z.number().optional(),
  fechaUltimoMantenimiento: z.string().optional(),
  observacionesUltimoMantenimiento: z.string().optional(),
  estado: z.enum(['activa', 'inactiva', 'mantenimiento']).optional(),
});

export const carretillaFilterSchema = z.object({
  search: z.string().optional(),
  estado: z.enum(['activa', 'inactiva', 'mantenimiento']).optional(),
  tipoDeMaquina: z.string().optional(),
});

export type CreateCarretillaInput = z.infer<typeof createCarretillaSchema>;
export type UpdateCarretillaInput = z.infer<typeof updateCarretillaSchema>;
export type CarretillaFilterInput = z.infer<typeof carretillaFilterSchema>;