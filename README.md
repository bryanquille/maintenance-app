# Sistema de Gestión de Mantenimiento de Carretillas Hidráulicas

## 1. Título del Proyecto

**Maintenance App** - Sistema de Gestión de Mantenimiento de Carretillas Hidráulicas

Sistema web full-stack desarrollado para la gestión integral del mantenimiento de carretillas hidráulicas manuales en entornos multiempresa. La aplicación permite registrar empresas, asociar carretillas a cada organización y gestionar mantenimientos mediante formularios técnicos detallados basados en procesos reales de mantenimiento industrial.

---

## 2. Demo

**URL de producción:** https://maintenance-app-gxbw.onrender.com

La aplicación se encuentra desplegada y disponible para pruebas en Render (servidor gratuito).

---

## 3. Descripción General

### ¿Qué problema resuelve?

Las empresas que operan carretillas hidráulicas necesitan un sistema centralizado para registrar, rastrear y gestionar el mantenimiento de sus equipos. Este sistema resuelve la problemática de mantener historial completo de mantenimientos, visualizar el estado de cada máquina y garantizar el cumplimiento de protocolos de mantenimiento preventivo y correctivo.

### ¿Para quién está diseñado?

- Empresas con flotas de carretillas hidráulicas
- Departamentos de mantenimiento industrial
- Técnicos de servicio responsables del mantenimiento de equipos
- Administradores que requieren control multiempresa

### ¿Cómo funciona?

La aplicación opera bajo un modelo multiempresa donde cada organización tiene acceso únicamente a sus propios datos. Los usuarios se autentican mediante JWT y tienen roles diferenciados (admin, técnico, lector). El backend expone una API REST que el frontend consume mediante fetch, presentando una interfaz moderna y responsiva construida con React y Tailwind CSS.

---

## 4. Características Principales

- **Multiempresa** - Aislamiento completo de datos entre empresas, cada organización ve únicamente su información
- **CRUD de Empresas** - Crear, leer, actualizar y eliminar empresas
- **CRUD de Carretillas** - Gestión completa de inventario de carretillas por empresa
- **CRUD de Mantenimientos** - Registro de mantenimientos con formulario técnico detallado
- **Autenticación JWT** - Sistema de login seguro con tokens Json Web Token
- **Formularios técnicos detallados** - Formularios estructurados con secciones específicas para preventivo y correctivo
- **Historial por carretilla** - Visualización completa del historial de mantenimientos de cada máquina
- **Filtros y búsqueda** - Búsqueda de carretillas por tipo, modelo, número de serie o ID
- **Control de roles** - Roles de admin, técnico y lector con permisos diferenciados
- **Sistema de Invitaciones** - Registro mediante códigos únicos generados por administradores
- **Valores por rol** - Campo empresaId requerido solo para rol 'lector', opcional para admin y técnico
- **Landing Page pública** - Página de presentación con branding Maintika, optimización responsive mobile y contenido orientado al usuario
- **Seguridad Avanzada** - Acceso seguro con verificación de datos y protección de información

---

## 5. Arquitectura del Sistema

### Separación Frontend/Backend

El proyecto sigue una arquitectura monorepo con dos carpetas principales:

```
maintanance-app/
├── client/          # Frontend (React + TypeScript + Vite)
└── server/          # Backend (Node.js + Express + TypeScript)
```

### API REST

El backend expone una API RESTful que sigue los principios de diseño convencionales:

- **Recursos nouns** - /empresas, /carretillas, /mantenimientos
- **Métodos HTTP** - GET (leer), POST (crear), PUT (actualizar), DELETE (eliminar)
- **Códigos de estado** - 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)

### Flujo de Datos

1. El usuario interactúa con el frontend React
2. El frontend envía requests HTTP usando fetch al backend
3. El backend procesa la request, valida con Zod, ejecuta lógica de negocio en servicios
4. Mongoose interactúa con MongoDB para persistencia
5. La respuesta JSON vuelve al frontend para actualizar el estado

