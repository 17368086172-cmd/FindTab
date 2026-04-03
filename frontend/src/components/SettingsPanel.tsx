import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface UserSettings {
  searchEngine: 'baidu' | 'bing' | 'sogou';
  historyEnabled: string;
  historyLimit: string;
  personalizedRecommend: string;
  wallpaper?: string;
}

interface SettingsPanelProps {
  onClose: () => void;
  onSettingsChange: (settings: UserSettings) => void;
}

const wallpaperOptions = [
  { id: 'none', name: '默认', url: '' },
  { id: 'nature', name: '自然风光', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80' },
  { id: 'mountain', name: '山川', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { id: 'ocean', name: '海洋', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80' },
  { id: 'forest', name: '森林', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80' },
  { id: 'city', name: '城市', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80' },
  { id: 'sky', name: '天空', url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80' },
  { id: 'minimal', name: '极简', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, onSettingsChange }) => {
  const [settings, setSettings] = useState<UserSettings>({
    searchEngine: 'baidu',
    historyEnabled: 'true',
    historyLimit: '20',
    personalizedRecommend: 'true',
    wallpaper: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await api.getSettings();
    setSettings(data as UserSettings);
  };

  const handleChange = async (key: keyof UserSettings, value: string) => {
    await api.updateSetting(key, value);
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md max-h-[80vh] rounded-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">⚙️ 设置</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">🖼️ 壁纸设置</h3>
              <div className="grid grid-cols-4 gap-2">
                {wallpaperOptions.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => handleChange('wallpaper', wp.url)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      (settings.wallpaper || '') === wp.url ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
                    }`}
                  >
                    {wp.url ? (
                      <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{wp.name}</span>
                      </div>
                    )}
                    {(settings.wallpaper || '') === wp.url && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">壁纸来源: Unsplash</p>
            </div>

            <div>
              <h3 className="font-medium mb-3">🔍 搜索设置</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">默认搜索引擎</span>
                  <select
                    value={settings.searchEngine}
                    onChange={(e) => handleChange('searchEngine', e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                  >
                    <option value="baidu">百度</option>
                    <option value="bing">必应</option>
                    <option value="sogou">搜狗</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">历史记录</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.historyEnabled === 'true'}
                      onChange={(e) => handleChange('historyEnabled', e.target.checked ? 'true' : 'false')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">历史记录保存数量</span>
                  <select
                    value={settings.historyLimit}
                    onChange={(e) => handleChange('historyLimit', e.target.value)}
                    className="px-3 py-1.5 border rounded-lg text-sm"
                  >
                    <option value="10">10条</option>
                    <option value="20">20条</option>
                    <option value="50">50条</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">🎲 盲盒设置</h3>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">个性化推荐</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.personalizedRecommend === 'true'}
                    onChange={(e) => handleChange('personalizedRecommend', e.target.checked ? 'true' : 'false')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-1">基于历史偏好进行推荐</p>
            </div>

            <div>
              <h3 className="font-medium mb-3">⚙️ 其他</h3>
              
              <div className="space-y-3">
                <button className="w-full py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg px-3">
                  清除缓存
                </button>
                <button className="w-full py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg px-3">
                  关于我们
                </button>
                <button className="w-full py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg px-3">
                  免责声明
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
