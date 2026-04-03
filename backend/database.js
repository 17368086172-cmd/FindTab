const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'findtab.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    cover TEXT,
    rating REAL,
    tags TEXT,
    year TEXT,
    hot_score INTEGER DEFAULT 0,
    description TEXT,
    extra TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id)
  );

  CREATE TABLE IF NOT EXISTS user_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    resource_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blindbox_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resource_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id)
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS search_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const sampleData = [
  { id: 'book_001', type: 'book', title: '三体', subtitle: '刘慈欣', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/70/cpplatform_e9c628607a7c5c9e06e78e2ea3d1f93d/cpplatform_e9c628607a7c5c9e06e78e2ea3d1f93d.jpg', rating: 9.3, tags: '科幻,小说', year: '2008', hot_score: 9876, description: '文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划"红岸工程"取得了突破性进展。' },
  { id: 'book_002', type: 'book', title: '哈利波特', subtitle: 'J.K.罗琳', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/16/YUEWEN-BOOK-45000016/YUEWEN-BOOK-45000016.jpg', rating: 9.0, tags: '奇幻,小说', year: '1997', hot_score: 8765, description: '魔法世界的冒险故事，哈利波特在霍格沃茨魔法学校的成长历程。' },
  { id: 'book_003', type: 'book', title: '沙丘', subtitle: '弗兰克·赫伯特', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/45/YUEWEN-BOOK-45000045/YUEWEN-BOOK-45000045.jpg', rating: 8.8, tags: '科幻,小说', year: '1965', hot_score: 7654, description: '沙漠星球的史诗，保罗·厄崔迪的传奇故事。' },
  { id: 'book_004', type: 'book', title: '百年孤独', subtitle: '加西亚·马尔克斯', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/54/YUEWEN-BOOK-45000054/YUEWEN-BOOK-45000054.jpg', rating: 9.2, tags: '文学,小说', year: '1967', hot_score: 6543, description: '布恩迪亚家族七代人的传奇故事，魔幻现实主义经典。' },
  { id: 'book_005', type: 'book', title: '活着', subtitle: '余华', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/89/YUEWEN-BOOK-8900089/YUEWEN-BOOK-8900089.jpg', rating: 9.4, tags: '现实,小说', year: '1993', hot_score: 8234, description: '福贵的人生苦难史，中国当代文学经典。' },
  { id: 'book_006', type: 'book', title: '围城', subtitle: '钱钟书', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/1/YUEWEN-BOOK-1000001/YUEWEN-BOOK-1000001.jpg', rating: 8.9, tags: '文学,小说', year: '1947', hot_score: 7543, description: '婚姻就像一座围城，城外的人想进去，城里的人想出来。' },
  { id: 'book_007', type: 'book', title: '红楼梦', subtitle: '曹雪芹', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/2/YUEWEN-BOOK-1000002/YUEWEN-BOOK-1000002.jpg', rating: 9.6, tags: '古典,小说', year: '1791', hot_score: 9234, description: '中国古典四大名著之首，贾宝玉与林黛玉的爱情悲剧。' },
  { id: 'book_008', type: 'book', title: '1984', subtitle: '乔治·奥威尔', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/3/YUEWEN-BOOK-1000003/YUEWEN-BOOK-1000003.jpg', rating: 9.4, tags: '科幻,小说', year: '1949', hot_score: 8654, description: '反乌托邦经典，极权主义社会的警示寓言。' },
  { id: 'book_009', type: 'book', title: '小王子', subtitle: '安托万·德·圣-埃克苏佩里', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/4/YUEWEN-BOOK-1000004/YUEWEN-BOOK-1000004.jpg', rating: 9.0, tags: '童话,小说', year: '1943', hot_score: 8123, description: '献给所有曾经是孩子的大人，关于爱与责任的童话。' },
  { id: 'book_010', type: 'book', title: '人类简史', subtitle: '尤瓦尔·赫拉利', cover: 'https://weread-1258476243.file.myqcloud.com/weread/cover/5/YUEWEN-BOOK-1000005/YUEWEN-BOOK-1000005.jpg', rating: 9.1, tags: '历史,非虚构', year: '2011', hot_score: 8567, description: '从动物到上帝，人类历史的宏大叙事。' },
  
  { id: 'movie_001', type: 'movie', title: '肖申克的救赎', subtitle: '弗兰克·德拉邦特', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg', rating: 9.7, tags: '剧情,经典', year: '1994', hot_score: 9999, description: '希望与自由的赞歌，安迪在监狱中的救赎之路。' },
  { id: 'movie_002', type: 'movie', title: '盗梦空间', subtitle: '克里斯托弗·诺兰', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2616355133.jpg', rating: 9.3, tags: '科幻,悬疑', year: '2010', hot_score: 8888, description: '梦境与现实的交织，多层梦境的烧脑之旅。' },
  { id: 'movie_003', type: 'movie', title: '流浪地球2', subtitle: '郭帆', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2885376121.jpg', rating: 8.5, tags: '科幻,国产', year: '2023', hot_score: 9527, description: '人类带着地球去流浪，中国科幻电影的里程碑。' },
  { id: 'movie_004', type: 'movie', title: '奥本海默', subtitle: '克里斯托弗·诺兰', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2893541981.jpg', rating: 8.9, tags: '传记,历史', year: '2023', hot_score: 8765, description: '原子弹之父的传奇，科学与道德的抉择。' },
  { id: 'movie_005', type: 'movie', title: '星际穿越', subtitle: '克里斯托弗·诺兰', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2614988097.jpg', rating: 9.4, tags: '科幻,冒险', year: '2014', hot_score: 9123, description: '穿越虫洞的星际之旅，父女跨越时空的爱。' },
  { id: 'movie_006', type: 'movie', title: '霸王别姬', subtitle: '陈凯歌', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg', rating: 9.6, tags: '剧情,文艺', year: '1993', hot_score: 9456, description: '程蝶衣的一生，京剧艺术的绝唱。' },
  { id: 'movie_007', type: 'movie', title: '泰坦尼克号', subtitle: '詹姆斯·卡梅隆', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg', rating: 9.4, tags: '爱情,灾难', year: '1997', hot_score: 9234, description: '杰克与露丝的爱情，永不沉没的经典。' },
  { id: 'movie_008', type: 'movie', title: '千与千寻', subtitle: '宫崎骏', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2557573348.jpg', rating: 9.4, tags: '动画,奇幻', year: '2001', hot_score: 9178, description: '千寻的奇幻冒险，宫崎骏的巅峰之作。' },
  { id: 'movie_009', type: 'movie', title: '让子弹飞', subtitle: '姜文', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p1512562287.jpg', rating: 9.0, tags: '喜剧,动作', year: '2010', hot_score: 8965, description: '姜文的黑色幽默，土匪与恶霸的斗智斗勇。' },
  { id: 'movie_010', type: 'movie', title: '阿甘正传', subtitle: '罗伯特·泽米吉斯', cover: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2372307693.jpg', rating: 9.5, tags: '剧情,励志', year: '1994', hot_score: 9345, description: '阿甘的一生，美国历史的缩影。' },
  
  { id: 'game_001', type: 'game', title: '艾尔登法环', subtitle: 'FromSoftware', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg', rating: 9.5, tags: '动作,RPG', year: '2022', hot_score: 9855, description: '开放世界魂系游戏，宫崎英高与乔治·R·R·马丁的合作。' },
  { id: 'game_002', type: 'game', title: '塞尔达传说：王国之泪', subtitle: '任天堂', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5vmg.jpg', rating: 9.6, tags: '冒险,开放世界', year: '2023', hot_score: 9766, description: '海拉鲁大陆的新冒险，林克的空中之旅。' },
  { id: 'game_003', type: 'game', title: '博德之门3', subtitle: 'Larian Studios', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg', rating: 9.4, tags: 'RPG,策略', year: '2023', hot_score: 9644, description: 'D&D规则的CRPG杰作，自由度极高的冒险。' },
  { id: 'game_004', type: 'game', title: '原神', subtitle: '米哈游', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg', rating: 8.5, tags: 'RPG,开放世界', year: '2020', hot_score: 9533, description: '提瓦特大陆的冒险，国产开放世界游戏。' },
  { id: 'game_005', type: 'game', title: '黑神话：悟空', subtitle: '游戏科学', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6qhn.jpg', rating: 9.2, tags: '动作,国产', year: '2024', hot_score: 9977, description: '西游题材动作游戏，国产3A大作。' },
  { id: 'game_006', type: 'game', title: '赛博朋克2077', subtitle: 'CD Projekt RED', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4hkg.jpg', rating: 8.2, tags: 'RPG,开放世界', year: '2020', hot_score: 8922, description: '夜之城的冒险，赛博朋克世界的沉浸体验。' },
  { id: 'game_007', type: 'game', title: '战神：诸神黄昏', subtitle: 'Santa Monica Studio', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg', rating: 9.3, tags: '动作,冒险', year: '2022', hot_score: 9411, description: '奎托斯的北欧之旅，父子情深。' },
  { id: 'game_008', type: 'game', title: '霍格沃茨之遗', subtitle: 'Avalanche Software', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5w2k.jpg', rating: 8.5, tags: 'RPG,冒险', year: '2023', hot_score: 8788, description: '霍格沃茨的魔法冒险，哈利波特世界观。' },
  { id: 'game_009', type: 'game', title: '只狼：影逝二度', subtitle: 'FromSoftware', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rba.jpg', rating: 9.1, tags: '动作,冒险', year: '2019', hot_score: 9299, description: '忍者的复仇之路，硬核动作游戏。' },
  { id: 'game_010', type: 'game', title: '荒野大镖客2', subtitle: 'Rockstar Games', cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.jpg', rating: 9.7, tags: '动作,冒险', year: '2018', hot_score: 9488, description: '西部世界的史诗，亚瑟·摩根的传奇。' },
  
  { id: 'app_001', type: 'app', title: 'Notion', subtitle: 'Notion Labs', cover: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', rating: 9.0, tags: '效率,工具', year: '2018', hot_score: 9255, description: '全能笔记与协作工具，个人知识管理的首选。' },
  { id: 'app_002', type: 'app', title: 'Figma', subtitle: 'Figma Inc.', cover: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', rating: 9.2, tags: '设计,工具', year: '2016', hot_score: 9366, description: '协作设计工具，设计师必备。' },
  { id: 'app_003', type: 'app', title: 'VS Code', subtitle: 'Microsoft', cover: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', rating: 9.3, tags: '开发,工具', year: '2015', hot_score: 9477, description: '强大的代码编辑器，开发者的首选。' },
  { id: 'app_004', type: 'app', title: 'Spotify', subtitle: 'Spotify AB', cover: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg', rating: 8.8, tags: '音乐,娱乐', year: '2008', hot_score: 9144, description: '全球领先的音乐流媒体，海量曲库。' },
  { id: 'app_005', type: 'app', title: '微信', subtitle: '腾讯', cover: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/WeChat_logo.svg', rating: 8.0, tags: '社交,通讯', year: '2011', hot_score: 9999, description: '国民级社交应用，连接一切。' },
  { id: 'app_006', type: 'app', title: 'Telegram', subtitle: 'Telegram FZ-LLC', cover: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg', rating: 8.9, tags: '社交,通讯', year: '2013', hot_score: 9255, description: '安全快速的即时通讯，隐私保护。' },
  { id: 'app_007', type: 'app', title: 'Discord', subtitle: 'Discord Inc.', cover: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo.svg', rating: 8.7, tags: '社交,通讯', year: '2015', hot_score: 9166, description: '游戏玩家社区平台，语音聊天首选。' },
  { id: 'app_008', type: 'app', title: 'Slack', subtitle: 'Salesforce', cover: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg', rating: 8.5, tags: '效率,协作', year: '2013', hot_score: 8977, description: '企业协作通讯工具，团队沟通利器。' },
  { id: 'app_009', type: 'app', title: 'Obsidian', subtitle: 'Obsidian', cover: 'https://obsidian.md/images/obsidian-logo-gradient.svg', rating: 9.1, tags: '效率,笔记', year: '2020', hot_score: 9088, description: '本地优先的知识库工具，双向链接笔记。' },
  { id: 'app_010', type: 'app', title: 'ChatGPT', subtitle: 'OpenAI', cover: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg', rating: 9.2, tags: 'AI,工具', year: '2022', hot_score: 9999, description: 'AI对话助手，智能问答与创作。' },
];

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO resources (id, type, title, subtitle, cover, rating, tags, year, hot_score, description)
  VALUES (@id, @type, @title, @subtitle, @cover, @rating, @tags, @year, @hot_score, @description)
`);

for (const item of sampleData) {
  insertStmt.run(item);
}

const defaultSettings = [
  { key: 'searchEngine', value: 'baidu' },
  { key: 'historyEnabled', value: 'true' },
  { key: 'historyLimit', value: '20' },
  { key: 'personalizedRecommend', value: 'true' },
];

const settingStmt = db.prepare('INSERT OR IGNORE INTO user_settings (key, value) VALUES (@key, @value)');
for (const setting of defaultSettings) {
  settingStmt.run(setting);
}

console.log(`✅ 数据库初始化完成，共 ${sampleData.length} 条数据`);

module.exports = db;
