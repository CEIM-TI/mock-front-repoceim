import React from 'react';
import { User } from '../types';
import { logout } from '../services/authService';

interface SidebarProps {
  currentUser: User;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
  activeSpecialView: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, isOpen, onClose, onAction, activeSpecialView }) => {
  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleAction = (action: string) => {
    onAction(action);
    if (window.innerWidth < 1024) onClose(); // Cierra en móvil al hacer clic
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-brand-primary/60 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Menú lateral */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-primary border-r border-blue-900 flex flex-col h-full text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleAction('home')}>
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-xl shadow-inner">
              <img src="/imgs/logo-ceim-180.png" alt="CEIM Logo" className="w-10 h-auto" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-white tracking-tight uppercase">Gestor <span className="text-brand-secondary">Doc</span></span>
              <span className="text-[8px] text-white/40 font-bold uppercase tracking-[0.2em]">Plataforma Digital</span>
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex items-center justify-between border-b border-white/10 bg-black/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary font-bold text-sm shadow-md ring-2 ring-white/20">
              {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-tight">{currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}</span>
              <span className="text-xs text-brand-secondary font-medium">{currentUser.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors" title="Cerrar sesión">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
            </svg>
          </button>
        </div>

        <div className="p-4 flex flex-col space-y-2 mt-2">
          <div
            onClick={() => handleAction('scan')}
            className="flex items-center justify-between bg-brand-secondary text-brand-primary hover:bg-[#d8c82d] p-3.5 rounded-xl text-sm font-extrabold cursor-pointer transition-all duration-200 shadow-md group"
          >
            <span className="flex items-center uppercase tracking-wider text-xs">Escanear Código QR</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform group-hover:scale-110 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <h3 className="px-6 text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Mis Documentos</h3>
          <ul className="space-y-1 px-3 text-sm">
            <li>
              <div
                onClick={() => handleAction('favorites')}
                className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${activeSpecialView === 'favorites' ? 'bg-white/20 text-brand-secondary' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
                <span className="font-semibold">Favoritos</span>
              </div>
            </li>
            <li>
              <div
                onClick={() => handleAction('popular')}
                className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${activeSpecialView === 'popular' ? 'bg-white/20 text-brand-secondary' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
                <span className="font-semibold">Populares</span>
              </div>
            </li>
            <li>
              <div
                onClick={() => handleAction('recent')}
                className={`flex items-center space-x-3 cursor-pointer p-3 rounded-xl transition-all duration-200 ${activeSpecialView === 'recent' ? 'bg-white/20 text-brand-secondary' : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="font-semibold">Vistos Recientemente</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
