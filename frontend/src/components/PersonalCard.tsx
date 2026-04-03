import React from 'react';

interface PersonalCardProps {
  favoritesCount: number;
  historyCount: number;
  onOpenFavorites: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

const PersonalCard: React.FC<PersonalCardProps> = ({
  favoritesCount,
  historyCount,
  onOpenFavorites,
  onOpenHistory,
  onOpenSettings,
}) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-4 shadow-md hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-[240px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">👤</span>
        <span className="font-semibold text-white">个人中心</span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2">
        <button
          onClick={onOpenFavorites}
          className="flex items-center justify-between px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <span className="text-white text-sm">❤️ 我的收藏</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {favoritesCount}
          </span>
        </button>

        <button
          onClick={onOpenHistory}
          className="flex items-center justify-between px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <span className="text-white text-sm">📋 浏览历史</span>
          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
            {historyCount}
          </span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center justify-between px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <span className="text-white text-sm">⚙️ 设置</span>
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PersonalCard;
