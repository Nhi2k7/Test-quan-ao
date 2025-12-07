import React, { useRef } from 'react';
import { ImageState } from '../types';

interface ImageUploadProps {
  label: string;
  imageState: ImageState;
  onUpload: (file: File) => void;
  onClear: () => void;
  accept?: string;
  id: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  imageState, 
  onUpload, 
  onClear,
  accept = "image/*",
  id
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-slate-300 uppercase tracking-wide">{label}</label>
      
      {imageState.previewUrl ? (
        <div className="relative group w-full aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-xl">
          <img 
            src={imageState.previewUrl} 
            alt={label} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
              title="Change Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </button>
            <button 
              onClick={onClear}
              className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-colors"
              title="Remove Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="w-full aspect-[3/4] bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group"
        >
          <div className="p-4 rounded-full bg-slate-800 group-hover:scale-110 transition-transform mb-4">
             <svg className="w-8 h-8 text-slate-400 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium group-hover:text-slate-200">Upload Image</p>
          <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
        </div>
      )}
      
      <input 
        type="file" 
        id={id}
        ref={inputRef}
        className="hidden" 
        accept={accept} 
        onChange={handleFileChange} 
      />
    </div>
  );
};
