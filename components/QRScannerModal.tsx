import React, { useEffect, useRef, useState } from 'react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (sku: string) => void;
  mockSkus: string[];
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanResult, mockSkus }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setError('');
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer back camera
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulated QR Detection (since we don't have a real QR decoder library imported)
      // We simulate that after 3 seconds of scanning, it successfully reads a QR code.
      setTimeout(() => {
        if (streamRef.current?.active) {
           const randomSku = mockSkus[Math.floor(Math.random() * mockSkus.length)] || 'E-SEG-CRF-001';
           stopCamera();
           onScanResult(randomSku);
        }
      }, 3000);

    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-brand-primary text-white">
          <h3 className="font-extrabold uppercase tracking-widest text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2 text-brand-secondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
            </svg>
            Escanear Documento
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-brand-secondary p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="relative bg-black aspect-square w-full flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-400 font-bold bg-black/80">{error}</div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              {/* Overlay para escaneo */}
              <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none z-10 flex items-center justify-center">
                 <div className="w-full h-full border-2 border-brand-secondary relative">
                    {/* Línea animada de escaneo */}
                    {isScanning && (
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-secondary shadow-[0_0_8px_2px_#f1e434] animate-scan-line"></div>
                    )}
                 </div>
              </div>
              <p className="absolute bottom-6 left-0 right-0 text-center text-white text-xs font-bold z-20 drop-shadow-md">
                Apunta la cámara al código QR del documento
              </p>
            </>
          )}
        </div>
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-500 font-medium">
          *Simulación: Escaneará automáticamente un documento existente tras 3 segundos.
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-scan-line {
          animation: scanLine 2s linear infinite;
        }
      `}}/>
    </div>
  );
};
