import { z } from 'zod';

export const createInviteSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  rol: z.enum(['admin', 'tecnico', 'lector']).default('tecnico'),
  empresaId: z.string().min(1, 'Empresa es requerida'),
  fechaExpiracion: z.string().optional(),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;