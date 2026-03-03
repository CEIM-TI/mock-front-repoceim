import React from 'react';

interface TopBarProps {
  breadcrumbs: { id: string, name: string }[];
  onNavigate: (index: number) => void;
  title?: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  onUploadClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ breadcrumbs, onNavigate, title, searchQuery, onSearchChange, onToggleSidebar, onUploadClick }) => {
  return (
    <div className="bg-white px-4 md:px-8 py-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-10 border-b border-gray-100 flex flex-col justify-center sticky top-0">
      <div className="flex items-center text-xs font-medium text-gray-400 mb-3 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button onClick={onToggleSidebar} className="lg:hidden mr-3 text-brand-primary p-1 bg-gray-50 rounded-md">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <span 
          className="cursor-pointer hover:text-brand-primary transition-colors flex items-center"
          onClick={() => onNavigate(-1)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
            <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
          </svg>
          Inicio
        </span>
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.id}>
            <span className="mx-2 text-gray-300">/</span>
            <span 
              className={`cursor-pointer transition-colors ${index === breadcrumbs.length - 1 ? 'text-brand-primary font-bold' : 'hover:text-brand-primary'}`}
              onClick={() => onNavigate(index)}
            >
              {crumb.name}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-primary tracking-tight truncate flex-1">
          {title || 'Buscar Documentos'}
        </h1>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 md:w-80 group flex-shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Buscar por SKU, título..."
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:bg-white focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-all duration-300 shadow-sm"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            )}
          </div>
          
          <button 
            onClick={onUploadClick}
            className="hidden sm:flex items-center justify-center bg-brand-primary text-brand-secondary p-2.5 rounded-full hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
            title="Subir Nuevo Documento"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          
          {/* Botón flotante para móvil (se renderiza aquí pero se posiciona fixed) */}
          <button 
            onClick={onUploadClick}
            className="sm:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-brand-primary text-brand-secondary rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(4,30,66,0.5)] hover:scale-105 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}}/>
    </div>
  );
};
