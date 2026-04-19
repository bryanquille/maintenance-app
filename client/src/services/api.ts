const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }
  return data;
};

export const authApi = {
  register: async (email: string, password: string, confirmPassword: string, codigoRegistro: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, confirmPassword, codigoRegistro }),
    });
    return handleResponse<import('../types/index').AuthResponse>(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<import('../types/index').AuthResponse>(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').User>>(response);
  },
};

export const empresaApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/empresas`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Empresa[]>>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/empresas/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Empresa>>(response);
  },

  create: async (data: Partial<import('../types/index').Empresa>) => {
    const response = await fetch(`${API_URL}/empresas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Empresa>>(response);
  },

  update: async (id: string, data: Partial<import('../types/index').Empresa>) => {
    const response = await fetch(`${API_URL}/empresas/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Empresa>>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/empresas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<{ message: string }>>(response);
  },
};

export const carretillaApi = {
  getByEmpresa: async (empresaId: string, filters?: { search?: string; estado?: string; tipoDeMaquina?: string }) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.tipoDeMaquina) params.append('tipoDeMaquina', filters.tipoDeMaquina);

    const query = params.toString();
    const response = await fetch(`${API_URL}/empresas/${empresaId}/carretillas${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Carretilla[]>>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/carretillas/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Carretilla>>(response);
  },

  create: async (empresaId: string, data: Partial<import('../types/index').Carretilla>) => {
    const response = await fetch(`${API_URL}/empresas/${empresaId}/carretillas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...data, empresaId }),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Carretilla>>(response);
  },

  update: async (id: string, data: Partial<import('../types/index').Carretilla>) => {
    const response = await fetch(`${API_URL}/carretillas/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Carretilla>>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/carretillas/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<{ message: string }>>(response);
  },
};

export const mantenimientoApi = {
  getByEmpresa: async (empresaId: string, filters?: { fechaDesde?: string; fechaHasta?: string; tipoServicio?: string; responsable?: string }) => {
    const params = new URLSearchParams();
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
    if (filters?.tipoServicio) params.append('tipoServicio', filters.tipoServicio);
    if (filters?.responsable) params.append('responsable', filters.responsable);

    const query = params.toString();
    const response = await fetch(`${API_URL}/empresas/${empresaId}/mantenimientos${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Mantenimiento[]>>(response);
  },

  getByCarretilla: async (carretillaId: string) => {
    const response = await fetch(`${API_URL}/carretillas/${carretillaId}/mantenimientos`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Mantenimiento[]>>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/mantenimientos/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Mantenimiento>>(response);
  },

  create: async (carretillaId: string, empresaId: string, data: Partial<import('../types/index').Mantenimiento>) => {
    const response = await fetch(`${API_URL}/carretillas/${carretillaId}/mantenimientos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...data, empresaId, carretillaId }),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Mantenimiento>>(response);
  },

  update: async (id: string, data: Partial<import('../types/index').Mantenimiento>) => {
    const response = await fetch(`${API_URL}/mantenimientos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<import('../types/index').ApiResponse<import('../types/index').Mantenimiento>>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/mantenimientos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<import('../types/index').ApiResponse<{ message: string }>>(response);
  },
};