---

## 6. Modelo de Datos

### Entidades Principales

#### Empresa
- `_id`: ObjectId único
- `nombre`: Nombre de la empresa
- `identificacionFiscal`: NIT o identificación fiscal
- `contacto`: Nombre del contacto
- `telefono`, `correo`, `direccion`: Datos de contacto
- `estado`: 'activa' | 'inactiva'

#### Carretilla
- `_id`: ObjectId único
- `empresaId`: Referencia a la empresa dueña
- `tipoDeMaquina`: Tipo de carretilla
- `nroSerie`, `modelo`, `idMaquina`: Identificadores únicos
- `tipoDeServicio`: 'nuevo' | 'usado'
- `tiempoUsoOperacion`: Horas de uso
- `fechaUltimoMantenimiento`, `observacionesUltimoMantenimiento`: Último servicio
- `estado`: 'activa' | 'inactiva' | 'mantenimiento'

#### Mantenimiento
- `_id`: ObjectId único
- `empresaId`, `carretillaId`: Referencias a empresa y carretilla
- `fecha`: Fecha del mantenimiento
- `tipoServicio`: Tipo de servicio realizado
- `descripcionGeneral`: Descripción del trabajo
- `mantenimientoPreventivo`: Objeto con checkboxes de tareas preventivas
- `mantenimientoCorrectivo`: Objeto con checkboxes de tareas correctivas + campo "otros"
- `observaciones`: Observaciones adicionales
- `nombreEncargado`, `ciEncargado`: Datos del técnico
- `nombreReceptor`, `ciReceptor`: Datos del receptor

### Relaciones

```
Empresa (1) ──────< Carretilla (N)
Carretilla (1) ──< Mantenimiento (N)
Empresa (1) ────< Invitacion (N)
```

Cada empresa puede tener múltiples carretillas, y cada carretilla puede tener múltiples mantenimientos. Esta estructura garantiza el aislamiento de datos entre empresas.

---

## 7. Formulario de Mantenimiento

El formulario de mantenimiento está estructurado en bloques lógicos que reflejan el proceso real de documentación del mantenimiento industrial:

### Bloque Superior - Datos Generales
- Fecha del mantenimiento
- Empresa (auto-completado desde contexto)
- Tipo de máquina
- Número de serie
- Modelo
- ID máquina
- Tipo de servicio

### Bloque de Información Operativa
- Tiempo de uso/operación de la máquina
- Fecha del último mantenimiento
- Observaciones del último mantenimiento

### Bloque de Descripción

**Mantenimiento Preventivo (checkboxes):**
- Revisión y ajuste del sistema hidráulico
- Relleno de líquido hidráulico
- Revisión y limpieza de ruedas directrices y de carga
- Ajuste de partes en todo el equipo
- Lubricación y engrase
- Limpieza profunda
- Evaluación a próximo mantenimiento

**Mantenimiento Correctivo (checkboxes):**
- Revisión del sistema hidráulico
- Cambio de empaques del sistema hidráulico
- Cambio de líquido hidráulico
- Cambio ruedas delante de carga
- Cambio de ruedas directrices
- Corrección en cadena
- Cambio de rodamiento en base de soporte
- Campo "otros" para tareas adicionales

**Campos de texto:**
- Descripción general
- Observaciones adicionales

### Bloque de Firmas
- Firma/Nombre del encargado de mantenimiento
- CI del encargado
- Firma/Nombre del receptor
- CI del receptor

---

## 8. Estructura del Proyecto

