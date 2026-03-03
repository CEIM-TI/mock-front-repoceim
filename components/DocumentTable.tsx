import React, { useState } from 'react';
import { DocumentItem } from '../types';
import { FolderIcon, SparklesIcon } from './Icons';

interface DocumentTableProps {
  documents: DocumentItem[];
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const StatusBadge = ({ isYes }: { isYes: boolean }) => (
  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold text-white ${isYes ? 'bg-status-yes' : 'bg-status-no'}`}>
    {isYes ? 'Si' : 'No'}
  </span>
);

export const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onAnalyze, isAnalyzing }) => {
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set<string>());

  const toggleSelectAll = () => {
    if (selectedDocs.size === documents.length) {
      setSelectedDocs(new Set<string>());
    } else {
      setSelectedDocs(new Set<string>(documents.map(d => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set<string>(selectedDocs);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedDocs(newSet);
  };

  const getFolderColorClass = (color?: string) => {
    switch(color) {
      case 'green': return 'text-green-600';
      case 'red': return 'text-red-500';
      case 'yellow': default: return 'text-yellow-400';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar filters */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              Paquetes 2026
            </button>
            <button className="flex items-center px-3 py-1.5 bg-transparent text-gray-600 text-sm hover:text-gray-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
              Todos los documentos
            </button>
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex space-x-1">
            {/* Mock icons for file types */}
            <div className="w-6 h-6 bg-blue-100 rounded text-blue-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-blue-200">W</div>
            <div className="w-6 h-6 bg-green-100 rounded text-green-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-green-200">X</div>
            <div className="w-6 h-6 bg-orange-100 rounded text-orange-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-orange-200">P</div>
            <div className="w-6 h-6 bg-red-100 rounded text-red-600 flex items-center justify-center text-xs font-bold cursor-pointer hover:bg-red-200">A</div>
          </div>
        </div>
        
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isAnalyzing ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SparklesIcon />
          )}
          <span className="ml-2">Analizar con IA</span>
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="min-w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-12 text-center align-middle">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-sharepoint focus:ring-sharepoint"
                  checked={selectedDocs.size === documents.length && documents.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer w-72">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  Nombre
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  Modificado
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center">
                  Modificado p...
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Ppt</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center truncate">Cuaderno ins...</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center truncate">Cuaderno par...</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Actividades</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Evaluación</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Descriptor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.map((doc, idx) => {
              const isSelected = selectedDocs.has(doc.id);
              return (
                <tr 
                  key={doc.id} 
                  className={`hover:bg-gray-50 transition-colors group cursor-default ${isSelected ? 'bg-blue-50/50' : ''}`}
                  onClick={() => toggleSelect(doc.id)}
                >
                  <td className="px-4 py-3 text-center align-middle relative">
                    {/* Visual indicator for row selection, common in these list views */}
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sharepoint"></div>}
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-sharepoint focus:ring-sharepoint"
                      checked={isSelected}
                      onChange={() => {}} // Handled by tr onClick
                      onClick={(e) => e.stopPropagation()} // Prevent double toggle
                    />
                  </td>
                  <td className="px-4 py-3 flex items-center group-hover:text-sharepoint transition-colors">
                    <div className="mr-3">
                      <FolderIcon colorClass={getFolderColorClass(doc.color)} />
                    </div>
                    <span className="text-sm text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs">{doc.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {doc.modifiedDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center">
                       <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] mr-2">
                         {doc.modifiedBy.split(' ').map(n => n[0]).join('')}
                       </div>
                       {doc.modifiedBy}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge isYes={doc.status.ppt} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge isYes={doc.status.cuadernoInstructor} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge isYes={doc.status.cuadernoParticipante} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge isYes={doc.status.actividades} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge isYes={doc.status.evaluacion} /></td>
                  <td className="px-4 py-3 text-center"><StatusBadge isYes={doc.status.descriptor} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};