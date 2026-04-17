import { CarretillaModel } from '../models/index.js';
import type { ICarretillaDocument } from '../models/Carretilla.js';
import type { CreateCarretillaInput, UpdateCarretillaInput, CarretillaFilterInput } from '../validators/carretilla.js';

export class CarretillaService {
  async getByEmpresa(
    empresaId: string,
    filters?: CarretillaFilterInput
  ): Promise<ICarretillaDocument[]> {
    const query: Record<string, unknown> = { empresaId };

    if (filters?.estado) {
      query.estado = filters.estado;
    }

    if (filters?.tipoDeMaquina) {
      query.tipoDeMaquina = filters.tipoDeMaquina;
    }

    let carretillas = await CarretillaModel.find(query).sort({ createdAt: -1 });

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      carretillas = carretillas.filter(
        (c) =>
          c.tipoDeMaquina.toLowerCase().includes(search) ||
          c.modelo.toLowerCase().includes(search) ||
          c.nroSerie.toLowerCase().includes(search) ||
          c.idMaquina.toLowerCase().includes(search)
      );
    }

    return carretillas;
  }

  async getById(id: string): Promise<ICarretillaDocument | null> {
    return CarretillaModel.findById(id);
  }

  async create(data: CreateCarretillaInput): Promise<ICarretillaDocument> {
    const carretilla = await CarretillaModel.create({
      ...data,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      fechaUltimoMantenimiento: data.fechaUltimoMantenimiento
        ? new Date(data.fechaUltimoMantenimiento)
        : undefined,
    });
    return carretilla;
  }

  async update(id: string, data: UpdateCarretillaInput): Promise<ICarretillaDocument | null> {
    const updateData: Record<string, unknown> = { ...data };
    if (data.fecha) {
      updateData.fecha = new Date(data.fecha);
    }
    if (data.fechaUltimoMantenimiento) {
      updateData.fechaUltimoMantenimiento = new Date(data.fechaUltimoMantenimiento);
    }

    const carretilla = await CarretillaModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return carretilla;
  }

  async delete(id: string): Promise<boolean> {
    const result = await CarretillaModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateUltimoMantenimiento(
    id: string,
    fecha: Date,
    observaciones: string
  ): Promise<ICarretillaDocument | null> {
    return CarretillaModel.findByIdAndUpdate(
      id,
      {
        fechaUltimoMantenimiento: fecha,
        observacionesUltimoMantenimiento: observaciones,
      },
      { new: true }
    );
  }

  async getCountByEmpresa(empresaId: string): Promise<number> {
    return CarretillaModel.countDocuments({ empresaId });
  }

  async getCountByEstado(empresaId: string): Promise<{ activa: number; inactiva: number; mantenimiento: number }> {
    const activa = await CarretillaModel.countDocuments({ empresaId, estado: 'activa' });
    const inactiva = await CarretillaModel.countDocuments({ empresaId, estado: 'inactiva' });
    const mantenimiento = await CarretillaModel.countDocuments({ empresaId, estado: 'mantenimiento' });
    return { activa, inactiva, mantenimiento };
  }
}

export const carretillaService = new CarretillaService();