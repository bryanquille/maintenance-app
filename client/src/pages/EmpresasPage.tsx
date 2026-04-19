import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { empresaApi } from '../services/api';
import { Button, Input, Card, Modal, ConfirmModal, Table, Badge, Loader, EmptyState, ErrorMessage } from '../components';
import type { Empresa } from '../types';

export const EmpresasPage: React.FC = () => {
  const { user } = useAuthStore();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    identificacionFiscal: '',
    contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: 'activa' as 'activa' | 'inactiva',
  });

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await empresaApi.getAll();
      if (response.data) {
        setEmpresas(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      identificacionFiscal: '',
      contacto: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: 'activa',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedEmpresa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (empresa: Empresa) => {
    setFormData({
      nombre: empresa.nombre,
      identificacionFiscal: empresa.identificacionFiscal || '',
      contacto: empresa.contacto || '',
      telefono: empresa.telefono || '',
      correo: empresa.correo || '',
      direccion: empresa.direccion || '',
      estado: empresa.estado,
    });
    setSelectedEmpresa(empresa);
    setIsModalOpen(true);
  };

  const openDeleteModal = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedEmpresa) {
        await empresaApi.update(selectedEmpresa._id, formData);
      } else {
        await empresaApi.create(formData);
      }
      setIsModalOpen(false);
      loadEmpresas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEmpresa) return;
    setSaving(true);
    try {
      await empresaApi.delete(selectedEmpresa._id);
      setIsDeleteModalOpen(false);

      const { empresaActiva, setEmpresaActiva } = useAuthStore.getState();
      if (empresaActiva?._id === selectedEmpresa._id) {
        const response = await empresaApi.getAll();
        if (response.data && response.data.length > 0) {
          setEmpresaActiva(response.data[0]);
        } else {
          setEmpresaActiva(null);
        }
      }

      loadEmpresas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'identificacionFiscal', header: 'NIT/ID' },
    { key: 'contacto', header: 'Contacto' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'correo', header: 'Correo' },
    {
      key: 'estado',
      header: 'Estado',
      render: (empresa: Empresa) => (
        <Badge variant={empresa.estado === 'activa' ? 'success' : 'default'}>
          {empresa.estado}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (empresa: Empresa) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(empresa)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Editar
          </button>
          <button
            onClick={() => openDeleteModal(empresa)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <Loader />;
  if (error && empresas.length === 0) return <ErrorMessage message={error} onRetry={loadEmpresas} />;

  const canManage = user?.rol === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Empresas</h1>
            <p className="text-gray-600">Gestión de empresas</p>
          </div>
          {canManage && (
            <Button onClick={openCreateModal}>Crear Empresa</Button>
          )}
        </div>

        <Card>
          {empresas.length === 0 ? (
            <EmptyState
              title="No hay empresas"
              message="Crea tu primera empresa"
              action={canManage && <Button onClick={openCreateModal}>Crear Empresa</Button>}
            />
          ) : (
            <Table data={empresas} columns={columns} />
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedEmpresa ? 'Editar Empresa' : 'Crear Empresa'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <Input
              label="Identificación Fiscal (NIT)"
              name="identificacionFiscal"
              value={formData.identificacionFiscal}
              onChange={handleChange}
            />
            <Input
              label="Contacto"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
            />
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
            <Input
              label="Correo"
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
            />
            <Input
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
            {selectedEmpresa && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                {selectedEmpresa ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Eliminar Empresa"
          message={`¿Estás seguro de eliminar ${selectedEmpresa?.nombre}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          loading={saving}
        />
      </div>
    </div>
  );
};