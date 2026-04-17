import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { carretillaApi } from '../services/api';
import { Button, Input, Card, Modal, ConfirmModal, Table, Badge, Loader, EmptyState, ErrorMessage, Select } from '../components';
import type { Carretilla } from '../types';

export const CarretillasPage: React.FC = () => {
  const { empresaActiva, user } = useAuthStore();
  const navigate = useNavigate();
  const [carretillas, setCarretillas] = useState<Carretilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCarretilla, setSelectedCarretilla] = useState<Carretilla | null>(null);
  const [saving, setSaving] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    estado: '',
  });

  const [formData, setFormData] = useState({
    tipoDeMaquina: '',
    nroSerie: '',
    modelo: '',
    idMaquina: '',
    tipoDeServicio: 'usado' as 'nuevo' | 'usado',
    tiempoUsoOperacion: 0,
    estado: 'activa' as 'activa' | 'inactiva' | 'mantenimiento',
  });

  useEffect(() => {
    if (empresaActiva) {
      loadCarretillas();
    }
  }, [empresaActiva]);

  useEffect(() => {
    if (empresaActiva) {
      loadCarretillas();
    }
  }, [filters]);

  const loadCarretillas = async () => {
    if (!empresaActiva) return;
    setLoading(true);
    setError('');
    try {
      const response = await carretillaApi.getByEmpresa(empresaActiva._id, {
        search: filters.search || undefined,
        estado: filters.estado || undefined,
      });
      if (response.data) {
        setCarretillas(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar carretillas');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tipoDeMaquina: '',
      nroSerie: '',
      modelo: '',
      idMaquina: '',
      tipoDeServicio: 'usado',
      tiempoUsoOperacion: 0,
      estado: 'activa',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedCarretilla(null);
    setIsModalOpen(true);
  };

  const openEditModal = (carretilla: Carretilla) => {
    setFormData({
      tipoDeMaquina: carretilla.tipoDeMaquina,
      nroSerie: carretilla.nroSerie,
      modelo: carretilla.modelo,
      idMaquina: carretilla.idMaquina,
      tipoDeServicio: carretilla.tipoDeServicio,
      tiempoUsoOperacion: carretilla.tiempoUsoOperacion || 0,
      estado: carretilla.estado,
    });
    setSelectedCarretilla(carretilla);
    setIsModalOpen(true);
  };

  const openDeleteModal = (carretilla: Carretilla) => {
    setSelectedCarretilla(carretilla);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empresaActiva) return;
    setSaving(true);
    try {
      if (selectedCarretilla) {
        await carretillaApi.update(selectedCarretilla._id, formData);
      } else {
        await carretillaApi.create(empresaActiva._id, formData);
      }
      setIsModalOpen(false);
      loadCarretillas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCarretilla) return;
    setSaving(true);
    try {
      await carretillaApi.delete(selectedCarretilla._id);
      setIsDeleteModalOpen(false);
      loadCarretillas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tiempoUsoOperacion' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const viewMantenimientos = (carretilla: Carretilla) => {
    navigate(`/carretillas/${carretilla._id}/mantenimientos`);
  };

  const estadoMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    activa: 'success',
    inactiva: 'default',
    mantenimiento: 'warning',
  };

  const columns = [
    { key: 'tipoDeMaquina', header: 'Tipo' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'nroSerie', header: 'Nro. Serie' },
    { key: 'idMaquina', header: 'ID' },
    {
      key: 'tipoDeServicio',
      header: 'Tipo Servicio',
      render: (c: Carretilla) => (
        <span className="capitalize">{c.tipoDeServicio}</span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (c: Carretilla) => (
        <Badge variant={estadoMap[c.estado]}>{c.estado}</Badge>
      ),
    },
    {
      key: 'fechaUltimoMantenimiento',
      header: 'Último Mtto.',
      render: (c: Carretilla) =>
        c.fechaUltimoMantenimiento
          ? new Date(c.fechaUltimoMantenimiento).toLocaleDateString('es-ES')
          : '-',
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (c: Carretilla) => (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => viewMantenimientos(c)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Ver Mtto.
          </button>
          {user?.rol !== 'lector' && (
            <>
              <button
                onClick={() => openEditModal(c)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => openDeleteModal(c)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (!empresaActiva) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState title="Selecciona una empresa" />
      </div>
    );
  }

  if (loading && carretillas.length === 0) return <Loader />;
  if (error && carretillas.length === 0) return <ErrorMessage message={error} onRetry={loadCarretillas} />;

  const canManage = user?.rol !== 'lector';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Carretillas</h1>
            <p className="text-gray-600">{empresaActiva.nombre}</p>
          </div>
          {canManage && (
            <Button onClick={openCreateModal}>Agregar Carretilla</Button>
          )}
        </div>

        <Card className="mb-6">
          <div className="p-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Buscar..."
                value={filters.search}
                name="search"
                onChange={handleFilterChange}
              />
            </div>
            <div className="w-[200px]">
              <Select
                value={filters.estado}
                name="estado"
                onChange={handleFilterChange}
                options={[
                  { value: '', label: 'Todos los estados' },
                  { value: 'activa', label: 'Activa' },
                  { value: 'inactiva', label: 'Inactiva' },
                  { value: 'mantenimiento', label: 'Mantenimiento' },
                ]}
              />
            </div>
          </div>
        </Card>

        <Card>
          {carretillas.length === 0 ? (
            <EmptyState
              title="No hay carretillas"
              message="Agrega tu primera carretilla"
              action={canManage && <Button onClick={openCreateModal}>Agregar Carretilla</Button>}
            />
          ) : (
            <Table data={carretillas} columns={columns} />
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedCarretilla ? 'Editar Carretilla' : 'Agregar Carretilla'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tipo de Máquina"
              name="tipoDeMaquina"
              value={formData.tipoDeMaquina}
              onChange={handleChange}
              required
              placeholder="Ej: Carretilla Hidráulica"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Número de Serie"
                name="nroSerie"
                value={formData.nroSerie}
                onChange={handleChange}
                required
              />
              <Input
                label="Modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ID Máquina"
                name="idMaquina"
                value={formData.idMaquina}
                onChange={handleChange}
                required
              />
              <Input
                label="Tiempo de Uso (horas)"
                name="tiempoUsoOperacion"
                type="number"
                value={formData.tiempoUsoOperacion}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tipo de Servicio"
                name="tipoDeServicio"
                value={formData.tipoDeServicio}
                onChange={handleChange}
                options={[
                  { value: 'nuevo', label: 'Nuevo' },
                  { value: 'usado', label: 'Usado' },
                ]}
              />
              <Select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                options={[
                  { value: 'activa', label: 'Activa' },
                  { value: 'inactiva', label: 'Inactiva' },
                  { value: 'mantenimiento', label: 'En Mantenimiento' },
                ]}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                {selectedCarretilla ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Eliminar Carretilla"
          message={`¿Estás seguro de eliminar la carretilla ${selectedCarretilla?.tipoDeMaquina} - ${selectedCarretilla?.modelo}?`}
          confirmText="Eliminar"
          loading={saving}
        />
      </div>
    </div>
  );
};