```
maintanance-app/
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/        # Componentes reutilizables UI
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/            # Páginas de la aplicación
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EmpresasPage.tsx
│   │   │   ├── CarretillasPage.tsx
│   │   │   ├── MantenimientosPage.tsx
│   │   │   └── InvitesPage.tsx
│   │   ├── services/         # Capa de comunicación API
│   │   │   └── api.ts
│   │   ├── store/             # Estado global Zustand
│   │   │   └── authStore.ts
│   │   ├── types/             # Tipos TypeScript
│   │   │   └── index.ts
│   │   ├── routes/            # Configuración de rutas
│   │   │   └── AppRoutes.tsx
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── server/                   # Backend
    └── src/
        ├── config/            # Configuración (MongoDB, variables)
        ├── controllers/       # Controladores Express
        ├── services/          # Lógica de negocio
        ├── models/             # Modelos Mongoose
        ├── routes/             # Rutas API
        ├── middlewares/       # Middleware JWT, errores
        ├── validators/         # Esquemas Zod
        ├── types/              # Tipos TypeScript
        └── index.ts            # Entry point
```

### Descripción de Carpetas del Backend

- **controllers**: Manejan las requests HTTP y delegan a los servicios
- **services**: Contienen la lógica de negocio, separada de los controladores
- **models**: Modelos Mongoose con esquemas y documentos de MongoDB
- **routes**: Definición de endpoints API REST
- **middlewares**: Middleware de autenticación JWT y manejo de errores
- **validators**: Esquemas de validación Zod para entrada de datos, incluyendo validación condicional según rol

---

## 9. Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- MongoDB Atlas (cuenta gratuita)
- Git

### Backend

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=tu_clave_secreta
# CORS_ORIGIN=http://localhost:5173

# Ejecutar en modo desarrollo
npm run dev
```

### Frontend

```bash
# Navegar al directorio del cliente
cd client

# Instalar dependencias
npm install

# Copiar archivo de ejemplo de variables de entorno
cp .env.example .env

# Editar .env si es necesario
# VITE_API_URL=http://localhost:3001/api

# Ejecutar en modo desarrollo
npm run dev
```

---

## 10. Variables de Entorno

### Backend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Clave secreta para firmar JWT | Cadena aleatoria segura |
| `PORT` | Puerto del servidor (default: 3001) | `3001` |
| `CORS_ORIGIN` | URL del frontend para CORS | `http://localhost:5173` |

### Frontend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3001/api` |

---

## 11. Ejecución Local

### Backend

```bash
cd server
npm run dev
# Servidor corriendo en http://localhost:3001
```

### Frontend

```bash
cd client
npm run dev
# Aplicación en http://localhost:5173
```

Para desarrollo completo, ejecutar ambos comandos en terminales separadas.

---

## 12. Despliegue

### Render (Recomendado)

La aplicación está configurada para desplegarse en Render como un único servicio Web que sirve tanto el backend como el frontend estático.

**Configuración del servicio:**

1. **Root Directory:** `server`
2. **Build Command:** `npm install && npm run build:all`
3. **Start Command:** `npm run start`

**Variables de entorno en Render:**

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=genera_una_clave_segura
CORS_ORIGIN=https://tu-app.onrender.com
```

**Notas adicionales:**
- El script `build:all` compila el backend y el frontend
- Express sirve los archivos estáticos del frontend desde `client/dist`
- MongoDB Atlas debe tener las IPs de Render whitelisteadas o acceso desde cualquier IP (0.0.0.0/0)

### MongoDB Atlas

1. Crear cluster gratuito
2. Configurar usuario y contraseña
3. Obtener URI de conexión
4. Agregar IP de Render al Network Access (0.0.0.0/0 para desarrollo)

---

## 13. Endpoints Principales

### Auth

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario actual |

### Empresas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/empresas` | Listar todas las empresas |
| GET | `/api/empresas/:id` | Obtener empresa por ID |
| POST | `/api/empresas` | Crear nueva empresa |
| PUT | `/api/empresas/:id` | Actualizar empresa |
| DELETE | `/api/empresas/:id` | Eliminar empresa |

### Carretillas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/empresas/:empresaId/carretillas` | Listar carretillas de empresa |
| GET | `/api/carretillas/:id` | Obtener carretilla por ID |
| POST | `/api/empresas/:empresaId/carretillas` | Crear carretilla |
| PUT | `/api/carretillas/:id` | Actualizar carretilla |
| DELETE | `/api/carretillas/:id` | Eliminar carretilla |

