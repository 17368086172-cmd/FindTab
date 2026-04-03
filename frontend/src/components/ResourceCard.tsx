import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { api } from '../api';

interface Resource {
  id: string;
  type: 'book' | 'movie' | 'game' | 'app';
  title: string;
  subtitle: string;
  cover: string;
  rating: number;
  tags: string;
  year: string;
  hot_score: number;
  description: string;
  favorited_at?: string;
}

interface ResourceCardProps {
  type: 'book' | 'movie' | 'game' | 'app';
  title: string;
  icon: string;
  colorClass: string;
  count: number;
  hotTags: string[];
  onOpenLibrary: () => void;
  onSelectResource: (resource: Resource) => void;
}

const ResourceCard = forwardRef<{ handleBlindbox: () => void }, ResourceCardProps>(({
  type,
  title,
  icon,
  colorClass,
  count,
  hotTags,
  onOpenLibrary,
  onSelectResource,
}, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Resource | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleBlindbox = async () => {
    setIsLoading(true);
    try {
      const resource = await api.blindbox(type);
      setResult(resource);
      setIsFavorited(false);
      api.addHistory({ type: 'blindbox', content: resource.title, resourceId: resource.id });
    } catch (error) {
      console.error('Blindbox error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleBlindbox,
  }));

  const handleSearch = () => {
    if (result) {
      onSelectResource(result);
    }
  };

  const handleFavorite = async () => {
    if (result && !isFavorited) {
      await api.addFavorite(result.id);
      setIsFavorited(true);
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsFavorited(false);
  };

  return (
    <div className={`${colorClass} rounded-2xl p-4 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-[240px] flex flex-col`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-white drop-shadow">{title}</span>
        </div>
        <button
          onClick={onOpenLibrary}
          className="flex items-center gap-1 text-white/90 text-sm hover:text-white transition-colors"
        >
          <span>资源库</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{count}+</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white/80 text-sm">抽取中...</span>
          </div>
        ) : result ? (
          <div className="w-full animate-fadeIn">
            <div className="flex gap-3 mb-2">
              <img
                src={result.cover}
                alt={result.title}
                className="w-12 h-16 object-cover rounded-lg shadow flex-shrink-0"
              />
              <div className="flex-1 text-white min-w-0">
                <div className="font-semibold truncate drop-shadow">{result.title}</div>
                <div className="text-xs text-white/70 truncate">{result.subtitle}</div>
                <div className="text-xs text-white/70">
                  ⭐ {result.rating} | 🔥 {result.hot_score}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 py-1 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
              >
                立即搜索
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-1 bg-white/20 text-white rounded-lg text-xs hover:bg-white/30 transition-colors"
              >
                再抽一次
              </button>
              <button
                onClick={handleFavorite}
                className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                  isFavorited ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleBlindbox}
            className="px-6 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors flex items-center gap-2"
          >
            <span>🎲</span>
            <span>抽盲盒</span>
          </button>
        )}
      </div>

      <div className="h-[28px] mt-2 flex gap-2 flex-wrap overflow-hidden">
        {!result && !isLoading && hotTags.map((tag, index) => (
          <span
            key={index}
            className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full whitespace-nowrap"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
});

ResourceCard.displayName = 'ResourceCard';

export default ResourceCard;
