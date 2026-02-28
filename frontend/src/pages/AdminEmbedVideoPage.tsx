import React, { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Film, Link2, AlertCircle } from 'lucide-react';
import { useSaveVideo } from '../hooks/useQueries';
import { useAuth } from '../contexts/AuthContext';
import { generateId } from '../lib/store';
import { detectEmbedSource, getEmbedUrl } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminEmbedVideoPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const saveVideo = useSaveVideo();

  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPromoted, setIsPromoted] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const detectedSource = detectEmbedSource(videoUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) { toast.error('Please enter a video URL'); return; }
    if (!title.trim()) { toast.error('Please enter a title'); return; }
    if (!detectedSource) { toast.error('URL must be a YouTube or Rumble link'); return; }
    if (isPromoted && !thumbnailUrl.trim()) {
      toast.error('A thumbnail URL is required for promoted videos');
      return;
    }
    if (!session) return;

    setSubmitting(true);
    try {
      const embedUrl = getEmbedUrl(videoUrl.trim(), detectedSource);
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      saveVideo.mutate({
        id: generateId(),
        type: 'embedded',
        title: title.trim(),
        description: description.trim(),
        tags: tagList,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        embedUrl,
        embedSource: detectedSource,
        uploaderUsername: session.secretUsername,
        uploaderName: 'Streamora',
        views: 0,
        likes: 0,
        comments: [],
        isPromoted,
        createdAt: Date.now(),
      });
      toast.success('Video embedded successfully!');
      navigate({ to: '/admin' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-screen-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Film className="w-5 h-5 text-brand" />
        <h1 className="text-xl font-bold text-foreground">Embed Video</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="videoUrl" className="flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-brand" />
            Video URL (YouTube or Rumble)
          </Label>
          <Input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://rumble.com/v..."
            className="bg-surface-2 border-border focus:border-brand"
          />
          {videoUrl && (
            <p className={`text-xs flex items-center gap-1 ${detectedSource ? 'text-green-400' : 'text-red-400'}`}>
              {detectedSource ? `✓ Detected: ${detectedSource.charAt(0).toUpperCase() + detectedSource.slice(1)}` : '✗ Not a valid YouTube or Rumble URL'}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Video title"
            className="bg-surface-2 border-border focus:border-brand"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
          <Input
            id="thumbnailUrl"
            type="url"
            value={thumbnailUrl}
            onChange={e => setThumbnailUrl(e.target.value)}
            placeholder="https://example.com/thumbnail.jpg"
            className="bg-surface-2 border-border focus:border-brand"
          />
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full aspect-video object-cover rounded-lg mt-2" onError={e => (e.currentTarget.style.display = 'none')} />
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Video description..."
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

        <div className="flex items-center justify-between p-3 bg-surface-2 rounded-xl">
          <div>
            <p className="text-sm font-medium text-foreground">Promote on Home Feed</p>
            <p className="text-xs text-muted-foreground">Requires a thumbnail URL</p>
          </div>
          <Switch checked={isPromoted} onCheckedChange={setIsPromoted} />
        </div>

        {isPromoted && !thumbnailUrl && (
          <div className="flex items-start gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Add a thumbnail URL to promote this video on the home feed.</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin' })} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || !detectedSource}
            className="flex-1 bg-brand hover:bg-brand-bright text-white"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Embedding...
              </span>
            ) : 'Embed Video'}
          </Button>
        </div>
      </form>
    </div>
  );
}
