import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { carretillaApi, mantenimientoApi } from '../services/api';
import { Button, Input, Card, Modal, ConfirmModal, Table, Loader, EmptyState, ErrorMessage, Textarea, Checkbox } from '../components';
import type { Carretilla, Mantenimiento, MantenimientoPreventivo, MantenimientoCorrectivo } from '../types';

const preventivoOptions: { key: keyof MantenimientoPreventivo; label: string }[] = [
  { key: 'revisionSistemaHidraulico', label: 'Revisión y ajuste del sistema hidráulico' },
  { key: 'rellenoLiquido', label: 'Relleno de líquido hidráulico' },
  { key: 'revisionLimpiezaRuedas', label: 'Revisión y limpieza de ruedas directrices y de carga' },
  { key: 'ajustePartes', label: 'Ajuste de partes en todo el equipo' },
  { key: 'lubricacionEngrase', label: 'Lubricación y engrase' },
  { key: 'limpiezaProfunda', label: 'Limpieza profunda' },
  { key: 'evaluacionProximo', label: 'Evaluación a próximo mantenimiento' },
];

const correctivoOptions: { key: keyof Omit<MantenimientoCorrectivo, 'otros'>; label: string }[] = [
  { key: 'revisionSistema', label: 'Revisión del sistema hidráulico' },
  { key: 'cambioEmpaques', label: 'Cambio de empaques del sistema hidráulico' },
  { key: 'cambioLiquido', label: 'Cambio de líquido hidráulico' },
  { key: 'cambioRuedasCarga', label: 'Cambio ruedas delante de carga' },
  { key: 'cambioRuedasDirectrices', label: 'Cambio de ruedas directrices' },
  { key: 'correccionCadena', label: 'Corrección en cadena' },
  { key: 'cambioRodamiento', label: 'Cambio de rodamiento en base de soporte' },
];

