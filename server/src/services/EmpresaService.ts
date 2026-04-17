import { EmpresaModel } from '../models/index.js';
import type { IEmpresaDocument } from '../models/Empresa.js';
import type { CreateEmpresaInput, UpdateEmpresaInput } from '../validators/empresa.js';

export class EmpresaService {
  async getAll(): Promise<IEmpresaDocument[]> {
    return EmpresaModel.find().sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<IEmpresaDocument | null> {
    return EmpresaModel.findById(id);
  }

  async create(data: CreateEmpresaInput): Promise<IEmpresaDocument> {
    const empresa = await EmpresaModel.create(data);
    return empresa;
  }

  async update(id: string, data: UpdateEmpresaInput): Promise<IEmpresaDocument | null> {
    const empresa = await EmpresaModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    return empresa;
  }

  async delete(id: string): Promise<boolean> {
    const result = await EmpresaModel.findByIdAndDelete(id);
    return !!result;
  }

  async activate(id: string): Promise<IEmpresaDocument | null> {
    return EmpresaModel.findByIdAndUpdate(id, { estado: 'activa' }, { new: true });
  }

  async deactivate(id: string): Promise<IEmpresaDocument | null> {
    return EmpresaModel.findByIdAndUpdate(id, { estado: 'inactiva' }, { new: true });
  }
}

export const empresaService = new EmpresaService();