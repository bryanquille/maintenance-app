import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-1 4h1m2-10v2m0-2v-2m0 0h-5m5 0h5" />
      </svg>
    ),
    title: 'Gestión de Empresas',
    description: 'Administra múltiples empresas desde un panel centralizado con control total.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 1v6m-4-7a4 4 0 110 8 4 4 0 010-8zM3 9a2 2 0 012-2h.093a2 2 0 001.832-1.347l.54-1.63a2 2 0 012.252-1.02L9 3h6l1.874 2.656a2 2 0 012.252 1.02l.54 1.63A2 2 0 0017.093 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      </svg>
    ),
    title: 'Control de Carretillas',
    description: 'Registro completo con estados: activa, inactiva o en mantenimiento.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Historial de Mantenimientos',
    description: 'Seguimiento detallado de cada equipo y sus servicios realizados.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a2 2 0 012 2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7a2 2 0 012-2m4 0v5m-4 0h8m-4 0v-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6" />
      </svg>
    ),
    title: 'Sistema de Invitaciones',
    description: 'Registro seguro mediante códigos únicos asignados por admins.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Seguridad Avanzada',
    description: 'Tu información protegida con acceso seguro y verificación de datos.',
  },
];

const roles = [
  {
    title: 'Administrador',
    description: 'Control total del sistema. Gestiona empresas, usuarios, carretillas y mantenimientos.',
    color: 'bg-blue-600',
  },
  {
    title: 'Técnico',
    description: 'Gestión de carretillas y registro de mantenimientos preventivos y correctivos.',
    color: 'bg-green-600',
  },
  {
    title: 'Lector',
    description: 'Solo visualización de información de su empresa asignada.',
    color: 'bg-gray-600',
  },
];

const valueItems = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: 'Evita pérdida de información',
    description: 'Todos los registros quedan guardados y organizados para que nunca pierdas datos importantes',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Mejor toma de decisiones',
    description: 'Accede rápidamente al historial y estado de tus equipos para actuar a tiempo',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Trabajo más ordenado',
    description: 'Estandariza el registro de mantenimientos y mejora la gestión de tu equipo',
  },
];

export const LandingPage: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src="/images/logo/maintika-logo.png" alt="Maintika" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold">
                <span className="text-black">M</span>
                <span className="text-black">a</span>
                <span className="text-[#003FC5]">i</span>
                <span className="text-black">ntika</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors duration-200 whitespace-nowrap"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src="/images/logo/maintika-logo.png"
            alt="Maintika"
            className="mx-auto h-32 w-32 object-contain mb-8"
          />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            <span className="text-black">M</span>
            <span className="text-black">a</span>
            <span className="text-[#003FC5]">i</span>
            <span className="text-black">ntika</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Sistema de mantenimiento de carretillas hidráulicas
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
Gestiona carretillas, mantenimientos y empresas en una sola plataforma.
            Control total con seguridad avanzada.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-md"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Todas las funcionalidades que necesitas
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Una plataforma completa para gestionar tu flota de carretillas hidráulicas
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Roles definidos para cada usuario
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Control de acceso preciso según el rol de cada usuario en la organización
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Pensado para empresas que necesitan control real
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Maintika te ayuda a mantener el orden, evitar errores y tener siempre información confiable
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-blue-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Empieza a gestionar tu mantenimiento hoy
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Únete a las empresas que ya usan Maintika para optimizar su gestión de carretillas hidráulicas.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg"
          >
            Crear cuenta
          </Link>
          <p className="mt-4 text-sm text-blue-200">
            El registro requiere una invitación previa proporcionada por un administrador.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo/maintika-logo.png" alt="Maintika" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-white">
              <span className="text-white">M</span>
              <span className="text-white">a</span>
              <span className="text-[#003FC5]">i</span>
              <span className="text-white">ntika</span>
            </span>
          </div>
          <p className="text-gray-400">
            © {currentYear} Maintika. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};