### Mantenimientos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/empresas/:empresaId/mantenimientos` | Listar mantenimientos de empresa |
| GET | `/api/carretillas/:carretillaId/mantenimientos` | Listar mantenimientos de carretilla |
| GET | `/api/mantenimientos/:id` | Obtener mantenimiento por ID |
| POST | `/api/carretillas/:carretillaId/mantenimientos` | Crear mantenimiento |
| PUT | `/api/mantenimientos/:id` | Actualizar mantenimiento |
| DELETE | `/api/mantenimientos/:id` | Eliminar mantenimiento |

### Invitaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/invites` | Listar invitaciones activas (solo admin) |
| POST | `/api/invites` | Crear nueva invitación |
| DELETE | `/api/invites/:id` | Eliminiar invitación |

Todos los endpoints (excepto registro y login) requieren autenticación JWT mediante header `Authorization: Bearer <token>`.

---

## 14. Decisiones Técnicas

### ¿Por qué MERN?

El stack MERN (MongoDB, Express, React, Node.js) fue seleccionado por:
- **Unificación del lenguaje**: JavaScript/TypeScript en todo el stack
- **JSON nativo**: Comunicación fluida entre todas las capas
- **Comunidad activa**: Gran ecosistema de librerías y recursos
- **Curva de aprendizaje**: Equipo familiarizado con JavaScript

### ¿Por qué MongoDB?

- **Modelo de datos flexible**: Ideal para entidades con campos variables
- **Integración con Mongoose**: Tipado completo con TypeScript
- **Escalabilidad horizontal**: Capacidad de crecer con el volumen de datos
- **Free tier MongoDB Atlas**: Opción gratuita adecuada para desarrollo

### ¿Por qué JWT?

- **Stateless**: No requiere almacenamiento en servidor
- **Estandard de industria**: Ampliamente adoptado y seguro
- **Expiración configurable**: Control sobre vigencia de sesiones
- **Payload personalizable**: Información del usuario embebida en el token

### ¿Por qué fetch en lugar de axios?

- **Sin dependencias adicionales**: Fetch es nativo del browser
- **Menor bundle size**: No añade peso extra a la aplicación
- **Suficiente funcionalidad**: Cumple todos los requisitos de la aplicación
- **Simplicidad**: API moderna y Promise-based

### ¿Por qué Zod con validación condicional?

- **Validación en tiempo de ejecución**: Esquemas definidos en backend se validan antes de procesar
- **Flexibilidad según contexto**: El campo empresaId es obligatorio solo para rol 'lector', opcional para admin/técnico
- **Mensajes de error claros**: Validación robusta con feedback específico para el usuario

---

## 15. Mejoras Futuras

### Funcionalidades Planeadas

- **Reportes PDF**: Generación automática de reportes de mantenimiento
- **Notificaciones por email**: Alertas de mantenimiento preventivo pendiente
- **Dashboard de métricas**: Estadísticas de mantenimientos por período
- **App móvil**: Acceso desde dispositivos móviles (React Native/Expo)
- **Roles avanzados**: Permisos granulares por funcionalidad
- **Exportación de datos**: CSV/Excel para análisis externo
- **Adjuntos**: Fotos evidencia de mantenimiento
- **Multi-idioma**: Soporte para español/inglés

### Mejoras de Código

- **Tests unitarios**: Jest para backend, Vitest para frontend
- **Documentación API**: Swagger/OpenAPI
- **Logging estructurado**: Winston/Pino
- **Rate limiting**: Protección contra abusos
- **Cache**: Redis para optimizar consultas frecuentes

---

## 16. Licencia

MIT License

Copyright (c) 2024 Maintenance App

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Contribuciones

Las contribuciones son bienvenidas. Por favor, haz fork del repositorio y crea un pull request con tus cambios.

---

**Este README fue generado automáticamente para el proyecto Maintenance App.**