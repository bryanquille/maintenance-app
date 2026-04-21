import { z } from 'zod';

export const createInviteSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  rol: z.enum(['admin', 'tecnico', 'lector']).default('tecnico'),
  empresaId: z.string().optional(),
  fechaExpiracion: z.string().optional(),
}).refine(
  (data) => {
    if (data.rol === 'lector' && !data.empresaId) {
      return false;
    }
    return true;
  },
  {
    message: 'Empresa es requerida para rol lector',
    path: ['empresaId'],
  }
);

export type CreateInviteInput = z.infer<typeof createInviteSchema>;