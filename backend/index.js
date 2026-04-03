const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();

// 配置 CORS，允许所有前端域名访问
app.use(cors({
  origin: function(origin, callback) {
    // 允许所有来源（生产环境建议指定具体域名）
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.get('/api/resources', (req, res) => {
  const { type, tags, year, sort = 'hot_score', order = 'DESC', limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM resources WHERE 1=1';
  const params = [];
  
  if (type) {
    sql += ' AND type = ?';
    params.push(type);
  }
  
  if (tags) {
    sql += ' AND tags LIKE ?';
    params.push(`%${tags}%`);
  }
  
  if (year) {
    sql += ' AND year LIKE ?';
    params.push(`%${year}%`);
  }
  
  const validSorts = ['hot_score', 'rating', 'title', 'created_at'];
  const sortField = validSorts.includes(sort) ? sort : 'hot_score';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  sql += ` ORDER BY ${sortField} ${sortOrder}`;
  
  sql += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));
  
  const resources = db.prepare(sql).all(...params);
  res.json(resources);
});

app.get('/api/resources/:id', (req, res) => {
  const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.json(resource);
});

app.get('/api/hot-tags', (req, res) => {
  const { type, limit = 3 } = req.query;
  
  let sql = 'SELECT title FROM resources';
  const params = [];
  
  if (type) {
    sql += ' WHERE type = ?';
    params.push(type);
  }
  
  sql += ' ORDER BY hot_score DESC LIMIT ?';
  params.push(Number(limit));
  
  const tags = db.prepare(sql).all(...params).map(r => r.title);
  res.json(tags);
});

app.post('/api/blindbox', (req, res) => {
  const { type } = req.body;
  
  let sql = 'SELECT * FROM resources WHERE type = ?';
  const params = [type];
  
  const recentHistory = db.prepare(`
    SELECT resource_id FROM blindbox_history 
    ORDER BY created_at DESC LIMIT 10
  `).all().map(h => h.resource_id);
  
  const resources = db.prepare(sql).all(...params);
  
  if (resources.length === 0) {
    return res.status(404).json({ error: 'No resources available' });
  }
  
  const availableResources = resources.filter(r => !recentHistory.includes(r.id));
  
  if (availableResources.length === 0) {
    return res.json(resources[Math.floor(Math.random() * resources.length)]);
  }
  
  const weighted = availableResources.map(r => ({
    resource: r,
    weight: (r.hot_score || 0) * 0.3 + (r.rating || 0) * 10 * 0.3 + Math.random() * 100 * 0.4
  }));
  
  weighted.sort((a, b) => b.weight - a.weight);
  
  const selected = weighted[0].resource;
  
  db.prepare('INSERT INTO blindbox_history (resource_id) VALUES (?)').run(selected.id);
  
  res.json(selected);
});

app.get('/api/favorites', (req, res) => {
  const favorites = db.prepare(`
    SELECT r.*, f.created_at as favorited_at 
    FROM user_favorites f 
    JOIN resources r ON f.resource_id = r.id 
    ORDER BY f.created_at DESC
  `).all();
  res.json(favorites);
});

app.post('/api/favorites', (req, res) => {
  const { resourceId } = req.body;
  
  const existing = db.prepare('SELECT id FROM user_favorites WHERE resource_id = ?').get(resourceId);
  if (existing) {
    return res.status(400).json({ error: 'Already favorited' });
  }
  
  db.prepare('INSERT INTO user_favorites (resource_id) VALUES (?)').run(resourceId);
  res.json({ success: true });
});

app.delete('/api/favorites/:resourceId', (req, res) => {
  db.prepare('DELETE FROM user_favorites WHERE resource_id = ?').run(req.params.resourceId);
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  const { type } = req.query;
  
  let sql = `
    SELECT h.*, r.title, r.subtitle, r.cover, r.type as resource_type
    FROM user_history h
    LEFT JOIN resources r ON h.resource_id = r.id
  `;
  const params = [];
  
  if (type) {
    sql += ' WHERE h.type = ?';
    params.push(type);
  }
  
  sql += ' ORDER BY h.created_at DESC LIMIT 100';
  
  const history = db.prepare(sql).all(...params);
  res.json(history);
});

app.post('/api/history', (req, res) => {
  const { type, content, resourceId } = req.body;
  db.prepare('INSERT INTO user_history (type, content, resource_id) VALUES (?, ?, ?)').run(type, content, resourceId);
  res.json({ success: true });
});

app.delete('/api/history/:id', (req, res) => {
  db.prepare('DELETE FROM user_history WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/search-history', (req, res) => {
  const { limit = 10 } = req.query;
  const history = db.prepare('SELECT * FROM search_history ORDER BY created_at DESC LIMIT ?').all(Number(limit));
  res.json(history);
});

app.post('/api/search-history', (req, res) => {
  const { keyword } = req.body;
  
  const existing = db.prepare('SELECT id FROM search_history WHERE keyword = ?').get(keyword);
  if (existing) {
    db.prepare('DELETE FROM search_history WHERE id = ?').run(existing.id);
  }
  
  db.prepare('INSERT INTO search_history (keyword) VALUES (?)').run(keyword);
  
  const limit = 20;
  const all = db.prepare('SELECT id FROM search_history ORDER BY created_at DESC').all();
  if (all.length > limit) {
    const toDelete = all.slice(limit).map(h => h.id);
    const deleteSql = `DELETE FROM search_history WHERE id IN (${toDelete.map(() => '?').join(',')})`;
    db.prepare(deleteSql).run(...toDelete);
  }
  
  res.json({ success: true });
});

app.delete('/api/search-history', (req, res) => {
  db.exec('DELETE FROM search_history');
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM user_settings').all();
  const result = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  res.json(result);
});

app.put('/api/settings', (req, res) => {
  const { key, value } = req.body;
  db.prepare('INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)').run(key, value);
  res.json({ success: true });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    books: db.prepare('SELECT COUNT(*) as count FROM resources WHERE type = ?').get('book').count,
    movies: db.prepare('SELECT COUNT(*) as count FROM resources WHERE type = ?').get('movie').count,
    games: db.prepare('SELECT COUNT(*) as count FROM resources WHERE type = ?').get('game').count,
    apps: db.prepare('SELECT COUNT(*) as count FROM resources WHERE type = ?').get('app').count,
    favorites: db.prepare('SELECT COUNT(*) as count FROM user_favorites').get().count,
    history: db.prepare('SELECT COUNT(*) as count FROM user_history').get().count,
  };
  res.json(stats);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
