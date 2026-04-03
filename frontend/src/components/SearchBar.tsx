import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';

interface SearchHistoryItem {
  id: number;
  keyword: string;
  created_at: string;
}

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  searchEngine: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchEngine }) => {
  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused) {
      api.getSearchHistory(10).then(setHistory);
    }
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      api.addSearchHistory(keyword.trim());
      onSearch(keyword.trim());
      setIsFocused(false);
    }
  };

  const handleHistoryClick = (kw: string) => {
    setKeyword(kw);
    onSearch(kw);
    setIsFocused(false);
  };

  const getSearchUrl = (kw: string) => {
    const encoded = encodeURIComponent(kw);
    switch (searchEngine) {
      case 'bing':
        return `https://www.bing.com/search?q=${encoded}`;
      case 'sogou':
        return `https://www.sogou.com/web?query=${encoded}`;
      default:
        return `https://www.baidu.com/s?wd=${encoded}`;
    }
  };

  return (
    <div className="relative w-[800px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="搜索你想要的资源..."
            className="w-full h-[60px] px-4 pl-10 bg-white/70 backdrop-blur-md rounded-full text-base focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            type="button"
            onClick={() => {
              if (keyword.trim()) {
                window.open(getSearchUrl(keyword.trim()), '_blank');
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-sm rounded-full hover:bg-blue-600 transition-colors shadow"
          >
            搜索
          </button>
        </div>
      </form>

      {isFocused && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/80 backdrop-blur-md rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="p-2 border-b border-white/20 text-xs text-gray-500 flex justify-between items-center">
            <span>搜索历史</span>
            <button
              onClick={() => {
                api.clearSearchHistory();
                setHistory([]);
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              清空
            </button>
          </div>
          <ul>
            {history.map((item) => (
              <li
                key={item.id}
                onClick={() => handleHistoryClick(item.keyword)}
                className="px-4 py-2 hover:bg-white/50 cursor-pointer text-sm"
              >
                {item.keyword}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
