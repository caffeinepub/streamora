import React, { useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Image, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSaveVideo } from '../hooks/useQueries';
import { useAuth } from '../contexts/AuthContext';
import { generateId } from '../lib/store';
import { toast } from 'sonner';

export default function LongVideoMetadataPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const saveVideo = useSaveVideo();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const videoUrl = sessionStorage.getItem('streamora_upload_video_url') || '';
  const videoName = sessionStorage.getItem('streamora_upload_video_name') || '';

  const [title, setTitle] = useState(videoName.replace(/\.[^.]+$/, '') || '');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleThumbnail = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    const url = URL.createObjectURL(f);
    setThumbnailPreview(url);
    setThumbnailUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!session) return;
    setSubmitting(true);
    try {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      saveVideo.mutate({
        id: generateId(),
        type: 'long',
        title: title.trim(),
        description: description.trim(),
        tags: tagList,
        thumbnailUrl: thumbnailUrl || undefined,
        videoUrl: videoUrl || undefined,
        uploaderUsername: session.secretUsername,
        uploaderName: session.name,
        views: 0,
        likes: 0,
        comments: [],
        isPromoted: false,
        createdAt: Date.now(),
      });
      sessionStorage.removeItem('streamora_upload_video_url');
      sessionStorage.removeItem('streamora_upload_video_name');
      toast.success('Video published successfully!');
      navigate({ to: '/profile' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate({ to: '/upload/long-video' })} className="text-muted-foreground hover:text-foreground text-lg">
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Video Details</h1>
          <p className="text-xs text-muted-foreground">Step 2 of 2 — Add metadata</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter video title"
            className="bg-surface-2 border-border focus:border-brand"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your video..."
            rows={4}
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
          <p className="text-xs text-muted-foreground">Separate tags with commas</p>
        </div>

        {/* Thumbnail */}
        <div className="space-y-1.5">
          <Label>Thumbnail (Optional)</Label>
          <div
            onClick={() => thumbnailInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-brand/50 transition-colors"
          >
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleThumbnail(e.target.files[0])}
            />
            {thumbnailPreview ? (
              <div className="relative">
                <img src={thumbnailPreview} alt="Thumbnail" className="w-full aspect-video object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setThumbnailUrl(''); setThumbnailPreview(''); }}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <Image className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP</p>
              </div>
            )}
          </div>
        </div>

        {!thumbnailUrl && (
          <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Without a thumbnail, your video won't be promoted on the home feed.</span>
          </div>
        )}

        {thumbnailUrl && (
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-3 py-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Thumbnail added — video is eligible for home feed promotion.
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
            disabled={submitting}
            className="flex-1 bg-brand hover:bg-brand-bright text-white"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </span>
            ) : 'Publish Video'}
          </Button>
        </div>
      </form>
    </div>
  );
}
