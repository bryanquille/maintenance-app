import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { empresaApi } from '../services/api';
import { inviteApi, type Invite, type CreateInviteInput } from '../services/inviteService';
import { Button, Input, Select, Card, Table, Badge, Loader } from '../components';
import type { Empresa } from '../types';

export const InvitesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showEmpresa, setShowEmpresa] = useState(false);

  const [formData, setFormData] = useState<CreateInviteInput>({
    email: '',
    nombre: '',
    rol: 'tecnico',
    empresaId: '',
  });

  useEffect(() => {
    if (!user || user.rol !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [invitesRes, empresasRes] = await Promise.all([
        inviteApi.getInvites(),
        empresaApi.getAll(),
      ]);
      if (invitesRes.data) setInvites(invitesRes.data);
      if (empresasRes.data) setEmpresas(empresasRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'rol') {
      const shouldShowEmpresa = value === 'lector';
      setShowEmpresa(shouldShowEmpresa);
      if (!shouldShowEmpresa) {
        setFormData(prev => ({ ...prev, empresaId: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.nombre || !formData.rol) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (formData.rol === 'lector' && !formData.empresaId) {
      setError('La empresa es requerida para el rol de lector');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await inviteApi.createInvite(formData);
      if (response.success && response.data) {
        setSuccess('Invitación creada correctamente');
        setInvites([response.data, ...invites]);
        setFormData({ email: '', nombre: '', rol: 'tecnico', empresaId: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear invitación');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError('Error al copiar');
    }
  };

  const getFrontendUrl = (codigo: string, email: string) => {
    return `${window.location.origin}/register?code=${codigo}&email=${encodeURIComponent(email)}`;
  };

  const columns = [
    { key: 'email', header: 'Email' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'rol', header: 'Rol', render: (invite: Invite) => (
      <span className="capitalize">{invite.rol}</span>
    )},
    { key: 'empresaId', header: 'Empresa', render: (invite: Invite) => {
      const empresa = empresas.find(e => e._id === invite.empresaId);
      return empresa?.nombre || invite.empresaId;
    }},
    { key: 'codigoRegistro', header: 'Código', render: (invite: Invite) => (
      <div className="flex items-center gap-2">
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{invite.codigoRegistro}</code>
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(invite.codigoRegistro, `code-${invite.id}`);
          }}
          className="text-gray-500 hover:text-gray-700"
          title="Copiar código"
        >
          {copiedId === `code-${invite.id}` ? (
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      </div>
    )},
    { key: 'link', header: 'Link', render: (invite: Invite) => {
      const link = getFrontendUrl(invite.codigoRegistro, invite.email);
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(link, `link-${invite.id}`);
          }}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
          title="Copiar link"
        >
          {copiedId === `link-${invite.id}` ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copiado</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M16 5h2a2 2 0 012 2v2m-2 0h-2v6m0 0h2m-2 0v-2m-2 2h2" />
              </svg>
              <span>Copiar link</span>
            </>
          )}
        </button>
      );
    }},
    { key: 'usado', header: 'Estado', render: (invite: Invite) => (
      invite.usado ? (
        <Badge variant="danger">Usado</Badge>
      ) : (
        <Badge variant="success">Disponible</Badge>
      )
    )},
    { key: 'createdAt', header: 'Fecha', render: (invite: Invite) => (
      new Date(invite.createdAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    )},
  ];

  const rolOptions = [
    { value: 'admin', label: 'Administrador' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'lector', label: 'Lector' },
  ];

  const empresaOptions = empresas.map(e => ({ value: e._id, label: e.nombre }));

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Invitaciones</h1>
        <span className="text-sm text-gray-500">
          Solo administradores pueden crear invitaciones
        </span>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Crear nueva invitación</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="correo@ejemplo.com"
          />
          <Input
            label="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre completo"
          />
          <Select
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            options={rolOptions}
          />
          {showEmpresa && (
            <Select
              label="Empresa"
              name="empresaId"
              value={formData.empresaId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Seleccionar empresa' },
                ...empresaOptions,
              ]}
              required={showEmpresa}
            />
          )}
          <div className="md:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}
            <Button type="submit" loading={saving} disabled={saving}>
              Crear invitación
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Invitaciones existentes ({invites.length})
        </h2>
        {invites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay invitaciones creadas
          </p>
        ) : (
          <Table data={invites} columns={columns} />
        )}
      </Card>
    </div>
  );
};