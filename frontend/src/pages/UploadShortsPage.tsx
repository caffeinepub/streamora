import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useSaveVideo } from '../hooks/useQueries';
import { useAuth } from '../contexts/AuthContext';
import { generateId } from '../lib/store';
import { toast } from 'sonner';

export default function UploadShortsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const saveVideo = useSaveVideo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a video'); return; }
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    if (!session) return;

    setUploading(true);
    setProgress(0);
    try {
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(r => setTimeout(r, 80));
        setProgress(i);
      }
      const videoUrl = URL.createObjectURL(file);
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      saveVideo.mutate({
        id: generateId(),
        type: 'short',
        title: title.trim(),
        description: description.trim(),
        tags: tagList,
        videoUrl,
        uploaderUsername: session.secretUsername,
        uploaderName: session.name,
        views: 0,
        likes: 0,
        comments: [],
        isPromoted: true,
        createdAt: Date.now(),
      });
      toast.success('Short published!');
      navigate({ to: '/shorts' });
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
          <h1 className="text-xl font-bold text-foreground">Upload Short</h1>
          <p className="text-xs text-muted-foreground">Quick vertical video</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File picker */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            file ? 'border-brand/50 bg-brand/5' : 'border-border hover:border-brand/50 hover:bg-surface-2'
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
            <div className="space-y-2">
              <Zap className="w-8 h-8 text-brand mx-auto" />
              <p className="font-medium text-foreground text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setFile(null); }}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 mx-auto"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Zap className="w-8 h-8 text-muted-foreground mx-auto" />
              <p className="font-medium text-foreground">Select your short video</p>
              <p className="text-xs text-muted-foreground">Vertical format recommended · Max 60s</p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter short title"
            className="bg-surface-2 border-border focus:border-brand"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your short..."
            rows={3}
            className="bg-surface-2 border-border focus:border-brand resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            className="bg-surface-2 border-border focus:border-brand"
          />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="text-foreground font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/upload' })}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={uploading || !file}
            className="flex-1 bg-brand hover:bg-brand-bright text-white"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading {progress}%
              </span>
            ) : 'Upload Short'}
          </Button>
        </div>
      </form>
    </div>
  );
}
