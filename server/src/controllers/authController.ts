import { Request, Response } from 'express';
import { authService } from '../services/index.js';
import { registerSchema, loginSchema } from '../validators/index.js';
import type { AuthRequest } from '../middlewares/index.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          nombre: result.user.nombre,
          rol: result.user.rol,
          empresaId: result.user.empresaId,
        },
        token: result.token,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al registrar usuario';
    res.status(400).json({ success: false, error: message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          nombre: result.user.nombre,
          rol: result.user.rol,
          empresaId: result.user.empresaId,
        },
        token: result.token,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
    res.status(401).json({ success: false, error: message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      return;
    }
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        empresaId: user.empresaId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener usuario';
    res.status(500).json({ success: false, error: message });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users.map((u) => ({
        id: u._id,
        email: u.email,
        nombre: u.nombre,
        rol: u.rol,
        empresaId: u.empresaId,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener usuarios';
    res.status(500).json({ success: false, error: message });
  }
};