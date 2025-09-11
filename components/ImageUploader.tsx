
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  onClearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, previewUrl, onClearImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  if (previewUrl) {
    return (
      <div className="text-center">
        <p className="text-slate-300 mb-4">Your bug screenshot:</p>
        <div className="relative group w-full max-w-lg mx-auto">
          <img src={previewUrl} alt="Bug screenshot preview" className="rounded-lg shadow-lg w-full object-contain" />
          <button
            onClick={onClearImage}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
            aria-label="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed ${isDragging ? 'border-green-400 bg-slate-700/50' : 'border-slate-600'} rounded-xl p-8 text-center cursor-pointer transition-all duration-300`}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
        <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
        <span className="font-semibold text-slate-200">Click to upload or drag & drop</span>
        <span className="text-sm text-slate-500 mt-1">PNG, JPG, GIF, or WEBP</span>
      </label>
    </div>
  );
};

export default ImageUploader;
