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

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const fillAndLogin = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('password123');
    // Pequeño delay para que el usuario vea el cambio antes de intentar ingresar
    setTimeout(() => {
      // Intentar login automático tras el relleno
      setLoading(true);
      login(accEmail, 'password123')
        .then(user => onLoginSuccess(user))
        .catch(err => {
          setError(err.message || 'Error al iniciar sesión');
          setLoading(false);
        });
    }, 400);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans overflow-hidden">
      <div className="hidden lg:flex lg:w-3/5 bg-brand-primary flex-col justify-between p-12 lg:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="600" cy="200" r="300" stroke="white" strokeWidth="2" strokeDasharray="20 20" />
            <circle cx="100" cy="700" r="250" stroke="white" strokeWidth="1" />
            <path d="M-100 200 L400 700" stroke="#f1e434" strokeWidth="2" opacity="0.3" />
            <path d="M0 100 L500 600" stroke="#f1e434" strokeWidth="2" opacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center space-x-4 mb-16 group cursor-default">
            <div className="transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
              <img src="/imgs/logo-ceim-180.png" alt="CEIM Logo" className="w-24 h-auto brightness-110 contrast-125 select-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white tracking-[0.2em] leading-none uppercase">CEIM</span>
              <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-[0.3em] mt-1 ml-0.5">Control Documental</span>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-6xl xl:text-7xl font-black text-white leading-tight mb-8 drop-shadow-2xl">
              Sistema de <br /><span className="text-brand-secondary selection:bg-white selection:text-brand-primary">Gestión Doc</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-xl leading-relaxed font-medium opacity-90 border-l-4 border-brand-secondary pl-6 py-2">
              Plataforma avanzada para la administración de repositorios técnicos, control de versionamiento, autorizaciones críticas y seguimiento de competencias industriales.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-8 text-blue-200/60 text-xs relative z-10 font-bold uppercase tracking-widest animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <span>Seguridad</span>
          <span className="w-1 h-1 rounded-full bg-brand-secondary opacity-50"></span>
          <span>Trazabilidad</span>
          <span className="w-1 h-1 rounded-full bg-brand-secondary opacity-50"></span>
          <span>Eficiencia</span>
        </div>
      </div>

      {/* Lado Derecho - Formulario Premium */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 sm:p-12 lg:p-16 xl:p-20 bg-white relative animate-fade-in">
        <div className="w-full max-w-md flex flex-col h-full lg:justify-center">

          <div className="mb-12 text-center lg:text-left animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Logo Mobile */}
            <div className="lg:hidden flex items-center space-x-3 mb-8 justify-center">
              <div className="bg-white p-2 rounded-xl shadow-md border border-slate-100">
                <img src="/imgs/logo-ceim-180.png" alt="CEIM Logo" className="w-12 h-auto" />
              </div>
              <span className="text-3xl font-black text-brand-primary tracking-widest uppercase">CEIM</span>
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight selection:bg-brand-secondary selection:text-brand-primary">Acceso al Portal</h2>
            <p className="text-slate-500 font-semibold text-base">Identifícate para gestionar la documentación técnica.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-2xl mb-8 text-sm font-bold border-2 border-red-100 flex items-start animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="space-y-2 group">
              <label className="block text-sm font-black text-slate-700 uppercase tracking-widest group-focus-within:text-brand-primary transition-colors">Corporativo / Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary focus:bg-white transition-all duration-300 text-slate-900 font-bold placeholder-slate-300"
                  placeholder="usuario@ceim.cl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-black text-slate-700 uppercase tracking-widest group-focus-within:text-brand-primary transition-colors">Contraseña Segura</label>
                <a href="#" className="text-[10px] text-brand-primary/60 hover:text-brand-primary font-black uppercase tracking-tighter transition-all">Recuperar Acceso</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 focus:border-brand-secondary focus:bg-white transition-all duration-300 text-slate-900 font-bold placeholder-slate-300"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-brand-primary text-white rounded-2xl font-black text-lg uppercase tracking-[0.15em] hover:bg-slate-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_40px_-5px_rgba(4,30,66,0.4)] flex justify-center items-center hover:shadow-2xl hover:shadow-brand-primary/30 border-b-4 border-slate-900 group"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="animate-pulse">Validando Sesión</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <span>Iniciar Sesión</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-[10px] text-slate-400 font-black text-center mb-6 uppercase tracking-[0.25em]">Accesos Rápidos para Evaluación</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => fillAndLogin('admin@gestor.local')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-secondary hover:shadow-lg hover:shadow-brand-secondary/10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center mb-2 group-hover:bg-brand-secondary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-primary group-hover:text-brand-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-900 group-hover:text-brand-primary">Admin</span>
                <span className="text-[8px] font-bold text-slate-400 mt-0.5 group-hover:text-brand-primary/50">Completo</span>
              </button>

              <button
                onClick={() => fillAndLogin('editor@gestor.local')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-secondary hover:shadow-lg hover:shadow-brand-secondary/10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center mb-2 group-hover:bg-brand-secondary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-primary group-hover:text-brand-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-900 group-hover:text-brand-primary">Editor</span>
                <span className="text-[8px] font-bold text-slate-400 mt-0.5 group-hover:text-brand-primary/50">Modificar</span>
              </button>

              <button
                onClick={() => fillAndLogin('lector@gestor.local')}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 hover:bg-white hover:border-brand-secondary hover:shadow-lg hover:shadow-brand-secondary/10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center mb-2 group-hover:bg-brand-secondary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-brand-primary group-hover:text-brand-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase text-slate-900 group-hover:text-brand-primary">Lector</span>
                <span className="text-[8px] font-bold text-slate-400 mt-0.5 group-hover:text-brand-primary/50">Consulta</span>
              </button>
            </div>
          </div>


        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}} />
    </div>
  );
};
