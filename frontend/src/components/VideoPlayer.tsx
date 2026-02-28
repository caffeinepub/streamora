import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward } from 'lucide-react';
import AdSlot from './AdSlot';

interface Props {
  videoUrl: string;
  isPremium?: boolean;
  title?: string;
}

type AdPhase = 'pre-roll' | 'playing' | 'mid-roll' | 'end-roll' | 'done';

export default function VideoPlayer({ videoUrl, isPremium = false, title }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<AdPhase>(isPremium ? 'playing' : 'pre-roll');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [midRollShown, setMidRollShown] = useState(false);

  const handleAdComplete = () => {
    if (phase === 'pre-roll') {
      setPhase('playing');
      setTimeout(() => videoRef.current?.play(), 100);
    } else if (phase === 'mid-roll') {
      setPhase('playing');
      setTimeout(() => videoRef.current?.play(), 100);
    } else if (phase === 'end-roll') {
      setPhase('done');
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const pct = (video.currentTime / video.duration) * 100;
    setProgress(pct);

    // Mid-roll at 50%
    if (!isPremium && !midRollShown && pct >= 50 && video.duration > 120) {
      video.pause();
      setIsPlaying(false);
      setMidRollShown(true);
      setPhase('mid-roll');
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (!isPremium) {
      setPhase('end-roll');
    } else {
      setPhase('done');
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = time;
    setProgress(parseFloat(e.target.value));
  };

  if (phase === 'pre-roll' || phase === 'mid-roll' || phase === 'end-roll') {
    return (
      <div className="w-full">
        <AdSlot onComplete={handleAdComplete} autoSkip skipAfter={5} />
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 mb-2 accent-brand cursor-pointer"
        />
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white hover:text-brand transition-colors">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
          </button>
          <button onClick={toggleMute} className="text-white hover:text-brand transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="text-white text-xs ml-auto">
            {Math.floor((progress / 100) * duration / 60)}:{String(Math.floor((progress / 100) * duration % 60)).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Play button overlay */}
      {!isPlaying && phase === 'playing' && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-brand/90 rounded-full p-4 shadow-glow">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      )}
    </div>
  );
}
