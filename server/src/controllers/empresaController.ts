import { Request, Response } from 'express';
import { empresaService } from '../services/index.js';
import { createEmpresaSchema, updateEmpresaSchema } from '../validators/index.js';
import type { AuthRequest } from '../middlewares/index.js';

export const getAllEmpresas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    let empresas: unknown[];

    if (user?.rol !== 'admin') {
      if (user?.empresaId) {
        const empresa = await empresaService.getById(user.empresaId);
        empresas = empresa ? [empresa] : [];
      } else {
        empresas = [];
      }
    } else {
      empresas = await empresaService.getAll();
    }

    res.status(200).json({
      success: true,
      data: empresas,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener empresas';
    res.status(500).json({ success: false, error: message });
  }
};

export const getEmpresaById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const empresaId = req.params.id;

    if (user?.rol !== 'admin' && user?.empresaId !== empresaId) {
      res.status(403).json({ success: false, error: 'No tienes acceso a esta empresa' });
      return;
    }

    const empresa = await empresaService.getById(empresaId);
    if (!empresa) {
      res.status(404).json({ success: false, error: 'Empresa no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      data: empresa,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener empresa';
    res.status(500).json({ success: false, error: message });
  }
};

export const createEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createEmpresaSchema.parse(req.body);
    const empresa = await empresaService.create(data);
    res.status(201).json({
      success: true,
      data: empresa,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear empresa';
    res.status(400).json({ success: false, error: message });
  }
};

export const updateEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = updateEmpresaSchema.parse(req.body);
    const empresa = await empresaService.update(req.params.id, data);
    if (!empresa) {
      res.status(404).json({ success: false, error: 'Empresa no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      data: empresa,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar empresa';
    res.status(400).json({ success: false, error: message });
  }
};

export const deleteEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await empresaService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Empresa no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Empresa eliminada correctamente',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar empresa';
    res.status(500).json({ success: false, error: message });
  }
};