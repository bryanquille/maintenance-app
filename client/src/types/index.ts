export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'tecnico' | 'lector';
  empresaId?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

export interface Empresa {
  _id: string;
  nombre: string;
  identificacionFiscal?: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  estado: 'activa' | 'inactiva';
  createdAt: string;
  updatedAt: string;
}

export interface Carretilla {
  _id: string;
  empresaId: string;
  fecha: string;
  tipoDeMaquina: string;
  nroSerie: string;
  modelo: string;
  idMaquina: string;
  tipoDeServicio: 'nuevo' | 'usado';
  tiempoUsoOperacion?: number;
  fechaUltimoMantenimiento?: string;
  observacionesUltimoMantenimiento?: string;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
  createdAt: string;
  updatedAt: string;
}

export interface MantenimientoPreventivo {
  revisionSistemaHidraulico?: boolean;
  rellenoLiquido?: boolean;
  revisionLimpiezaRuedas?: boolean;
  ajustePartes?: boolean;
  lubricacionEngrase?: boolean;
  limpiezaProfunda?: boolean;
  evaluacionProximo?: boolean;
}

export interface MantenimientoCorrectivo {
  revisionSistema?: boolean;
  cambioEmpaques?: boolean;
  cambioLiquido?: boolean;
  cambioRuedasCarga?: boolean;
  cambioRuedasDirectrices?: boolean;
  correccionCadena?: boolean;
  cambioRodamiento?: boolean;
  otros?: string;
}

export interface Mantenimiento {
  _id: string;
  empresaId: string;
  carretillaId: string | Carretilla;
  fecha: string;
  tipoServicio: string;
  descripcionGeneral?: string;
  mantenimientoPreventivo?: MantenimientoPreventivo;
  mantenimientoCorrectivo?: MantenimientoCorrectivo;
  observaciones?: string;
  nombreEncargado?: string;
  ciEncargado?: string;
  nombreReceptor?: string;
  ciReceptor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}