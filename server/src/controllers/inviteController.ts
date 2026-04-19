import { Request, Response } from 'express';
import { inviteService } from '../services/index.js';
import { createInviteSchema } from '../validators/index.js';
import type { AuthRequest } from '../middlewares/index.js';

export const createInvite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = createInviteSchema.parse(req.body);
    const invite = await inviteService.create(data);
    res.status(201).json({
      success: true,
      data: {
        id: invite._id,
        email: invite.email,
        nombre: invite.nombre,
        rol: invite.rol,
        empresaId: invite.empresaId,
        codigoRegistro: invite.codigoRegistro,
        usado: invite.usado,
        fechaExpiracion: invite.fechaExpiracion,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear invitación';
    res.status(400).json({ success: false, error: message });
  }
};

export const getAllInvites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invites = await inviteService.getAll();
    res.status(200).json({
      success: true,
      data: invites.map((inv) => ({
        id: inv._id,
        email: inv.email,
        nombre: inv.nombre,
        rol: inv.rol,
        empresaId: inv.empresaId,
        codigoRegistro: inv.codigoRegistro,
        usado: inv.usado,
        fechaExpiracion: inv.fechaExpiracion,
        createdAt: inv.createdAt,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener invitaciones';
    res.status(500).json({ success: false, error: message });
  }
};

export const getInviteById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invite = await inviteService.getById(req.params.id);
    if (!invite) {
      res.status(404).json({ success: false, error: 'Invitación no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      data: {
        id: invite._id,
        email: invite.email,
        nombre: invite.nombre,
        rol: invite.rol,
        empresaId: invite.empresaId,
        codigoRegistro: invite.codigoRegistro,
        usado: invite.usado,
        fechaExpiracion: invite.fechaExpiracion,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener invitación';
    res.status(500).json({ success: false, error: message });
  }
};

export const deleteInvite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await inviteService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Invitación no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Invitación eliminada correctamente',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar invitación';
    res.status(500).json({ success: false, error: message });
  }
};