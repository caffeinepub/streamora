import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Search, X } from 'lucide-react';
import { useSearchVideos } from '../hooks/useQueries';
import { useDebounce } from 'react-use';
import { timeAgo } from '../lib/utils';

export default function AppHeader() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useDebounce(() => setDebouncedQuery(query), 300, [query]);

  const { data: suggestions = [] } = useSearchVideos(debouncedQuery);

  useEffect(() => {
    setShowDropdown(debouncedQuery.length >= 2 && suggestions.length > 0);
  }, [debouncedQuery, suggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: '/search', search: { q: query.trim() } });
      setShowDropdown(false);
      setQuery('');
    }
  };

  const handleSelectSuggestion = (videoId: string) => {
    navigate({ to: '/video/$videoId', params: { videoId } });
    setShowDropdown(false);
    setQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-3 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/streamora-wordmark.dim_400x80.png"
            alt="Streamora"
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-xs ml-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => debouncedQuery.length >= 2 && suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Search videos..."
              className="w-full bg-surface-2 border border-border rounded-full pl-9 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setShowDropdown(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Suggestions Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-xl shadow-card overflow-hidden z-50"
            >
              {suggestions.map(video => (
                <button
                  key={video.id}
                  onClick={() => handleSelectSuggestion(video.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition-colors text-left"
                >
                  <div className="w-10 h-7 rounded overflow-hidden bg-surface-3 shrink-0">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <img src="/assets/generated/streamora-logo.dim_256x256.png" alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.type === 'short' ? 'Short' : 'Video'} · {timeAgo(video.createdAt)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
