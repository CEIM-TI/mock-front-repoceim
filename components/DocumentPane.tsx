import React, { useState, useRef } from 'react';
import { DocumentItem, User } from '../types';
import { uploadDocumentVersion, downloadDocument } from '../services/sharepointService';
import { SharePointIcon } from './Icons';

interface DocumentPaneProps {
  document: DocumentItem;
  allDocuments: DocumentItem[];
  onClose: () => void;
  currentUser: User;
  onVersionUploaded: (docId: string, newDoc: DocumentItem) => void;
  onSelectRelated: (doc: DocumentItem) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const DocumentPane: React.FC<DocumentPaneProps> = ({ document, allDocuments, onClose, currentUser, onVersionUploaded, onSelectRelated, isFavorite, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'versions'>('details');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDesc, setUploadDesc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newVersion = await uploadDocumentVersion(
        document.id,
        file,
        currentUser,
        uploadDesc,
        document.versions
      );
      
      const updatedDoc = {
        ...document,
        versions: [newVersion, ...document.versions],
        reviewerDate: new Date().toISOString().split('T')[0]
      };
      
      onVersionUploaded(document.id, updatedDoc);
      setUploadDesc('');
      if(fileInputRef.current) fileInputRef.current.value = '';
      
      setActiveTab('versions');
    } catch (error) {
      alert("Error al subir versión");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (version: any) => {
    downloadDocument(version, document.title);
  };

  const currentVersion = document.versions[0] || { versionNumber: '1.0' };

  const relatedDocs = allDocuments.filter(d => 
    d.id !== document.id && 
    (d.facility === document.facility || d.discipline === document.discipline)
  ).slice(0, 3);

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'PUBLICADO': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20';
      case 'EN REVISION': return 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-1 ring-yellow-500/20';
      case 'OBSOLETO': return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-500/20';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 ring-1 ring-gray-500/20';
    }
  };

