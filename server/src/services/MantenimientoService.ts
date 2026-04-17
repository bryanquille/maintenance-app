import { MantenimientoModel, CarretillaModel } from '../models/index.js';
import type { IMantenimientoDocument } from '../models/Mantenimiento.js';
import type { CreateMantenimientoInput, UpdateMantenimientoInput, MantenimientoFilterInput } from '../validators/mantenimiento.js';

export class MantenimientoService {
  async getByEmpresa(
    empresaId: string,
    filters?: MantenimientoFilterInput
  ): Promise<IMantenimientoDocument[]> {
    const query: Record<string, unknown> = { empresaId };

    if (filters?.tipoServicio) {
      query.tipoServicio = filters.tipoServicio;
    }

    if (filters?.responsable) {
      query.nombreEncargado = { $regex: filters.responsable, $options: 'i' };
    }

    let mantenimientos = await MantenimientoModel.find(query)
      .populate('carretillaId', 'tipoDeMaquina modelo nroSerie idMaquina')
      .sort({ fecha: -1 });

    if (filters?.fechaDesde) {
      const desde = new Date(filters.fechaDesde);
      mantenimientos = mantenimientos.filter((m) => m.fecha >= desde);
    }

    if (filters?.fechaHasta) {
      const hasta = new Date(filters.fechaHasta);
      hasta.setHours(23, 59, 59, 999);
      mantenimientos = mantenimientos.filter((m) => m.fecha <= hasta);
    }

    return mantenimientos;
  }

  async getByCarretilla(carretillaId: string): Promise<IMantenimientoDocument[]> {
    return MantenimientoModel.find({ carretillaId })
      .populate('carretillaId', 'tipoDeMaquina modelo nroSerie idMaquina')
      .sort({ fecha: -1 });
  }

  async getById(id: string): Promise<IMantenimientoDocument | null> {
    return MantenimientoModel.findById(id).populate('carretillaId', 'tipoDeMaquina modelo nroSerie idMaquina');
  }

  async create(data: CreateMantenimientoInput): Promise<IMantenimientoDocument> {
    const mantenimiento = await MantenimientoModel.create({
      ...data,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
    });

    if (data.carretillaId) {
      await CarretillaModel.findByIdAndUpdate(data.carretillaId, {
        fechaUltimoMantenimiento: mantenimiento.fecha,
        observacionesUltimoMantenimiento: data.observaciones,
      });
    }

    return mantenimiento;
  }

  async update(id: string, data: UpdateMantenimientoInput): Promise<IMantenimientoDocument | null> {
    const updateData = { ...data } as Record<string, unknown>;
    if (data.fecha) {
      updateData.fecha = new Date(data.fecha);
    }

    const mantenimiento = await MantenimientoModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return mantenimiento;
  }

  async delete(id: string): Promise<boolean> {
    const result = await MantenimientoModel.findByIdAndDelete(id);
    return !!result;
  }

  async getCountByEmpresa(empresaId: string): Promise<number> {
    return MantenimientoModel.countDocuments({ empresaId });
  }

  async getUltimoMantenimiento(carretillaId: string): Promise<IMantenimientoDocument | null> {
    return MantenimientoModel.findOne({ carretillaId }).sort({ fecha: -1 });
  }
}

export const mantenimientoService = new MantenimientoService();