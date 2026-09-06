"use client";

import { UploadCloud } from "lucide-react";
import { useState, useRef } from "react";

interface AudioUploaderProps {
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}

export default function AudioUploader({ onFileSelect, disabled }: AudioUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input so the same file can be selected again if needed
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="skeuo-card p-6 flex flex-col h-full relative overflow-hidden">
      {/* Top highlight line */}
      <div className="absolute top-0 left-4 right-4 h-px bg-white/10 rounded-full"></div>

      <div className="flex items-center gap-3 mb-4">
        <div className="skeuo-inset p-2 rounded-lg text-foreground/70">
          <UploadCloud size={24} />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Upload Audio File</h3>
      </div>

      <p className="text-sm text-foreground/60 mb-4">Drag and drop an audio file here, or click to browse</p>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="audio/*" 
        className="hidden" 
        disabled={disabled}
      />

      {/* Drop zone — sunken inset panel */}
      <div
        className={`skeuo-inset flex-1 rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-200 
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${isDragging && !disabled ? "ring-2 ring-accent ring-inset" : ""}
        `}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {/* Upload icon button */}
        <div className="h-20 w-20 rounded-full skeuo-button flex items-center justify-center mb-5 text-accent">
          <UploadCloud size={36} />
        </div>

        <p className="text-base font-semibold text-foreground mb-1">Drop audio file here</p>
        <p className="text-sm text-foreground/50">or click to browse</p>

        <div className="mt-6 skeuo-inset rounded-lg px-6 py-3 flex flex-col items-center gap-1">
          <p className="text-xs text-foreground/50">Supports MP3 • WAV • M4A • FLAC</p>
          <p className="text-xs text-foreground/40">Maximum size: 25 MB</p>
        </div>
      </div>
    </div>
  );
}
