import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { empresaApi, carretillaApi, mantenimientoApi } from '../services/api';
import { Card, Badge, Button, Select, Loader, EmptyState } from '../components';
import type { Empresa, Carretilla, Mantenimiento } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, empresaActiva, setEmpresaActiva } = useAuthStore();
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [carretillas, setCarretillas] = useState<Carretilla[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    if (empresaActiva) {
      loadData();
    }
  }, [empresaActiva?._id]);

  const loadEmpresas = async () => {
    try {
      if (user?.rol !== 'admin') {
        if (user?.empresaId) {
          const response = await empresaApi.getById(user.empresaId);
          if (response.data) {
            setEmpresas([response.data]);
            setEmpresaActiva(response.data);
          }
        }
      } else {
        const response = await empresaApi.getAll();
        if (response.data) {
          setEmpresas(response.data);
          if (response.data.length > 0 && !empresaActiva) {
            setEmpresaActiva(response.data[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (!empresaActiva) return;
    setLoading(true);
    try {
      const [carretillasRes, mantenimientosRes] = await Promise.all([
        carretillaApi.getByEmpresa(empresaActiva._id),
        mantenimientoApi.getByEmpresa(empresaActiva._id),
      ]);
      if (carretillasRes.data) setCarretillas(carretillasRes.data);
      if (mantenimientosRes.data) setMantenimientos(mantenimientosRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const empresa = empresas.find((em) => em._id === e.target.value);
    if (empresa) {
      setEmpresaActiva(empresa);
    }
  };

  if (loading && empresas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Cargando dashboard..." />
      </div>
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EmptyState
          title="No hay empresas"
          message="Contacta al administrador para que cree una empresa"
        />
      </div>
    );
  }

  const stats = {
    totalCarretillas: carretillas.length,
    activas: carretillas.filter((c) => c.estado === 'activa').length,
    mantenimiento: carretillas.filter((c) => c.estado === 'mantenimiento').length,
    totalMantenimientos: mantenimientos.length,
  };

  const estadoMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    activa: 'success',
    inactiva: 'default',
    mantenimiento: 'warning',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen de {empresaActiva?.nombre}</p>
        </div>

        {user?.rol === 'admin' && (
          <div className="mb-6">
            <Select
              label="Seleccionar Empresa"
              value={empresaActiva?._id || ''}
              onChange={handleEmpresaChange}
              options={empresas.map((e) => ({ value: e._id, label: e.nombre }))}
            />
          </div>
        )}

        {loading ? (
          <Loader text="Cargando datos..." />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <p className="text-sm text-gray-600">Total Carretillas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCarretillas}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-3xl font-bold text-green-600">{stats.activas}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-gray-600">En Mantenimiento</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.mantenimiento}</p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-gray-600">Total Mantenimientos</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalMantenimientos}</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Carretillas</h2>
                  <Button size="sm" onClick={() => navigate('/carretillas')}>
                    Ver Todas
                  </Button>
                </div>
                {carretillas.length === 0 ? (
                  <p className="text-gray-500">No hay carretillas</p>
                ) : (
                  <div className="space-y-3">
                    {carretillas.slice(0, 5).map((carretilla) => (
                      <div
                        key={carretilla._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {carretilla.tipoDeMaquina} - {carretilla.modelo}
                          </p>
                          <p className="text-sm text-gray-500">
                            Serie: {carretilla.nroSerie} | ID: {carretilla.idMaquina}
                          </p>
                        </div>
                        <Badge variant={estadoMap[carretilla.estado]}>{carretilla.estado}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Últimos Mantenimientos</h2>
                  <Button size="sm" onClick={() => navigate('/mantenimientos')}>
                    Ver Todos
                  </Button>
                </div>
                {mantenimientos.length === 0 ? (
                  <p className="text-gray-500">No hay mantenimientos</p>
                ) : (
                  <div className="space-y-3">
                    {mantenimientos.slice(0, 5).map((mant) => (
                      <div
                        key={mant._id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{mant.tipoServicio}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(mant.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge variant="info">
                          {(mant.carretillaId as Carretilla)?.modelo || 'N/A'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};