const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = {
  async getResources(params: {
    type?: string;
    tags?: string;
    year?: string;
    sort?: string;
    order?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });
    
    const res = await fetch(`${API_BASE}/resources?${query}`);
    return res.json();
  },

  async getResource(id: string) {
    const res = await fetch(`${API_BASE}/resources/${id}`);
    return res.json();
  },

  async getHotTags(type?: string, limit = 3) {
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    query.append('limit', String(limit));
    
    const res = await fetch(`${API_BASE}/hot-tags?${query}`);
    return res.json();
  },

  async blindbox(type: string) {
    const res = await fetch(`${API_BASE}/blindbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    return res.json();
  },

  async getFavorites() {
    const res = await fetch(`${API_BASE}/favorites`);
    return res.json();
  },

  async addFavorite(resourceId: string) {
    const res = await fetch(`${API_BASE}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId }),
    });
    return res.json();
  },

  async removeFavorite(resourceId: string) {
    const res = await fetch(`${API_BASE}/favorites/${resourceId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getHistory(type?: string) {
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    
    const res = await fetch(`${API_BASE}/history?${query}`);
    return res.json();
  },

  async addHistory(data: { type: string; content: string; resourceId?: string }) {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteHistory(id: number) {
    const res = await fetch(`${API_BASE}/history/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getSearchHistory(limit = 10) {
    const res = await fetch(`${API_BASE}/search-history?limit=${limit}`);
    return res.json();
  },

  async addSearchHistory(keyword: string) {
    const res = await fetch(`${API_BASE}/search-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword }),
    });
    return res.json();
  },

  async clearSearchHistory() {
    const res = await fetch(`${API_BASE}/search-history`, {
      method: 'DELETE',
    });
    return res.json();
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSetting(key: string, value: string) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },
};
