import { z } from 'zod';

export const createEmpresaSchema = z.object({
  nombre: z.string().min(2, 'Nombre es requerido'),
  identificacionFiscal: z.string().optional(),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
  estado: z.enum(['activa', 'inactiva']).optional().default('activa'),
});

export const updateEmpresaSchema = z.object({
  nombre: z.string().min(2).optional(),
  identificacionFiscal: z.string().optional(),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email().optional().or(z.literal('')),
  direccion: z.string().optional(),
  estado: z.enum(['activa', 'inactiva']).optional(),
});

export type CreateEmpresaInput = z.infer<typeof createEmpresaSchema>;
export type UpdateEmpresaInput = z.infer<typeof updateEmpresaSchema>;