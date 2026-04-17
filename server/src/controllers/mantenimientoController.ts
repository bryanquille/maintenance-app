import { Request, Response } from 'express';
import { mantenimientoService } from '../services/index.js';
import { createMantenimientoSchema, updateMantenimientoSchema, mantenimientoFilterSchema } from '../validators/index.js';

export const getMantenimientosByEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { empresaId } = req.params;
    const filters = req.query.fechaDesde || req.query.fechaHasta || req.query.tipoServicio || req.query.responsable
      ? mantenimientoFilterSchema.parse({
          fechaDesde: req.query.fechaDesde,
          fechaHasta: req.query.fechaHasta,
          tipoServicio: req.query.tipoServicio,
          responsable: req.query.responsable,
        })
      : undefined;

    const mantenimientos = await mantenimientoService.getByEmpresa(empresaId, filters);
    res.status(200).json({
      success: true,
      data: mantenimientos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener mantenimientos';
    res.status(500).json({ success: false, error: message });
  }
};

export const getMantenimientosByCarretilla = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carretillaId } = req.params;
    const mantenimientos = await mantenimientoService.getByCarretilla(carretillaId);
    res.status(200).json({
      success: true,
      data: mantenimientos,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener mantenimientos';
    res.status(500).json({ success: false, error: message });
  }
};

export const getMantenimientoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const mantenimiento = await mantenimientoService.getById(req.params.id);
    if (!mantenimiento) {
      res.status(404).json({ success: false, error: 'Mantenimiento no encontrado' });
      return;
    }
    res.status(200).json({
      success: true,
      data: mantenimiento,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener mantenimiento';
    res.status(500).json({ success: false, error: message });
  }
};

export const createMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createMantenimientoSchema.parse(req.body);
    const mantenimiento = await mantenimientoService.create(data);
    res.status(201).json({
      success: true,
      data: mantenimiento,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear mantenimiento';
    res.status(400).json({ success: false, error: message });
  }
};

export const updateMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = updateMantenimientoSchema.parse(req.body);
    const mantenimiento = await mantenimientoService.update(req.params.id, data);
    if (!mantenimiento) {
      res.status(404).json({ success: false, error: 'Mantenimiento no encontrado' });
      return;
    }
    res.status(200).json({
      success: true,
      data: mantenimiento,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar mantenimiento';
    res.status(400).json({ success: false, error: message });
  }
};

export const deleteMantenimiento = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await mantenimientoService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Mantenimiento no encontrado' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Mantenimiento eliminado correctamente',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar mantenimiento';
    res.status(500).json({ success: false, error: message });
  }
};