  return (
    <div className="fixed inset-0 lg:relative w-full lg:w-[550px] bg-white shadow-[0_0_40px_-10px_rgba(0,0,0,0.15)] flex flex-col h-full flex-shrink-0 animate-slide-in-right z-50 lg:z-30 border-l border-gray-200">
      {/* Quick Actions Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center space-x-2">
           <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${getStatusBadgeClass(document.status)}`}>
             {document.status}
           </span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={onToggleFavorite}
            className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-brand-secondary bg-gray-100' : 'text-gray-400 hover:text-brand-secondary hover:bg-gray-100'}`} 
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </button>
          <button className="hidden sm:block p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors" title="Compartir">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </button>
          <button onClick={() => handleDownload(currentVersion)} className="hidden sm:block p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors" title="Descargar actual">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
          <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" title="Cerrar panel">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="px-6 sm:px-8 pt-6 pb-2 border-b border-gray-200 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] z-10">
        <div className="flex flex-wrap items-center gap-2 sm:space-x-3 mb-4">
           <span className="font-mono bg-blue-50 text-brand-primary px-3 py-1 rounded-lg font-bold border border-blue-100 text-sm shadow-sm">
             SKU: {document.sku}
           </span>
           <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{document.type}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-primary uppercase leading-tight mb-6 tracking-tight">
          {document.title}
        </h2>
        
        {/* Modern Tabs */}
        <div className="flex space-x-6 sm:space-x-8 overflow-x-auto hide-scrollbar">
          <button 
            className={`pb-3 px-1 font-bold text-sm relative transition-colors whitespace-nowrap ${activeTab === 'details' ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-700'}`}
            onClick={() => setActiveTab('details')}
          >
            Detalles Generales
            {activeTab === 'details' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand-secondary rounded-t"></div>}
          </button>
          <button 
            className={`pb-3 px-1 font-bold text-sm relative flex items-center transition-colors whitespace-nowrap ${activeTab === 'versions' ? 'text-brand-primary' : 'text-gray-400 hover:text-gray-700'}`}
            onClick={() => setActiveTab('versions')}
          >
            Historial de Versiones 
            <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-black ${activeTab === 'versions' ? 'bg-brand-secondary text-brand-primary' : 'bg-gray-100 text-gray-500'}`}>{document.versions.length}</span>
            {activeTab === 'versions' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-brand-secondary rounded-t"></div>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        {activeTab === 'details' && (
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 animate-fade-in-up">
            
            {/* Meta Info Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 grid grid-cols-2 gap-y-6 gap-x-4 sm:gap-x-8 text-sm">
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Propietario</p>
                <p className="font-semibold text-gray-900 truncate">{document.owner}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Versión Actual</p>
                <p className="font-semibold text-brand-primary flex items-center bg-blue-50/50 w-fit px-2 py-0.5 rounded">
                  v{currentVersion.versionNumber} 
                  <span className="ml-2 w-2 h-2 rounded-full bg-brand-secondary"></span>
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Instalación</p>
                <p className="font-semibold text-gray-900">{document.facility}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Función</p>
                <p className="font-semibold text-gray-900">{document.functionArea}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Disciplina</p>
                <p className="font-semibold text-gray-900 truncate">{document.discipline}</p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Categoría</p>
                <p className="font-semibold text-gray-900">{document.category}</p>
              </div>
              <div className="col-span-2 border-t border-gray-100 pt-4 mt-2 flex justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fecha Creación</p>
                  <p className="font-semibold text-gray-900">{document.completionDate}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Próx. Revisión</p>
                  <p className={`font-bold ${new Date(document.reviewerDate) < new Date() ? 'text-red-600 bg-red-50 px-2 rounded' : 'text-gray-900'}`}>{document.reviewerDate}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Visitas</p>
                  <p className="font-semibold text-gray-900">{document.views}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => handleDownload(currentVersion)}
                className="w-full sm:flex-1 bg-brand-primary text-white py-4 px-6 font-bold rounded-xl flex justify-between items-center hover:bg-blue-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
              >
                <span>Ver Documento</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-brand-secondary group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
              <button className="w-full sm:w-auto bg-white border border-gray-200 text-sharepoint p-4 hover:bg-blue-50 transition-colors flex items-center justify-center rounded-xl shadow-sm hover:border-sharepoint group" title="Abrir en SharePoint">
                <span className="sm:hidden font-bold mr-2 text-gray-700">Ver en SharePoint</span>
                <div className="transform group-hover:scale-110 transition-transform"><SharePointIcon /></div>
              </button>
            </div>

            {/* Related Documents Section */}
            {relatedDocs.length > 0 && (
              <div className="pt-4">
                <h3 className="text-sm font-extrabold text-brand-primary uppercase tracking-widest mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 text-brand-secondary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  Documentos Relacionados
                </h3>
                <div className="space-y-3">
                  {relatedDocs.map(relDoc => (
                    <div 
                      key={relDoc.id} 
                      onClick={() => onSelectRelated(relDoc)}
                      className="p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-brand-primary hover:shadow-md transition-all flex justify-between items-center group transform hover:-translate-y-0.5"
                    >
                      <div className="overflow-hidden pr-4">
                        <p className="text-[10px] sm:text-[11px] font-extrabold text-brand-primary tracking-wider uppercase mb-1">{relDoc.sku}</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate group-hover:text-brand-primary transition-colors">{relDoc.title}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-brand-primary">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 animate-fade-in-up">
            
            {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
              <div className="bg-white p-5 sm:p-6 border border-gray-200 rounded-2xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sharepoint/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                
                <h3 className="text-sm font-extrabold text-brand-primary uppercase tracking-widest flex items-center mb-5">
                  <SharePointIcon /> <span className="ml-2 mt-0.5">Subir Nueva Versión</span>
                </h3>
                <div className="space-y-4 relative z-10">
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase ml-1">Descripción de cambios</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Actualización según normativa Q3..."
                      className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:bg-white transition-all"
                      value={uploadDesc}
                      onChange={(e) => setUploadDesc(e.target.value)}
                      disabled={isUploading}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase ml-1">Archivo Documento</label>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 sm:file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-primary file:text-white hover:file:bg-blue-900 file:cursor-pointer file:transition-colors bg-gray-50 border border-gray-200 rounded-xl cursor-pointer"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </div>
                  {isUploading && (
                    <div className="flex items-center text-sm font-bold text-sharepoint animate-pulse mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sincronizando con SharePoint...
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="relative pb-6 mt-8">
              {/* Línea vertical de la línea de tiempo */}
              <div className="absolute left-[19px] top-6 bottom-0 w-[2px] bg-gray-200"></div>

              <div className="space-y-8">
                {document.versions.map((ver, idx) => {
                  const isCurrent = idx === 0;
                  return (
                    <div key={idx} className="relative pl-12 sm:pl-14">
                      {/* Timeline Node Mejorado */}
                      <div className={`absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm z-10 transition-colors duration-300
                        ${isCurrent ? 'bg-brand-secondary border-brand-primary text-brand-primary' : 'bg-white border-gray-200 text-gray-400'}`}
                      >
                        {isCurrent ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16Zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5Z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="font-bold text-xs">{ver.versionNumber.split('.')[0]}</span>
                        )}
                      </div>
                      
                      {/* Tarjeta de Versión Destacada */}
                      <div className={`rounded-2xl border transition-all duration-300 relative overflow-hidden group
                        ${isCurrent 
                          ? 'bg-gradient-to-r from-blue-50/80 to-white border-brand-primary shadow-lg ring-1 ring-brand-primary/20 transform hover:-translate-y-1' 
                          : 'bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute top-0 right-0">
                            <div className="bg-brand-secondary text-brand-primary text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm border-b border-l border-brand-secondary/50 flex items-center">
                              Versión Actual
                            </div>
                          </div>
                        )}
                        
                        {/* Acento lateral grueso para versión actual */}
                        {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary"></div>}

                        <div className={`p-5 sm:p-6 ${isCurrent ? 'pl-6 sm:pl-7' : ''} flex flex-col sm:flex-row justify-between items-start gap-4`}>
                          <div className={`w-full ${isCurrent ? 'mt-2 sm:mt-0' : ''}`}>
                            <h4 className={`font-extrabold flex items-center tracking-tight ${isCurrent ? 'text-xl text-brand-primary' : 'text-lg text-gray-800'}`}>
                              v{ver.versionNumber}
                            </h4>
                            <div className="flex flex-wrap items-center text-xs mt-2 font-medium bg-gray-50/80 p-2 rounded-lg border border-gray-100 w-fit gap-2">
                              <div className="flex items-center">
                                <div className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[9px] font-bold mr-2">
                                  {ver.modifiedBy.charAt(0)}
                                </div>
                                <span className="text-brand-primary font-bold">{ver.modifiedBy}</span>
                              </div>
                              <span className="text-gray-300 hidden sm:inline">•</span>
                              <span className="text-gray-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mr-1">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                {ver.date}
                              </span>
                            </div>
                            <p className={`text-sm mt-3 leading-relaxed ${isCurrent ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                              {ver.changes}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDownload(ver)}
                            className={`p-3 rounded-xl transition-all shadow-sm flex items-center justify-center flex-shrink-0 w-full sm:w-auto
                              ${isCurrent ? 'bg-brand-primary text-brand-secondary hover:bg-blue-900 shadow-md' : 'bg-gray-50 text-brand-primary border border-gray-200 hover:bg-blue-50 hover:border-blue-200'}
                            `}
                            title={`Descargar v${ver.versionNumber}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <span className="ml-2 font-bold text-sm sm:hidden">Descargar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-right { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
