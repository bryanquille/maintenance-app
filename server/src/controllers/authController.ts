import { Request, Response } from 'express';
import { authService, inviteService } from '../services/index.js';
import { registerSchema, loginSchema } from '../validators/index.js';
import type { AuthRequest } from '../middlewares/index.js';
import type { RegisterInput } from '../validators/auth.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    if (data.password !== data.confirmPassword) {
      res.status(400).json({ success: false, error: 'Las contraseñas no coinciden' });
      return;
    }

    const invite = await inviteService.validateCodigo(data.email, data.codigoRegistro);
    if (!invite) {
      res.status(400).json({ success: false, error: 'Código de registro inválido o ya usado' });
      return;
    }

    await inviteService.markAsUsed(data.codigoRegistro);

    const inviteData = {
      email: invite.email,
      nombre: invite.nombre,
      rol: invite.rol,
      empresaId: invite.empresaId.toString(),
    };

    const result = await authService.register(data as RegisterInput, inviteData);
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