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

export interface Invite {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'tecnico' | 'lector';
  empresaId: string;
  codigoRegistro: string;
  usado: boolean;
  fechaExpiracion?: string;
  createdAt: string;
}

export interface CreateInviteInput {
  email: string;
  nombre: string;
  rol: 'admin' | 'tecnico' | 'lector';
  empresaId: string;
  fechaExpiracion?: string;
}

export interface CreateInviteResponse {
  success: boolean;
  data: Invite;
}

export interface GetInvitesResponse {
  success: boolean;
  data: Invite[];
}

export const inviteApi = {
  createInvite: async (data: CreateInviteInput): Promise<CreateInviteResponse> => {
    const response = await fetch(`${API_URL}/invites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CreateInviteResponse>(response);
  },

  getInvites: async (): Promise<GetInvitesResponse> => {
    const response = await fetch(`${API_URL}/invites`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<GetInvitesResponse>(response);
  },
};