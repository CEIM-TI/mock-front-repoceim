import React, { useState } from 'react';
import { Gerencia } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  gerencias: Gerencia[];
  onUpload: (data: { title: string, type: string, gerenciaId: string, areaId: string, file: File }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, gerencias, onUpload }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Procedimiento Específico');
  const [gerenciaId, setGerenciaId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const activeGerencias = gerencias.filter(g => g.isActive);
  const selectedGerencia = activeGerencias.find(g => g.id === gerenciaId);
  const areas = selectedGerencia?.areas || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !gerenciaId || !areaId || !file) return;
    
    onUpload({ title, type, gerenciaId, areaId, file });
    
    // Reset form
    setTitle('');
    setGerenciaId('');
    setAreaId('');
    setFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-brand-primary text-white">
          <h3 className="font-extrabold uppercase tracking-widest text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-brand-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            Subir Nuevo Documento
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-brand-secondary p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 bg-gray-50/50">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Título del Documento</label>
            <input 
              type="text" 
              required
              placeholder="Ej. Manual de Operaciones Seguras"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-primary transition-all shadow-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tipo de Documento</label>
              <select 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-primary transition-all shadow-sm cursor-pointer"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Procedimiento Específico</option>
                <option>Estándar</option>
                <option>Manual</option>
                <option>Instructivo</option>
                <option>Formulario</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gerencia</label>
              <select 
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-primary transition-all shadow-sm cursor-pointer"
                value={gerenciaId}
                onChange={(e) => {
                  setGerenciaId(e.target.value);
                  setAreaId(''); // Reset area when gerencia changes
                }}
              >
                <option value="" disabled>Seleccione...</option>
                {activeGerencias.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Área / Departamento</label>
            <select 
              required
              disabled={!gerenciaId}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-primary transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:bg-gray-100"
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
            >
              <option value="" disabled>Seleccione...</option>
              {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Archivo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 bg-white flex flex-col items-center justify-center relative hover:border-brand-primary hover:bg-blue-50/50 transition-all cursor-pointer">
               <input 
                 type="file" 
                 required
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
               />
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-brand-primary mb-2">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
               </svg>
               <span className="text-sm font-bold text-brand-primary">
                 {file ? file.name : 'Haz clic o arrastra un archivo aquí'}
               </span>
               {!file && <span className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX (Máx 50MB)</span>}
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
             <button 
               type="button" 
               onClick={onClose}
               className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
             >
               Cancelar
             </button>
             <button 
               type="submit"
               className="px-6 py-2.5 rounded-xl font-extrabold bg-brand-primary text-brand-secondary shadow-md hover:bg-blue-900 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
             >
               Subir Documento
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
