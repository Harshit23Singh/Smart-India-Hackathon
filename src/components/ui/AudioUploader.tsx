"use client";

import { UploadCloud } from "lucide-react";
import { useState, useRef } from "react";
import StarBorder from "@/components/ui/StarBorder";

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
    <StarBorder
      as="div"
      className="w-full h-full"
      innerClassName="p-6 flex flex-col h-full bg-[#07070a]/95"
      color="#a855f7"
      speed="6s"
      thickness={1.5}
      backgroundColor="#07070a"
      borderColor="rgba(255, 255, 255, 0.08)"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <UploadCloud size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Upload Audio Sample</h3>
          <p className="text-xs text-white/50">Supports bulk scan & deep acoustic forensics</p>
        </div>
      </div>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.aac,.opus,.wma,.mpeg,.mpg,.mp4,.webm,.aiff,.aif,.caf,video/mpeg,video/mp4" 
        className="hidden" 
        disabled={disabled}
      />

      {/* Drop zone */}
      <div
        className={`mt-3 flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-200 
          ${disabled ? "opacity-50 cursor-not-allowed bg-black/40 border-white/5" : "cursor-pointer"}
          ${isDragging && !disabled 
            ? "border-purple-400 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.2)]" 
            : "border-white/10 bg-[#020204] hover:border-purple-500/50 hover:bg-white/[0.02]"}
        `}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        {/* Upload icon button */}
        <div className="h-16 w-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-transform hover:scale-105">
          <UploadCloud size={30} />
        </div>

        <p className="text-sm font-bold text-white mb-1">Drag & drop your audio file here</p>
        <p className="text-xs text-white/40">or click to browse from system</p>

        <div className="mt-5 rounded-xl bg-black/80 border border-white/10 px-5 py-2.5 flex flex-col items-center gap-0.5">
          <p className="text-[11px] font-mono text-purple-300">WAV • MP3 • MPEG • M4A • FLAC • OGG</p>
          <p className="text-[10px] text-white/40">Maximum upload size: 25 MB</p>
        </div>
      </div>
    </StarBorder>
  );
}
