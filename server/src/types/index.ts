export interface IUser {
  _id: string;
  email: string;
  password: string;
  rol: 'admin' | 'tecnico' | 'lecto';
  empresaId?: string;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEmpresa {
  _id: string;
  nombre: string;
  identificacionFiscal?: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  estado: 'activa' | 'inactiva';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarretilla {
  _id: string;
  empresaId: string;
  fecha: Date;
  tipoDeMaquina: string;
  nroSerie: string;
  modelo: string;
  idMaquina: string;
  tipoDeServicio: 'nuevo' | 'usado';
  tiempoUsoOperacion?: number;
  fechaUltimoMantenimiento?: Date;
  observacionesUltimoMantenimiento?: string;
  estado: 'activa' | 'inactiva' | 'mantenimiento';
  createdAt: Date;
  updatedAt: Date;
}

export interface IMantenimiento {
  _id: string;
  empresaId: string;
  carretillaId: string;
  fecha: Date;
  tipoServicio: string;
  descripcionGeneral: string;
  mantenimientoPreventivo: {
    revisionSistemaHidraulico?: boolean;
    rellenoLiquido?: boolean;
    revisionLimpiezaRuedas?: boolean;
    ajustePartes?: boolean;
    lubricacionEngrase?: boolean;
    limpiezaProfunda?: boolean;
    evaluacionProximo?: boolean;
  };
  mantenimientoCorrectivo: {
    revisionSistema?: boolean;
    cambioEmpaques?: boolean;
    cambioLiquido?: boolean;
    cambioRuedasCarga?: boolean;
    cambioRuedasDirectrices?: boolean;
    correccionCadena?: boolean;
    cambioRodamiento?: boolean;
    otros?: string;
  };
  observaciones?: string;
  nombreEncargado?: string;
  ciEncargado?: string;
  nombreReceptor?: string;
  ciReceptor?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
  rol: 'admin' | 'tecnico' | 'lecto';
  empresaId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}