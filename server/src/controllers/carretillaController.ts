import { Request, Response } from 'express';
import { carretillaService } from '../services/index.js';
import { createCarretillaSchema, updateCarretillaSchema, carretillaFilterSchema } from '../validators/index.js';

export const getCarretillasByEmpresa = async (req: Request, res: Response): Promise<void> => {
  try {
    const { empresaId } = req.params;
    const filters = req.query.search || req.query.estado || req.query.tipoDeMaquina
      ? carretillaFilterSchema.parse({
          search: req.query.search,
          estado: req.query.estado,
          tipoDeMaquina: req.query.tipoDeMaquina,
        })
      : undefined;

    const carretillas = await carretillaService.getByEmpresa(empresaId, filters);
    res.status(200).json({
      success: true,
      data: carretillas,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener carretillas';
    res.status(500).json({ success: false, error: message });
  }
};

export const getCarretillaById = async (req: Request, res: Response): Promise<void> => {
  try {
    const carretilla = await carretillaService.getById(req.params.id);
    if (!carretilla) {
      res.status(404).json({ success: false, error: 'Carretilla no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      data: carretilla,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener carretilla';
    res.status(500).json({ success: false, error: message });
  }
};

export const createCarretilla = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = createCarretillaSchema.parse(req.body);
    const carretilla = await carretillaService.create(data);
    res.status(201).json({
      success: true,
      data: carretilla,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al crear carretilla';
    res.status(400).json({ success: false, error: message });
  }
};

export const updateCarretilla = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = updateCarretillaSchema.parse(req.body);
    const carretilla = await carretillaService.update(req.params.id, data);
    if (!carretilla) {
      res.status(404).json({ success: false, error: 'Carretilla no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      data: carretilla,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar carretilla';
    res.status(400).json({ success: false, error: message });
  }
};

export const deleteCarretilla = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await carretillaService.delete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Carretilla no encontrada' });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Carretilla eliminada correctamente',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar carretilla';
    res.status(500).json({ success: false, error: message });
  }
};