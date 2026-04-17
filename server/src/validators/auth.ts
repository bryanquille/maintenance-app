import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  rol: z.enum(['admin', 'tecnico', 'lector']).optional().default('tecnico'),
  empresaId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password es requerido'),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  nombre: z.string().min(2).optional(),
  rol: z.enum(['admin', 'tecnico', 'lector']).optional(),
  empresaId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;