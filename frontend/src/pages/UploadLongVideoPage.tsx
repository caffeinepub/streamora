import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Upload, Film, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function UploadLongVideoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    setFile(f);
    setUploadedUrl(null);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(r => setTimeout(r, 100));
        setProgress(i);
      }
      // Store a reference URL (in production this would be a real Supabase URL)
      const fakeUrl = URL.createObjectURL(file);
      setUploadedUrl(fakeUrl);
      sessionStorage.setItem('streamora_upload_video_url', fakeUrl);
      sessionStorage.setItem('streamora_upload_video_name', file.name);
      toast.success('Video uploaded! Now add details.');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate({ to: '/upload' })} className="text-muted-foreground hover:text-foreground text-lg">
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Upload Long Video</h1>
          <p className="text-xs text-muted-foreground">Step 1 of 2 — Upload your video</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging ? 'border-brand bg-brand/10' :
          file ? 'border-brand/50 bg-brand/5' :
          'border-border hover:border-brand/50 hover:bg-surface-2'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-xl bg-brand/10 flex items-center justify-center mx-auto">
              <Film className="w-8 h-8 text-brand" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setFile(null); setProgress(0); setUploadedUrl(null); }}
              className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 mx-auto"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-xl bg-surface-2 flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drag &amp; drop your video here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse files</p>
            </div>
            <p className="text-xs text-muted-foreground">MP4, MOV, AVI, MKV up to 4GB</p>
          </div>
        )}
      </div>

      {/* Progress */}
      {(uploading || (progress > 0 && progress < 100)) && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {uploadedUrl && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Video ready! Click Next to add details.
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/upload' })}
          className="flex-1"
        >
          Cancel
        </Button>
        {!uploadedUrl ? (
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 bg-brand hover:bg-brand-bright text-white"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : 'Upload'}
          </Button>
        ) : (
          <Button
            onClick={() => navigate({ to: '/upload/long-video/metadata' })}
            className="flex-1 bg-brand hover:bg-brand-bright text-white"
          >
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
