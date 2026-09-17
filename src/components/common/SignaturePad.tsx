import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Check, Upload } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  initialSignature?: string;
  onSave: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  initialSignature,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(Boolean(initialSignature));
  const [currentImg, setCurrentImg] = useState<string | undefined>(initialSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a'; // Navy Blue ink
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setCurrentImg(dataUrl);
      onSave(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setCurrentImg(undefined);
    onSave('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCurrentImg(result);
        setHasSignature(true);
        onSave(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">{label}</span>
        <div className="flex items-center space-x-2">
          <label className="cursor-pointer text-xs flex items-center text-blue-600 hover:text-blue-800">
            <Upload className="w-3.5 h-3.5 mr-1" />
            Upload File
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs flex items-center text-rose-600 hover:text-rose-800"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Hapus
          </button>
        </div>
      </div>

      {currentImg ? (
        <div className="relative border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50 flex flex-col items-center justify-center">
          <img src={currentImg} alt="Tanda Tangan" className="h-24 max-w-full object-contain" />
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center">
            <Check className="w-3.5 h-3.5 mr-1" /> Tanda Tangan Tersimpan
          </p>
        </div>
      ) : (
        <div className="border border-dashed border-slate-300 rounded-lg bg-slate-50 flex flex-col items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={320}
            height={120}
            className="w-full h-28 cursor-crosshair touch-none bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <span className="text-[11px] text-slate-400 py-1">Goreskan tanda tangan di atas garis</span>
        </div>
      )}
    </div>
  );
};
