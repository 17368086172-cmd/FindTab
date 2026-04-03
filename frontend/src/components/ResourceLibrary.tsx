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
}

interface FilterOption {
  label: string;
  value: string;
}

interface ResourceLibraryProps {
  type: 'book' | 'movie' | 'game' | 'app';
  title: string;
  icon: string;
  onClose: () => void;
  onSelectResource: (resource: Resource) => void;
}

const filterConfig: Record<string, Record<string, FilterOption[]>> = {
  book: {
    type: [
      { label: '小说', value: '小说' },
      { label: '散文', value: '散文' },
      { label: '科技', value: '科技' },
      { label: '历史', value: '历史' },
      { label: '心理', value: '心理' },
      { label: '经管', value: '经管' },
    ],
    year: [
      { label: '2020s', value: '202' },
      { label: '2010s', value: '201' },
      { label: '2000s', value: '200' },
      { label: '经典', value: '经典' },
    ],
    tags: [
      { label: '爱情', value: '爱情' },
      { label: '悬疑', value: '悬疑' },
      { label: '科幻', value: '科幻' },
      { label: '奇幻', value: '奇幻' },
      { label: '现实', value: '现实' },
    ],
  },
  movie: {
    type: [
      { label: '电影', value: '电影' },
      { label: '剧集', value: '剧集' },
      { label: '综艺', value: '综艺' },
      { label: '动漫', value: '动漫' },
      { label: '纪录片', value: '纪录片' },
    ],
    year: [
      { label: '2024', value: '2024' },
      { label: '2023', value: '2023' },
      { label: '2022', value: '2022' },
      { label: '经典', value: '经典' },
    ],
    tags: [
      { label: '国产', value: '国产' },
      { label: '欧美', value: '欧美' },
      { label: '日韩', value: '日韩' },
    ],
  },
  game: {
    type: [
      { label: '动作', value: '动作' },
      { label: 'RPG', value: 'RPG' },
      { label: '策略', value: '策略' },
      { label: '休闲', value: '休闲' },
      { label: '竞技', value: '竞技' },
    ],
    tags: [
      { label: 'PC', value: 'PC' },
      { label: '主机', value: '主机' },
      { label: '移动', value: '移动' },
    ],
  },
  app: {
    type: [
      { label: '工具', value: '工具' },
      { label: '社交', value: '社交' },
      { label: '娱乐', value: '娱乐' },
      { label: '效率', value: '效率' },
      { label: '学习', value: '学习' },
    ],
    tags: [
      { label: 'Android', value: 'Android' },
      { label: 'iOS', value: 'iOS' },
      { label: 'Windows', value: 'Windows' },
      { label: 'Mac', value: 'Mac' },
    ],
  },
};

const sortOptions = [
  { label: '热度', value: 'hot_score' },
  { label: '评分', value: 'rating' },
  { label: '时间', value: 'year' },
  { label: '名称', value: 'title' },
];

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({
  type,
  title,
  icon,
  onClose,
  onSelectResource,
}) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState('hot_score');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  const config = filterConfig[type] || {};

  useEffect(() => {
    loadResources();
  }, [type, selectedFilters, sortBy]);

  const loadResources = async () => {
    setLoading(true);
    const params: Record<string, string> = {
      type,
      sort: sortBy,
      order: 'DESC',
    };

    if (selectedFilters.tags) {
      params.tags = selectedFilters.tags;
    }
    if (selectedFilters.year) {
      params.year = selectedFilters.year;
    }

    const data = await api.getResources(params);
    setResources(data);
    setLoading(false);
  };

  const handleFilterClick = (category: string, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? '' : value,
    }));
  };

  const handleResourceClick = (resource: Resource) => {
    if (selectedResource?.id === resource.id) {
      setSelectedResource(null);
    } else {
      setSelectedResource(resource);
    }
  };

  const handleConfirm = () => {
    if (selectedResource) {
      onSelectResource(selectedResource);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-semibold">{title}资源库</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 border-b bg-gray-50/50">
          {Object.entries(config).map(([category, options]) => (
            <div key={category} className="mb-2">
              <div className="text-xs text-gray-500 mb-1">
                {category === 'type' ? '类型' : category === 'year' ? '年代' : '标签'}
              </div>
              <div className="flex flex-wrap gap-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterClick(category, option.value)}
                    className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                      selectedFilters[category] === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 hover:border-blue-300 text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">排序:</span>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                    sortBy === option.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200 hover:border-blue-300 text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedFilters({})}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              重置
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-3" style={{ height: 'calc(85vh - 200px)', minHeight: '300px' }}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center text-gray-500 py-8">暂无资源</div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  onClick={() => handleResourceClick(resource)}
                  className={`p-2 rounded-lg cursor-pointer transition-all ${
                    selectedResource?.id === resource.id
                      ? 'bg-blue-50 ring-2 ring-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <img
                    src={resource.cover}
                    alt={resource.title}
                    className="w-full aspect-[3/4] object-cover rounded-md mb-1.5"
                  />
                  <div className="font-medium text-sm truncate">{resource.title}</div>
                  <div className="text-xs text-gray-500 truncate">{resource.subtitle}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                    <span>⭐{resource.rating}</span>
                    <span>🔥{resource.hot_score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedResource && (
          <div className="p-3 border-t bg-white">
            <button
              onClick={handleConfirm}
              className="w-full py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors text-sm"
            >
              搜索 "{selectedResource.title}"
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;
