import React, { useState, useEffect } from 'react';
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

interface FavoritesPanelProps {
  onClose: () => void;
  onSelectResource: (resource: Resource) => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ onClose, onSelectResource }) => {
  const [favorites, setFavorites] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'book' | 'movie' | 'game' | 'app'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await api.getFavorites();
    setFavorites(data);
    setLoading(false);
  };

  const handleRemove = async (resourceId: string) => {
    await api.removeFavorite(resourceId);
    setFavorites(favorites.filter((f) => f.id !== resourceId));
  };

  const filteredFavorites = activeTab === 'all' 
    ? favorites 
    : favorites.filter((f) => f.type === activeTab);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'book', label: '小说' },
    { key: 'movie', label: '影视' },
    { key: 'game', label: '游戏' },
    { key: 'app', label: '应用' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">❤️ 我的收藏</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center text-gray-500 py-10">暂无收藏</div>
          ) : (
            <div className="space-y-3">
              {filteredFavorites.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate">{item.subtitle}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      收藏于 {new Date(item.favorited_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectResource(item)}
                      className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      搜索
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-500 text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPanel;
