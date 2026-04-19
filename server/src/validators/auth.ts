import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordValidation = z
  .string()
  .min(8, 'Password debe tener al menos 8 caracteres')
  .refine((pwd) => /[A-Z]/.test(pwd), {
    message: 'Password debe contener al menos una mayúscula',
  })
  .refine((pwd) => /\d/.test(pwd), {
    message: 'Password debe contener al menos un número',
  })
  .refine((pwd) => /[@$!%*?&]/.test(pwd), {
    message: 'Password debe contener al menos un carácter especial (@$!%*?&)',
  });

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordValidation,
  confirmPassword: z.string(),
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