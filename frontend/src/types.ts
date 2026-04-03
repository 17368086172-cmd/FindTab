export interface Resource {
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

export interface SearchHistoryItem {
  id: number;
  keyword: string;
  created_at: string;
}

export interface UserHistory {
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

export interface UserSettings {
  searchEngine: 'baidu' | 'bing' | 'sogou';
  historyEnabled: string;
  historyLimit: string;
  personalizedRecommend: string;
}

export interface Stats {
  books: number;
  movies: number;
  games: number;
  apps: number;
  favorites: number;
  history: number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface ResourceFilters {
  type?: FilterOption[];
  year?: FilterOption[];
  tags?: FilterOption[];
  platform?: FilterOption[];
  price?: FilterOption[];
}
