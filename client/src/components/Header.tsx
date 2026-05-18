import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, empresaActiva, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/images/logo/maintika-logo.png" alt="Maintika" className="h-10 w-10 object-contain" />
            <span className="text-lg font-semibold">
              <span className="text-black dark:text-white">M</span>
              <span className="text-black dark:text-white">a</span>
              <span className="text-[#003FC5]">i</span>
              <span className="text-black dark:text-white">ntika</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden min-[820px]:flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
              {user.rol === 'admin' && (
                <>
                  <Link to="/empresas" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Empresas
                  </Link>
                  <Link to="/invites" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Invitaciones
                  </Link>
                </>
              )}
            </nav>
          )}

          {/* Desktop User Info */}
          {user && (
            <div className="hidden min-[820px]:flex items-center gap-4">
              {empresaActiva && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Empresa:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{empresaActiva.nombre}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {user.nombre}
                </span>
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">{user.rol}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>

          {/* Mobile Hamburger Button */}
          {user && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="max-[819px]:block hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 max-[819px]:block hidden" onClick={handleNavClick} />
      )}

      {/* Mobile Menu Panel */}
      <div className={`absolute top-16 right-0 left-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50 max-[819px]:block hidden transition-all duration-200 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="px-4 py-4 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.rol}</p>
            </div>
          </div>

          {/* Empresa Info for Lector */}
          {empresaActiva && (
            <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <span className="text-xs text-gray-600 dark:text-gray-400">Empresa:</span>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{empresaActiva.nombre}</p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              onClick={handleNavClick}
              className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            {user?.rol === 'admin' && (
              <>
                <Link
                  to="/empresas"
                  onClick={handleNavClick}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Empresas
                </Link>
                <Link
                  to="/invites"
                  onClick={handleNavClick}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Invitaciones
                </Link>
              </>
            )}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};