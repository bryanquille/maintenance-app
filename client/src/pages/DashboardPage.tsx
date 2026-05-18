import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { empresaApi, carretillaApi, mantenimientoApi } from '../services/api';
import { Badge, Button, Select, Loader, EmptyState } from '../components';
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader text="Cargando dashboard..." />
      </div>
    );
  }

  if (empresas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
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
    inactiva: carretillas.filter((c) => c.estado === 'inactiva').length,
    totalMantenimientos: mantenimientos.length,
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'success';
      case 'inactiva': return 'default';
      case 'mantenimiento': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Resumen de <span className="text-gray-700 dark:text-gray-300 font-medium">{empresaActiva?.nombre}</span>
          </p>
        </div>

        {user?.rol === 'admin' && (
          <div className="mb-8">
            <div className="max-w-xs">
              <Select
                label="Empresa"
                value={empresaActiva?._id || ''}
                onChange={handleEmpresaChange}
                options={empresas.map((e) => ({ value: e._id, label: e.nombre }))}
              />
            </div>
          </div>
        )}

        {loading ? (
          <Loader text="Cargando datos..." />
        ) : (
          <div className="space-y-6">
            
            {/* Stats Grid - Clean borders, no shadows */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Carretillas</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCarretillas}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Activas</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{stats.activas}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">En Mantenimiento</p>
                <p className="mt-2 text-2xl font-semibold text-amber-600 dark:text-amber-400">{stats.mantenimiento}</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Mantenimientos</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalMantenimientos}</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Carretillas Card */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Carretillas</h2>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/carretillas')}>
                    Ver todas
                  </Button>
                </div>
                <div className="p-4">
                  {carretillas.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No hay carretillas registradas</p>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 -mx-4 px-4">
                      {carretillas.slice(0, 5).map((carretilla) => (
                        <div
                          key={carretilla._id}
                          className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-md transition-colors cursor-pointer"
                          onClick={() => navigate('/carretillas')}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {carretilla.tipoDeMaquina} - {carretilla.modelo}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                              {carretilla.nroSerie}
                            </p>
                          </div>
                          <Badge variant={getStatusColor(carretilla.estado)}>{carretilla.estado}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mantenimientos Card */}
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Últimos Mantenimientos</h2>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/mantenimientos')}>
                    Ver todos
                  </Button>
                </div>
                <div className="p-4">
                  {mantenimientos.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">No hay mantenimientos registrados</p>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 -mx-4 px-4">
                      {mantenimientos.slice(0, 5).map((mant) => (
                        <div
                          key={mant._id}
                          className="py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 -mx-2 px-2 rounded-md transition-colors cursor-pointer"
                          onClick={() => navigate('/mantenimientos')}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {mant.tipoServicio}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {new Date(mant.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <Badge variant="info">
                            {(mant.carretillaId as Carretilla)?.modelo || '—'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};