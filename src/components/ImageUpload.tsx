import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string, mimeType: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64 = result.split(',')[1];
      onImageSelect(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-white/50 backdrop-blur-sm"
          id="drop-zone"
        >
          <Upload className="w-10 h-10 mb-4 text-gray-400" />
          <p className="text-sm font-medium text-gray-600">Click or drag product image here</p>
          <p className="text-xs text-gray-400 mt-2 text-center">Support for PNG, JPG (Max 5MB)</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onSelect}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white p-2 shadow-sm">
          <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-xl" referrerPolicy="no-referrer" />
          <button
            onClick={clear}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur-md transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-gray-100 shadow-sm">
            <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-600">Source Product</span>
          </div>
        </div>
      )}
    </div>
  );
};
