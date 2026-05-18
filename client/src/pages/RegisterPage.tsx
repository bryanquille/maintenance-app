import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Button, Input } from '../components';
import { ThemeToggle } from '../components/ThemeToggle';

const PASSWORD_REQUIREMENTS = [
  { label: 'Mínimo 8 caracteres', test: (pwd: string) => pwd.length >= 8 },
  { label: 'Al menos una mayúscula (A-Z)', test: (pwd: string) => /[A-Z]/.test(pwd) },
  { label: 'Al menos un número (0-9)', test: (pwd: string) => /\d/.test(pwd) },
  { label: 'Al menos un carácter especial (@$!%*?&)', test: (pwd: string) => /[@$!%*?&]/.test(pwd) },
];

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    codigoRegistro: '',
  });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);
  const passwordReqsRef = useRef<HTMLDivElement>(null);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const passwordChecks = PASSWORD_REQUIREMENTS.map((req) => ({
    ...req,
    met: req.test(formData.password),
  }));

  useEffect(() => {
    const code = searchParams.get('code');
    const email = searchParams.get('email');

    if (code || email) {
      setFormData(prev => ({
        ...prev,
        codigoRegistro: code || prev.codigoRegistro,
        email: email || prev.email,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        passwordReqsRef.current &&
        !passwordReqsRef.current.contains(event.target as Node)
      ) {
        setShowPasswordReqs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPreFilled = searchParams.has('code') || searchParams.has('email');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.codigoRegistro
      );
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">Crear Cuenta</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Registro de usuario</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="correo@ejemplo.com"
              readOnly={isPreFilled}
              disabled={isPreFilled}
              className={isPreFilled ? 'bg-gray-100 cursor-not-allowed' : ''}
            />

            <Input
              label="Código de registro"
              name="codigoRegistro"
              value={formData.codigoRegistro}
              onChange={handleChange}
              required
              placeholder="Ingresa tu código de invitación"
              readOnly={isPreFilled}
              disabled={isPreFilled}
              className={isPreFilled ? 'bg-gray-100 cursor-not-allowed' : ''}
            />

            <div className="relative">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  setShowPasswordReqs(true);
                }}
                onFocus={() => setShowPasswordReqs(true)}
                required
                placeholder="••••••••"
                showToggle
              />
              {showPasswordReqs && formData.password && (
                <div ref={passwordReqsRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Requisitos de contraseña:</p>
                  <ul className="space-y-1">
                    {passwordChecks.map((req, idx) => (
                      <li
                        key={idx}
                        className={`text-xs flex items-center gap-1 ${
                          req.met ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        {req.met ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Input
              label="Confirmar Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              error={passwordError}
            />

            <Button type="submit" loading={loading} className="w-full">
              Crear Cuenta
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Inicia Sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};