import React, { useState, useMemo, useEffect } from 'react';
import { DocumentItem } from '../types';

interface DocumentListProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
  selectedDocId?: string;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onSelectDocument, selectedDocId, favorites, onToggleFavorite }) => {
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const documentTypes = useMemo(() => {
    const types = new Set(documents.map(d => d.type));
    return ['Todos', ...Array.from(types)];
  }, [documents]);

  const filteredDocs = useMemo(() => {
    if (selectedType === 'Todos') return documents;
    return documents.filter(d => d.type === selectedType);
  }, [documents, selectedType]);

  // Reset pagination when documents or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [documents, selectedType]);

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'PUBLICADO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
      case 'EN REVISION': return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-500/20';
      case 'OBSOLETO': return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 bg-white text-sm shadow-[0_4px_10px_-10px_rgba(0,0,0,0.1)] z-10 gap-4 flex-shrink-0">
        <div className="flex items-center space-x-4 text-gray-600 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="font-medium bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-200 shadow-sm whitespace-nowrap">
            {filteredDocs.length} Documentos
          </span>
          <div className="flex items-center space-x-2 whitespace-nowrap">
            <span className="text-gray-400">Ordenar: </span>
            <span className="font-bold text-brand-primary cursor-pointer hover:underline">A-Z</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-500 cursor-pointer hover:text-brand-primary transition-colors">Popularidad</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex-grow md:flex-grow-0">
            <span className="text-gray-500 font-medium text-xs md:text-sm">Tipo:</span>
            <select 
              className="bg-transparent text-brand-primary font-bold focus:outline-none cursor-pointer w-full text-xs md:text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:block h-6 w-px bg-gray-200"></div>

          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 bg-white flex items-center text-gray-600 font-medium transition-all shadow-sm text-xs md:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5 text-brand-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
               CSV
            </button>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 bg-white flex items-center text-gray-600 font-medium transition-all shadow-sm text-xs md:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-1.5 text-brand-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
               ZIP
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 pb-24 lg:pb-6">
        {paginatedDocs.map((doc) => {
          const isSelected = doc.id === selectedDocId;
          const isFavorite = favorites.has(doc.id);
          
          return (
            <div 
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={`flex flex-col md:flex-row md:items-stretch bg-white rounded-xl shadow-sm cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 overflow-hidden border relative
                ${isSelected ? 'border-brand-primary ring-1 ring-brand-primary shadow-md' : 'border-gray-100 hover:border-brand-secondary hover:shadow-md'}
              `}
            >
              {/* Desktop Icon Area */}
              <div className={`hidden md:flex p-5 items-center justify-center border-r transition-colors ${isSelected ? 'bg-brand-primary text-brand-secondary border-brand-primary' : 'bg-gray-50/80 text-gray-400 border-gray-100 group-hover:bg-blue-50'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              
              <div className={`flex-1 p-4 md:p-5 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-6 items-start md:items-center transition-colors ${isSelected ? 'bg-blue-50/20' : ''}`}>
                <div className="md:col-span-6 w-full flex items-start">
                  {/* Favorite toggle mobile/desktop */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(doc.id); }}
                    className="mr-3 mt-0.5 text-gray-300 hover:text-brand-secondary focus:outline-none flex-shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={`w-5 h-5 ${isFavorite ? 'text-brand-secondary drop-shadow-sm' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </button>
                  <div className="w-full">
                    <div className="flex justify-between items-start w-full">
                      <h4 className="font-bold text-gray-900 uppercase tracking-tight text-[13px] leading-tight mb-1 flex-1 pr-2">{doc.title}</h4>
                      <span className={`md:hidden px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex-shrink-0 ${getStatusBadgeClass(doc.status)}`}>
                         {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1 md:mt-0">
                      <span className="font-medium">{doc.facility}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{doc.views} vistas</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-3 flex flex-row md:flex-col justify-between md:justify-center w-full md:w-auto items-center md:items-start border-t border-gray-100 md:border-t-0 pt-2 md:pt-0 ml-8 md:ml-0">
                  <span className="text-sm font-extrabold text-brand-primary tracking-wide">{doc.sku}</span>
                  <span className="text-xs text-gray-500 font-medium md:mt-1">{doc.type}</span>
                </div>
                
                <div className="hidden md:flex md:col-span-2 items-center justify-end w-full">
                   <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${getStatusBadgeClass(doc.status)}`}>
                     {doc.status}
                   </span>
                </div>
                
                <div className="hidden md:flex md:col-span-1 justify-end w-full">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300 bg-white text-transparent'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredDocs.length === 0 && (
          <div className="p-12 text-center flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <p className="text-gray-500 font-medium text-lg">No se encontraron documentos</p>
            <p className="text-gray-400 text-sm mt-1">Intenta con otros filtros o términos de búsqueda.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6 z-10 flex-shrink-0">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredDocs.length)}</span> de <span className="font-medium">{filteredDocs.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <span className="sr-only">Anterior</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-bold text-brand-primary">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <span className="sr-only">Siguiente</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
