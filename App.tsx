import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AreaGrid } from './components/AreaGrid';
import { DocumentList } from './components/DocumentList';
import { DocumentPane } from './components/DocumentPane';
import { Login } from './components/Login';
import { QRScannerModal } from './components/QRScannerModal';
import { UploadModal } from './components/UploadModal';
import { User, Gerencia, DocumentItem } from './types';
import { MOCK_DATA } from './constants';
import { getCurrentUser } from './services/authService';
import { analyzeRepositoryStatus } from './services/geminiService';
import { SparklesIcon } from './components/Icons';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gerenciasData, setGerenciasData] = useState<Gerencia[]>(MOCK_DATA);
  const [navPath, setNavPath] = useState<{ gerenciaId?: string, areaId?: string }>({});
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // New features state
  const [favorites, setFavorites] = useState<Set<string>>(new Set<string>());
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [specialView, setSpecialView] = useState<'favorites' | 'popular' | 'recent' | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrentUser(user);
    
    // Load persisted local data
    try {
      const favs = localStorage.getItem('gestor_favorites');
      if (favs) setFavorites(new Set<string>(JSON.parse(favs) as string[]));
      const recent = localStorage.getItem('gestor_recent');
      if (recent) setRecentlyViewed(JSON.parse(recent) as string[]);
    } catch (e) {}
  }, []);

  const saveFavorites = (newFavs: Set<string>) => {
    setFavorites(newFavs);
    localStorage.setItem('gestor_favorites', JSON.stringify(Array.from(newFavs)));
  };

  const saveRecent = (docId: string) => {
    setRecentlyViewed(prev => {
      const newRecent = [docId, ...prev.filter(id => id !== docId)].slice(0, 20);
      localStorage.setItem('gestor_recent', JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const toggleFavorite = (docId: string) => {
    const newFavs = new Set<string>(favorites);
    if (newFavs.has(docId)) {
      newFavs.delete(docId);
    } else {
      newFavs.add(docId);
    }
    saveFavorites(newFavs);
  };

  const allDocuments = useMemo(() => {
    return gerenciasData.flatMap(g => g.areas.flatMap(a => a.documents));
  }, [gerenciasData]);

  const handleDocumentUpdate = (docId: string, updatedDoc: DocumentItem) => {
    setGerenciasData(prev => prev.map(gerencia => ({
      ...gerencia,
      areas: gerencia.areas.map(area => ({
        ...area,
        documents: area.documents.map(doc => doc.id === docId ? updatedDoc : doc)
      }))
    })));
  };

  const handleUploadNewDocument = (data: { title: string, type: string, gerenciaId: string, areaId: string, file: File }) => {
    const newDocId = `d-new-${Date.now()}`;
    const newSku = `E-NEW-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newDoc: DocumentItem = {
      id: newDocId,
      sku: newSku,
      title: data.title,
      type: data.type,
      facility: 'General',
      functionArea: 'General',
      discipline: 'General',
      category: 'General',
      criticality: 'Media',
      owner: currentUser?.name || 'Sistema',
      status: 'EN REVISION',
      completionDate: today,
      reviewerDate: today,
      views: 0,
      versions: [
        {
          versionNumber: '1.0',
          date: today,
          modifiedBy: currentUser?.name || 'Sistema',
          changes: `Creación inicial a partir de archivo: ${data.file.name}`,
          fileUrl: URL.createObjectURL(data.file)
        }
      ]
    };

    setGerenciasData(prev => prev.map(g => {
      if (g.id === data.gerenciaId) {
        return {
          ...g,
          areas: g.areas.map(a => {
            if (a.id === data.areaId) {
              return { ...a, documents: [newDoc, ...a.documents] };
            }
            return a;
          })
        };
      }
      return g;
    }));

    setIsUploadOpen(false);
    
    // Auto navigate to show it
    setSpecialView(null);
    setSearchQuery('');
    setNavPath({ gerenciaId: data.gerenciaId, areaId: data.areaId });
    handleSelectRelated(newDoc); // open it
  };

  const handleAnalyze = useCallback(async (documentsToAnalyze: DocumentItem[]) => {
    setIsAnalyzing(true);
    setAiReport(null);
    try {
      const report = await analyzeRepositoryStatus(documentsToAnalyze);
      setAiReport(report);
    } catch (error) {
      console.error("Failed to generate report", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  if (!currentUser) {
    return <Login onLoginSuccess={setCurrentUser} />;
  }

  let viewMode: 'gerencias' | 'areas' | 'documents' = 'gerencias';
  let docsToDisplay: DocumentItem[] = [];
  let viewTitle = 'Seleccionar Gerencia';
  const breadcrumbs: {id: string, name: string}[] = [];
  
  const currentGerencia = gerenciasData.find(g => g.id === navPath.gerenciaId);
  const currentArea = currentGerencia?.areas.find(a => a.id === navPath.areaId);

  const isSearching = searchQuery.trim().length > 1;

  if (isSearching) {
    viewMode = 'documents';
    const q = searchQuery.toLowerCase();
    docsToDisplay = allDocuments.filter(d => 
      d.title.toLowerCase().includes(q) ||
      d.sku.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
    );
    viewTitle = 'Búsqueda Global';
    breadcrumbs.push({ id: 'search', name: `Resultados para "${searchQuery}"` });
  } else if (specialView) {
    viewMode = 'documents';
    if (specialView === 'favorites') {
      docsToDisplay = allDocuments.filter(d => favorites.has(d.id));
      viewTitle = 'Mis Favoritos';
    } else if (specialView === 'popular') {
      docsToDisplay = [...allDocuments].sort((a,b) => b.views - a.views).slice(0, 15);
      viewTitle = 'Documentos Populares';
    } else if (specialView === 'recent') {
      // Keep order of recently viewed
      docsToDisplay = recentlyViewed.map(id => allDocuments.find(d => d.id === id)).filter(Boolean) as DocumentItem[];
      viewTitle = 'Vistos Recientemente';
    }
    breadcrumbs.push({ id: 'special', name: viewTitle });
  } else {
    if (currentArea) {
      viewMode = 'documents';
      docsToDisplay = currentArea.documents;
      viewTitle = currentArea.name;
    } else if (currentGerencia) {
      viewMode = 'areas';
      viewTitle = currentGerencia.name;
    }
    
    if (currentGerencia) breadcrumbs.push({ id: currentGerencia.id, name: currentGerencia.name.split(' (')[0] });
    if (currentArea) breadcrumbs.push({ id: currentArea.id, name: currentArea.name });
  }

  const selectedDoc = allDocuments.find(d => d.id === selectedDocId);

  const handleNavigate = (index: number) => {
    setSearchQuery(''); 
    setSpecialView(null);
    if (index === -1) {
      setNavPath({});
    } else if (index === 0 && currentGerencia) {
      setNavPath({ gerenciaId: currentGerencia.id });
    }
    setSelectedDocId(undefined);
    setAiReport(null);
  };

  const handleSidebarAction = (action: string) => {
    if (action === 'scan') {
      setIsScannerOpen(true);
    } else if (['favorites', 'popular', 'recent'].includes(action)) {
      setSearchQuery('');
      setNavPath({});
      setSelectedDocId(undefined);
      setSpecialView(action as any);
    } else if (action === 'home') {
      setSearchQuery('');
      setSpecialView(null);
      setNavPath({});
      setSelectedDocId(undefined);
    }
  };

  const handleSelectRelated = (doc: DocumentItem) => {
    setSelectedDocId(doc.id);
    saveRecent(doc.id);
  };

  const handleScanResult = (sku: string) => {
    setIsScannerOpen(false);
    setSpecialView(null);
    setSearchQuery(sku);
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 animate-fade-in relative">
      <Sidebar 
        currentUser={currentUser} 
        onLogout={() => setCurrentUser(null)} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAction={handleSidebarAction}
        activeSpecialView={specialView}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <TopBar 
          breadcrumbs={breadcrumbs} 
          onNavigate={handleNavigate} 
          title={viewTitle}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.length > 1) {
              setSelectedDocId(undefined);
              setSpecialView(null);
            }
          }}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onUploadClick={() => setIsUploadOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden flex relative bg-gray-50/50">
          
          <div className="flex-1 overflow-hidden relative flex flex-col animate-fade-in-up">
            {viewMode === 'gerencias' && (
              <AreaGrid 
                items={gerenciasData.map(g => ({ id: g.id, name: g.name, count: g.areas.length, isDisabled: !g.isActive }))}
                onItemClick={(id) => setNavPath({ gerenciaId: id })}
                type="gerencia"
              />
            )}
            
            {viewMode === 'areas' && currentGerencia && (
              <AreaGrid 
                items={currentGerencia.areas.map(a => ({ id: a.id, name: a.name, count: a.documents.length }))}
                onItemClick={(id) => setNavPath({ ...navPath, areaId: id })}
                type="area"
              />
            )}
            
            {viewMode === 'documents' && (
              <div className="h-full relative flex flex-col animate-fade-in-up">
                 <DocumentList 
                   documents={docsToDisplay}
                   onSelectDocument={handleSelectRelated}
                   selectedDocId={selectedDocId}
                   favorites={favorites}
                   onToggleFavorite={toggleFavorite}
                 />
                 
                 {(!isSearching && !specialView && currentArea) && (
                   <button 
                      onClick={() => handleAnalyze(docsToDisplay)}
                      disabled={isAnalyzing || docsToDisplay.length === 0}
                      className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center px-5 py-3 sm:px-6 sm:py-4 bg-brand-primary text-brand-secondary rounded-2xl shadow-[0_8px_30px_rgb(4,30,66,0.3)] hover:shadow-[0_8px_30px_rgb(4,30,66,0.5)] hover:-translate-y-1 transition-all duration-300 z-10 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isAnalyzing ? (
                        <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <div className="mr-2"><SparklesIcon /></div>
                      )}
                      <span className="font-extrabold uppercase tracking-widest text-xs sm:text-sm">Auditar con IA</span>
                    </button>
                 )}
              </div>
            )}
          </div>

          {selectedDoc && (
             <DocumentPane 
               document={selectedDoc}
               allDocuments={allDocuments}
               currentUser={currentUser}
               onClose={() => setSelectedDocId(undefined)} 
               onVersionUploaded={handleDocumentUpdate}
               onSelectRelated={handleSelectRelated}
               isFavorite={favorites.has(selectedDoc.id)}
               onToggleFavorite={() => toggleFavorite(selectedDoc.id)}
             />
          )}

        </div>

        {aiReport && (
          <div className="absolute bottom-20 right-4 sm:bottom-24 sm:right-8 w-[calc(100%-2rem)] sm:w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden z-[60] animate-slide-up-fade mx-auto sm:mx-0">
            <div className="bg-brand-primary text-white px-5 py-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center font-extrabold text-brand-secondary uppercase tracking-widest text-xs sm:text-sm">
                <SparklesIcon />
                <span className="ml-2 text-white">Auditoría IA Gestor Doc</span>
              </div>
              <button 
                onClick={() => setAiReport(null)}
                className="text-gray-400 hover:text-brand-secondary hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 sm:p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-[50vh] sm:max-h-[60vh] overflow-y-auto bg-gray-50/50">
              {aiReport}
            </div>
          </div>
        )}
      </main>

      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScanResult={handleScanResult}
        mockSkus={allDocuments.map(d => d.sku)}
      />

      <UploadModal 
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        gerencias={gerenciasData}
        onUpload={handleUploadNewDocument}
      />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 20px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translate3d(0, 40px, 0) scale(0.95); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-fade { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}