export const MantenimientosPage: React.FC = () => {
  const { empresaActiva, user } = useAuthStore();
  const { carretillaId } = useParams();
  const navigate = useNavigate();
  const [carretilla, setCarretilla] = useState<Carretilla | null>(null);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState<Mantenimiento | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fecha: '',
    tipoServicio: '',
    descripcionGeneral: '',
    mantenimientoPreventivo: {
      revisionSistemaHidraulico: false,
      rellenoLiquido: false,
      revisionLimpiezaRuedas: false,
      ajustePartes: false,
      lubricacionEngrase: false,
      limpiezaProfunda: false,
      evaluacionProximo: false,
    } as MantenimientoPreventivo,
    mantenimientoCorrectivo: {
      revisionSistema: false,
      cambioEmpaques: false,
      cambioLiquido: false,
      cambioRuedasCarga: false,
      cambioRuedasDirectrices: false,
      correccionCadena: false,
      cambioRodamiento: false,
      otros: '',
    } as MantenimientoCorrectivo,
    observaciones: '',
    nombreEncargado: '',
    ciEncargado: '',
    nombreReceptor: '',
    ciReceptor: '',
  });

  useEffect(() => {
    if (carretillaId) {
      loadCarretilla();
      loadMantenimientos();
    }
  }, [carretillaId]);

  const loadCarretilla = async () => {
    if (!carretillaId) return;
    try {
      const response = await carretillaApi.getById(carretillaId);
      if (response.data) {
        setCarretilla(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const loadMantenimientos = async () => {
    if (!carretillaId) return;
    setLoading(true);
    setError('');
    try {
      const response = await mantenimientoApi.getByCarretilla(carretillaId);
      if (response.data) {
        setMantenimientos(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mantenimientos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipoServicio: '',
      descripcionGeneral: '',
      mantenimientoPreventivo: {
        revisionSistemaHidraulico: false,
        rellenoLiquido: false,
        revisionLimpiezaRuedas: false,
        ajustePartes: false,
        lubricacionEngrase: false,
        limpiezaProfunda: false,
        evaluacionProximo: false,
      },
      mantenimientoCorrectivo: {
        revisionSistema: false,
        cambioEmpaques: false,
        cambioLiquido: false,
        cambioRuedasCarga: false,
        cambioRuedasDirectrices: false,
        correccionCadena: false,
        cambioRodamiento: false,
        otros: '',
      },
      observaciones: '',
      nombreEncargado: '',
      ciEncargado: '',
      nombreReceptor: '',
      ciReceptor: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedMantenimiento(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mantenimiento: Mantenimiento) => {
    setFormData({
      fecha: new Date(mantenimiento.fecha).toISOString().split('T')[0],
      tipoServicio: mantenimiento.tipoServicio,
      descripcionGeneral: mantenimiento.descripcionGeneral || '',
      mantenimientoPreventivo: mantenimiento.mantenimientoPreventivo || {
        revisionSistemaHidraulico: false,
        rellenoLiquido: false,
        revisionLimpiezaRuedas: false,
        ajustePartes: false,
        lubricacionEngrase: false,
        limpiezaProfunda: false,
        evaluacionProximo: false,
      },
      mantenimientoCorrectivo: mantenimiento.mantenimientoCorrectivo || {
        revisionSistema: false,
        cambioEmpaques: false,
        cambioLiquido: false,
        cambioRuedasCarga: false,
        cambioRuedasDirectrices: false,
        correccionCadena: false,
        cambioRodamiento: false,
        otros: '',
      },
      observaciones: mantenimiento.observaciones || '',
      nombreEncargado: mantenimiento.nombreEncargado || '',
      ciEncargado: mantenimiento.ciEncargado || '',
      nombreReceptor: mantenimiento.nombreReceptor || '',
      ciReceptor: mantenimiento.ciReceptor || '',
    });
    setSelectedMantenimiento(mantenimiento);
    setIsModalOpen(true);
  };

  const openDeleteModal = (mantenimiento: Mantenimiento) => {
    setSelectedMantenimiento(mantenimiento);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carretillaId || !empresaActiva) return;
    setSaving(true);
    try {
      const data: Partial<Mantenimiento> = {
        fecha: formData.fecha,
        tipoServicio: formData.tipoServicio,
        descripcionGeneral: formData.descripcionGeneral,
        mantenimientoPreventivo: formData.mantenimientoPreventivo,
        mantenimientoCorrectivo: {
          ...formData.mantenimientoCorrectivo,
          otros: formData.mantenimientoCorrectivo.otros,
        },
        observaciones: formData.observaciones,
        nombreEncargado: formData.nombreEncargado,
        ciEncargado: formData.ciEncargado,
        nombreReceptor: formData.nombreReceptor,
        ciReceptor: formData.ciReceptor,
      };

      if (selectedMantenimiento) {
        await mantenimientoApi.update(selectedMantenimiento._id, data);
      } else {
        await mantenimientoApi.create(carretillaId, empresaActiva._id, data);
      }
      setIsModalOpen(false);
      loadMantenimientos();
      if (carretilla) loadCarretilla();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMantenimiento) return;
    setSaving(true);
    try {
      await mantenimientoApi.delete(selectedMantenimiento._id);
      setIsDeleteModalOpen(false);
      loadMantenimientos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePreventivoChange = (key: keyof MantenimientoPreventivo) => {
    setFormData({
      ...formData,
      mantenimientoPreventivo: {
        ...formData.mantenimientoPreventivo,
        [key]: !formData.mantenimientoPreventivo[key],
      },
    });
  };

  const handleCorrectivoChange = (key: keyof Omit<MantenimientoCorrectivo, 'otros'>) => {
    setFormData({
      ...formData,
      mantenimientoCorrectivo: {
        ...formData.mantenimientoCorrectivo,
        [key]: !formData.mantenimientoCorrectivo[key],
      },
    });
  };

  const columns = [
    {
      key: 'fecha',
      header: 'Fecha',
      render: (m: Mantenimiento) => new Date(m.fecha).toLocaleDateString('es-ES'),
    },
    { key: 'tipoServicio', header: 'Tipo Servicio' },
    { key: 'descripcionGeneral', header: 'Descripción' },
    { key: 'nombreEncargado', header: 'Encargado' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (m: Mantenimiento) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(m)}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Editar
          </button>
          {user?.rol !== 'lector' && (
            <button
              onClick={() => openDeleteModal(m)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Eliminar
            </button>
          )}
        </div>
      ),
    },
  ];

  if (!carretilla) {
    return <Loader />;
  }

  if (loading && mantenimientos.length === 0) return <Loader />;
  if (error && mantenimientos.length === 0) return <ErrorMessage message={error} onRetry={loadMantenimientos} />;

  const canManage = user?.rol !== 'lector';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => navigate('/carretillas')} className="text-blue-600 hover:text-blue-700 text-sm mb-2">
              ← Volver a Carretillas
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Mantenimientos</h1>
            <p className="text-gray-600">
              {carretilla.tipoDeMaquina} - {carretilla.modelo} (Serie: {carretilla.nroSerie})
            </p>
          </div>
          {canManage && (
            <Button onClick={openCreateModal}>Nuevo Mantenimiento</Button>
          )}
        </div>

        <Card className="mb-6">
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">ID Máquina</p>
              <p className="font-medium">{carretilla.idMaquina}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Servicio</p>
              <p className="font-medium capitalize">{carretilla.tipoDeServicio}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tiempo de Uso</p>
              <p className="font-medium">{carretilla.tiempoUsoOperacion || 0} horas</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Último Mantenimiento</p>
              <p className="font-medium">
                {carretilla.fechaUltimoMantenimiento
                  ? new Date(carretilla.fechaUltimoMantenimiento).toLocaleDateString('es-ES')
                  : '-'}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          {mantenimientos.length === 0 ? (
            <EmptyState
              title="No hay mantenimientos"
              message="Registra el primer mantenimiento"
              action={canManage && <Button onClick={openCreateModal}>Nuevo Mantenimiento</Button>}
            />
          ) : (
            <Table data={mantenimientos} columns={columns} />
          )}
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedMantenimiento ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Bloque Superior</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Fecha"
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Tipo de Servicio"
                  name="tipoServicio"
                  value={formData.tipoServicio}
                  onChange={handleChange}
                  required
                  placeholder="Preventivo, Correctivo, etc."
                />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Empresa</p>
                  <p className="font-medium">{empresaActiva?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tipo de Máquina</p>
                  <p className="font-medium">{carretilla?.tipoDeMaquina}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nro. Serie</p>
                  <p className="font-medium">{carretilla?.nroSerie}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Modelo</p>
                  <p className="font-medium">{carretilla?.modelo}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Bloque de Información Operativa</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  label="Tiempo de Uso/Operación (horas)"
                  type="text"
                  value={String(carretilla?.tiempoUsoOperacion || 0)}
                  disabled
                />
                <Input
                  label="Último Mantenimiento"
                  type="date"
                  value={carretilla?.fechaUltimoMantenimiento?.split('T')[0] || ''}
                  disabled
                />
                <div className="col-span-2">
                  <Textarea
                    label="Observaciones Último Mantenimiento"
                    value={carretilla?.observacionesUltimoMantenimiento || ''}
                    disabled
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Bloque de Descripción</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mantenimiento Preventivo
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {preventivoOptions.map((opt) => (
                    <Checkbox
                      key={opt.key}
                      id={opt.key}
                      label={opt.label}
                      checked={!!formData.mantenimientoPreventivo[opt.key]}
                      onChange={() => handlePreventivoChange(opt.key)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mantenimiento Correctivo
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {correctivoOptions.map((opt) => (
                    <Checkbox
                      key={opt.key}
                      id={opt.key}
                      label={opt.label}
                      checked={!!formData.mantenimientoCorrectivo[opt.key]}
                      onChange={() => handleCorrectivoChange(opt.key)}
                    />
                  ))}
                </div>
              </div>

              <Input
                label="Otros (Correctivo)"
                name="otros"
                value={formData.mantenimientoCorrectivo.otros || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mantenimientoCorrectivo: {
                      ...formData.mantenimientoCorrectivo,
                      otros: e.target.value,
                    },
                  })
                }
                placeholder="Otros trabajos correctivos realizados"
              />

              <Textarea
                label="Descripción General"
                name="descripcionGeneral"
                value={formData.descripcionGeneral}
                onChange={handleChange}
                rows={2}
                placeholder="Descripción general del trabajo realizado"
              />

              <Textarea
                label="Observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={2}
                placeholder="Observaciones adicionales"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Bloque de Firmas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Firma Encargado Mantenimiento</p>
                  <Input
                    label="Nombre del Encargado"
                    name="nombreEncargado"
                    value={formData.nombreEncargado}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                  />
                  <Input
                    label="CI"
                    name="ciEncargado"
                    value={formData.ciEncargado}
                    onChange={handleChange}
                    placeholder="Cédula de identidad"
                    className="mt-2"
                  />
                </div>
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Firma Receptor</p>
                  <Input
                    label="Nombre del Receptor"
                    name="nombreReceptor"
                    value={formData.nombreReceptor}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                  />
                  <Input
                    label="CI"
                    name="ciReceptor"
                    value={formData.ciReceptor}
                    onChange={handleChange}
                    placeholder="Cédula de identidad"
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={saving}>
                {selectedMantenimiento ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Modal>

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Eliminar Mantenimiento"
          message={`¿Estás seguro de eliminar el mantenimiento del ${selectedMantenimiento?.fecha ? new Date(selectedMantenimiento.fecha).toLocaleDateString('es-ES') : ''}?`}
          confirmText="Eliminar"
          loading={saving}
        />
      </div>
    </div>
  );
};