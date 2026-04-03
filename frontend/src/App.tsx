import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import SearchBar from './components/SearchBar';
import ResourceCard from './components/ResourceCard';
import ResourceLibrary from './components/ResourceLibrary';
import PersonalCard from './components/PersonalCard';
import FavoritesPanel from './components/FavoritesPanel';
import HistoryPanel from './components/HistoryPanel';
import SettingsPanel from './components/SettingsPanel';
import { api } from './api';
import { useDragScroll } from './hooks/useDragScroll';

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

interface UserSettings {
  searchEngine: 'baidu' | 'bing' | 'sogou';
  historyEnabled: string;
  historyLimit: string;
  personalizedRecommend: string;
  wallpaper?: string;
}

interface Stats {
  books: number;
  movies: number;
  games: number;
  apps: number;
  favorites: number;
  history: number;
}

const cardConfig = [
  { type: 'book' as const, title: '小说搜索', icon: '📚', colorClass: 'bg-white/20 backdrop-blur-xl border border-white/30' },
  { type: 'movie' as const, title: '影视搜索', icon: '🎬', colorClass: 'bg-white/20 backdrop-blur-xl border border-white/30' },
  { type: 'game' as const, title: '游戏搜索', icon: '🎮', colorClass: 'bg-white/20 backdrop-blur-xl border border-white/30' },
  { type: 'app' as const, title: '应用搜索', icon: '📱', colorClass: 'bg-white/20 backdrop-blur-xl border border-white/30' },
];

function App() {
  const [settings, setSettings] = useState<UserSettings>({
    searchEngine: 'baidu',
    historyEnabled: 'true',
    historyLimit: '20',
    personalizedRecommend: 'true',
  });
  
  const [stats, setStats] = useState<Stats>({
    books: 0,
    movies: 0,
    games: 0,
    apps: 0,
    favorites: 0,
    history: 0,
  });

  const [hotTags, setHotTags] = useState<Record<string, string[]>>({
    book: [],
    movie: [],
    game: [],
    app: [],
  });

  const [libraryOpen, setLibraryOpen] = useState<'book' | 'movie' | 'game' | 'app' | null>(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const dragScroll = useDragScroll();
  const cardRefs = useRef<Record<string, { handleBlindbox: () => void }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [settingsData, statsData, bookTags, movieTags, gameTags, appTags] = await Promise.all([
      api.getSettings(),
      api.getStats(),
      api.getHotTags('book'),
      api.getHotTags('movie'),
      api.getHotTags('game'),
      api.getHotTags('app'),
    ]);

    setSettings(settingsData as UserSettings);
    setStats(statsData);
    setHotTags({
      book: bookTags,
      movie: movieTags,
      game: gameTags,
      app: appTags,
    });
  };

  const handleSearch = (keyword: string) => {
    api.addHistory({ type: 'search', content: keyword });
    
    const encoded = encodeURIComponent(keyword);
    let url = '';
    
    switch (settings.searchEngine) {
      case 'bing':
        url = `https://www.bing.com/search?q=${encoded}`;
        break;
      case 'sogou':
        url = `https://www.sogou.com/web?query=${encoded}`;
        break;
      default:
        url = `https://www.baidu.com/s?wd=${encoded}`;
    }
    
    window.open(url, '_blank');
  };

  const handleSelectResource = (resource: Resource) => {
    api.addHistory({ type: 'browse', content: resource.title, resourceId: resource.id });
    
    const suffixMap: Record<string, string> = {
      book: ' 小说免费阅读',
      movie: ' 免费在线观看',
      game: ' 免费下载',
      app: ' 免费下载',
    };
    
    const searchKeyword = resource.title + (suffixMap[resource.type] || '');
    const encoded = encodeURIComponent(searchKeyword);
    let url = '';
    
    switch (settings.searchEngine) {
      case 'bing':
        url = `https://www.bing.com/search?q=${encoded}`;
        break;
      case 'sogou':
        url = `https://www.sogou.com/web?query=${encoded}`;
        break;
      default:
        url = `https://www.baidu.com/s?wd=${encoded}`;
    }
    
    window.open(url, '_blank');
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleTitleClick = () => {
    Object.values(cardRefs.current).forEach(ref => {
      if (ref?.handleBlindbox) {
        ref.handleBlindbox();
      }
    });
  };

  const counts = {
    book: stats.books,
    movie: stats.movies,
    game: stats.games,
    app: stats.apps,
  };

  const backgroundStyle = settings.wallpaper 
    ? { backgroundImage: `url(${settings.wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center" style={backgroundStyle}>
      <div className="w-full px-8 py-10">
        <header className="mb-6">
          <h1 
            onClick={handleTitleClick}
            className="text-8xl font-bold text-center text-white mb-4 drop-shadow-lg cursor-pointer hover:scale-105 transition-transform select-none"
          >
            Find Tab
          </h1>
          <SearchBar onSearch={handleSearch} searchEngine={settings.searchEngine} />
        </header>

        <main>
          <div className="w-full overflow-hidden">
            <div 
              ref={dragScroll.ref}
              className="flex gap-6 overflow-x-auto pb-6 mb-6 cursor-grab active:cursor-grabbing select-none scrollbar-hide"
              onMouseDown={dragScroll.onMouseDown}
              onMouseLeave={dragScroll.onMouseLeave}
              onMouseUp={dragScroll.onMouseUp}
              onMouseMove={dragScroll.onMouseMove}
              onTouchStart={dragScroll.onTouchStart}
              onTouchMove={dragScroll.onTouchMove}
            >
              {cardConfig.map((card) => (
                <div key={card.type} className="flex-shrink-0 w-[360px]">
                  <ResourceCard
                    ref={(el) => { if (el) cardRefs.current[card.type] = el; }}
                    type={card.type}
                    title={card.title}
                    icon={card.icon}
                    colorClass={card.colorClass}
                    count={counts[card.type]}
                    hotTags={hotTags[card.type]}
                    onOpenLibrary={() => setLibraryOpen(card.type)}
                    onSelectResource={handleSelectResource}
                  />
                </div>
              ))}
              <div className="flex-shrink-0 w-[360px]">
                <PersonalCard
                  favoritesCount={stats.favorites}
                  historyCount={stats.history}
                  onOpenFavorites={() => setFavoritesOpen(true)}
                  onOpenHistory={() => setHistoryOpen(true)}
                  onOpenSettings={() => setSettingsOpen(true)}
                />
              </div>
            </div>
          </div>
        </main>

        {libraryOpen && (
          <ResourceLibrary
            type={libraryOpen}
            title={cardConfig.find((c) => c.type === libraryOpen)?.title || ''}
            icon={cardConfig.find((c) => c.type === libraryOpen)?.icon || ''}
            onClose={() => setLibraryOpen(null)}
            onSelectResource={handleSelectResource}
          />
        )}

        {favoritesOpen && (
          <FavoritesPanel
            onClose={() => setFavoritesOpen(false)}
            onSelectResource={handleSelectResource}
          />
        )}

        {historyOpen && (
          <HistoryPanel
            onClose={() => setHistoryOpen(false)}
            onSelectResource={handleSelectResource}
          />
        )}

        {settingsOpen && (
          <SettingsPanel
            onClose={() => setSettingsOpen(false)}
            onSettingsChange={handleSettingsChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;
