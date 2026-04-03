import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface UserHistory {
  id: number;
  type: 'search' | 'browse' | 'blindbox';
  content: string;
  resource_id: string | null;
  created_at: string;
  title?: string;
  subtitle?: string;
  cover?: string;
  resource_type?: string;
}

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
}

interface HistoryPanelProps {
  onClose: () => void;
  onSelectResource: (resource: Resource) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ onClose, onSelectResource }) => {
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'search' | 'browse' | 'blindbox'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    const data = await api.getHistory();
    setHistory(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await api.deleteHistory(id);
    setHistory(history.filter((h) => h.id !== id));
  };

  const filteredHistory = activeTab === 'all' ? history : history.filter((h) => h.type === activeTab);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'search', label: '搜索' },
    { key: 'browse', label: '浏览' },
    { key: 'blindbox', label: '盲盒' },
  ];

  const typeIcons: Record<string, string> = {
    search: '🔍',
    browse: '👁️',
    blindbox: '🎲',
  };

  const handleItemClick = (item: UserHistory) => {
    if (item.resource_id && item.title) {
      onSelectResource({
        id: item.resource_id,
        type: item.resource_type as Resource['type'],
        title: item.title,
        subtitle: item.subtitle || '',
        cover: item.cover || '',
        rating: 0,
        tags: '',
        year: '',
        hot_score: 0,
        description: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">📋 历史记录</h2>
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
          ) : filteredHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-10">暂无历史记录</div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {typeIcons[item.type] || '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.content}</div>
                    {item.title && (
                      <div className="text-sm text-gray-500 truncate">{item.title}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.resource_id && (
                      <button
                        onClick={() => handleItemClick(item)}
                        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        搜索
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
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

export default HistoryPanel;
