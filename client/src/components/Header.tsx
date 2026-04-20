import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Header: React.FC = () => {
  const { user, empresaActiva, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/images/logo/maintika-logo.png" alt="Maintika" className="h-10 w-10 object-contain" />
              <span className="text-lg font-semibold">
                <span className="text-black">M</span>
                <span className="text-black">a</span>
                <span className="text-[#003FC5]">i</span>
                <span className="text-black">ntika</span>
              </span>
            </Link>
            {user && (
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                {user.rol === 'admin' && (
                  <>
                    <Link to="/empresas" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Empresas
                    </Link>
                    <Link to="/invites" className="text-gray-600 hover:text-gray-900 transition-colors">
                      Invitaciones
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>
          {user && (
            <div className="flex items-center gap-4">
              {empresaActiva && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Empresa:</span>
                  <span className="text-sm font-medium text-gray-900">{empresaActiva.nombre}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{user.nombre}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{user.rol}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};