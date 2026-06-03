import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Badge } from '../ui';
import { Camera, Volume2, BookmarkPlus, History } from 'lucide-react';

interface ObjectScannerProps {
  onObjectDetected?: (object: { name: string; translation: string; phonetic: string }) => void;
  onSaveToVocabulary?: (object: any) => void;
}

export const ObjectScanner: React.FC<ObjectScannerProps> = ({
  onObjectDetected,
  onSaveToVocabulary,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [detectedObject, setDetectedObject] = useState<{
    name: string;
    translation: string;
    phonetic: string;
    confidence: number;
  } | null>(null);
  const [scannedHistory, setScannedHistory] = useState<any[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setCameraError(null);
      }
    } catch (error) {
      setCameraError('No se pudo acceder a la cámara. Por favor, permite el acceso.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setIsActive(false);
    }
  };

  const simulateScan = () => {
    // Simulate object detection
    const objects = [
      { name: 'apple', translation: 'manzana', phonetic: '/ˈæpəl/' },
      { name: 'book', translation: 'libro', phonetic: '/bʊk/' },
      { name: 'chair', translation: 'silla', phonetic: '/tʃer/' },
      { name: 'water', translation: 'agua', phonetic: '/ˈwɔːtər/' },
      { name: 'phone', translation: 'teléfono', phonetic: '/foʊn/' },
      { name: 'computer', translation: 'computadora', phonetic: '/kəmˈpjuːtər/' },
      { name: 'door', translation: 'puerta', phonetic: '/dɔːr/' },
      { name: 'window', translation: 'ventana', phonetic: '/ˈwɪndoʊ/' },
    ];
    const randomObject = objects[Math.floor(Math.random() * objects.length)];
    setDetectedObject({
      ...randomObject,
      confidence: Math.floor(Math.random() * 20) + 80,
    });
    onObjectDetected?.(randomObject);
  };

  const saveToVocabulary = () => {
    if (detectedObject) {
      const newItem = {
        ...detectedObject,
        id: Date.now().toString(),
        scannedAt: new Date().toISOString(),
        savedToVocabulary: true,
      };
      setScannedHistory((prev) => [newItem, ...prev]);
      onSaveToVocabulary?.(newItem);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6 pb-20">
      {/* Camera View */}
      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border-4 border-white/10 bg-black shadow-2xl">
        {isActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/40 p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Camera size={40} className="opacity-50" />
            </div>
            <p className="text-lg font-medium leading-tight">Activa la cámara para reconocer objetos en tiempo real</p>
          </div>
        )}

        {/* Scanning Overlay (Retícula de Enfoque) */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 relative">
              {/* Esquinas iluminadas con gradiente */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FF5E36] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FF5E36] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5D26C1] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5D26C1] rounded-br-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5E36]/10 to-[#5D26C1]/10 animate-pulse rounded-2xl" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isActive ? (
          <Button onClick={startCamera} size="lg" className="w-full shadow-[0_10px_30px_rgba(255,94,54,0.3)]">
            <Camera size={20} className="mr-2" />
            INICIAR ESCÁNER
          </Button>
        ) : (
          <div className="flex gap-3 w-full">
            <Button onClick={simulateScan} size="lg" className="flex-1 shadow-[0_10px_30px_rgba(255,94,54,0.3)]">
              CAPTURAR
            </Button>
            <Button variant="ghost" onClick={stopCamera} size="lg" className="px-6 border border-white/10">
              CERRAR
            </Button>
          </div>
        )}
      </div>

      {/* Detected Object (Etiqueta Flotante) */}
      {detectedObject && (
        <div className="animate-slide-up">
          <Card className="bg-[#1A153D] border-2 border-[#FF5E36]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-3xl font-bold text-white capitalize" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {detectedObject.name}
                  </h3>
                  <button
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(detectedObject.name);
                      utterance.lang = 'en-US';
                      speechSynthesis.speak(utterance);
                    }}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Volume2 size={20} className="text-[#FF5E36]" />
                  </button>
                </div>
                <p className="text-xl text-white/50 font-medium">{detectedObject.translation}</p>
                <p className="text-sm text-[#FF5E36]/60 mt-1">{detectedObject.phonetic}</p>
              </div>
              <div className="text-right">
                <Badge variant="success" className="bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/20 mb-3">
                  {detectedObject.confidence}% MATCH
                </Badge>
                <Button size="sm" onClick={saveToVocabulary} className="w-full">
                  <BookmarkPlus size={16} className="mr-2" />
                  GUARDAR
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* History */}
      {scannedHistory.length > 0 && (
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <History size={20} />
            Historial de Escaneos
          </h4>
          <div className="space-y-2">
            {scannedHistory.map((item) => (
              <Card key={item.id} className="flex items-center justify-between py-3 bg-[#1A153D] border border-white/10">
                <div>
                  <p className="font-medium text-white capitalize">{item.name}</p>
                  <p className="text-sm text-white/40">{item.translation}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  const utterance = new SpeechSynthesisUtterance(item.name);
                  utterance.lang = 'en-US';
                  speechSynthesis.speak(utterance);
                }}>
                  <Volume2 size={16} />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default { ObjectScanner };