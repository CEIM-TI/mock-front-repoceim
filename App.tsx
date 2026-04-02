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

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gerenciasData, setGerenciasData] = useState<Gerencia[]>(MOCK_DATA);
  const [navPath, setNavPath] = useState<{ gerenciaId?: string, areaId?: string }>({});
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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