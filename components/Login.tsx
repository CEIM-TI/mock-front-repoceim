import React, { useState } from 'react';
import { login } from '../services/authService';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@gestor.local');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(email, password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans overflow-hidden">
      {/* Lado Izquierdo - Branding (Oculto en móviles) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-primary flex-col justify-between p-12 relative">
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-12">
            <div className="bg-brand-secondary p-2 rounded-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-brand-primary">
                 <path d="M19.14 4.58c.84 0 1.52.68 1.52 1.52v11.8c0 .84-.68 1.52-1.52 1.52H4.86c-.84 0-1.52-.68-1.52-1.52V6.1c0-.84.68-1.52 1.52-1.52h14.28zM12 6.55v4.54H7.55V6.55H12zm4.45 0v4.54h-4.45V6.55h4.45zm0 8.91v-4.36h-4.45v4.36h4.45zm-4.45 0v-4.36H7.55v4.36H12z"/>
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-widest uppercase">CEIM</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Gestor de <br/><span className="text-brand-secondary">Documentos</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-md leading-relaxed">
            Plataforma corporativa para el control de repositorios, versionamiento, validaciones y capacitaciones.
          </p>
        </div>
        
        {/* Decoración geométrica simple (sin difuminados) */}
        <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="150" stroke="white" strokeWidth="40"/>
            <circle cx="200" cy="200" r="80" stroke="#f1e434" strokeWidth="40"/>
          </svg>
        </div>

        <div className="text-blue-300 text-sm relative z-10 font-medium">
          &copy; {new Date().getFullYear()} Centro de Entrenamiento Industrial y Minero.
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Logo visible solo en móviles */}
          <div className="lg:hidden flex items-center space-x-3 mb-10 justify-center">
            <div className="bg-brand-primary p-2 rounded-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-brand-secondary">
                 <path d="M19.14 4.58c.84 0 1.52.68 1.52 1.52v11.8c0 .84-.68 1.52-1.52 1.52H4.86c-.84 0-1.52-.68-1.52-1.52V6.1c0-.84.68-1.52 1.52-1.52h14.28zM12 6.55v4.54H7.55V6.55H12zm4.45 0v4.54h-4.45V6.55h4.45zm0 8.91v-4.36h-4.45v4.36h4.45zm-4.45 0v-4.36H7.55v4.36H12z"/>
              </svg>
            </div>
            <span className="text-3xl font-extrabold text-brand-primary tracking-widest uppercase">CEIM</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-500 font-medium text-sm">Ingresa tus credenciales para acceder al sistema.</p>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm font-medium border border-red-200 flex items-start animate-fade-in-up">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Correo Electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-primary transition-all duration-200 text-gray-900"
                placeholder="ejemplo@ceim.cl"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                <a href="#" className="text-xs text-brand-primary hover:underline font-bold transition-all">¿Olvidaste tu contraseña?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-primary transition-all duration-200 text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-secondary text-brand-primary py-3.5 rounded-lg font-extrabold text-lg hover:bg-[#d8c82d] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow flex justify-center items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
          
          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium text-center mb-3 uppercase tracking-wider">Cuentas de prueba</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="font-mono bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-bold border border-gray-200">admin@gestor.local</span>
              <span className="font-mono bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-bold border border-gray-200">editor@gestor.local</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
