# Find Tab 部署配置完成

你的 Find Tab 项目已经配置好 Vercel + Railway 部署环境。

## 📁 新增的文件

```
Find Tab/
├── backend/
│   ├── railway.json          # Railway 部署配置
│   └── ... (原有文件)
├── frontend/
│   ├── vercel.json           # Vercel 部署配置
│   ├── .env.example          # 环境变量示例
│   └── ... (原有文件)
├── DEPLOYMENT.md             # 详细部署指南
├── README_DEPLOY.md          # 本文件
└── deploy.sh                 # 一键部署脚本
```

## 🔧 配置修改

### 1. 后端修改 (`backend/index.js`)
- **CORS 配置**: 允许所有前端域名访问
- **端口配置**: 支持 Railway 环境变量

### 2. 前端修改 (`frontend/src/api.ts`)
- **API 地址**: 使用环境变量 `VITE_API_BASE_URL`
- **回退地址**: 开发环境使用 `http://localhost:3001/api`

## 🚀 部署步骤

### 第一步：准备 GitHub 仓库
```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 第二步：部署后端到 Railway
1. 访问 [Railway](https://railway.app)，GitHub 登录
2. 创建新项目 → "Deploy from GitHub repo"
3. 选择你的仓库，选择 `backend` 目录
4. 等待部署完成，复制提供的 URL

### 第三步：部署前端到 Vercel
1. 访问 [Vercel](https://vercel.com)，GitHub 登录
2. 导入仓库，选择 `frontend` 目录
3. 在环境变量中添加：
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `你的RailwayURL/api`
4. 点击部署

### 第四步：验证
访问 Vercel 提供的 URL，测试网站功能。

## ⚙️ 环境变量配置

### 前端环境变量 (Vercel)
| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| VITE_API_BASE_URL | API 基础地址 | `https://xxx.up.railway.app/api` |

### 后端环境变量 (Railway)
| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | Railway 自动设置 |

## 🐛 故障排除

### 问题：CORS 错误
**解决**：检查后端 CORS 配置，确保允许前端域名

### 问题：API 404 错误
**解决**：检查 `VITE_API_BASE_URL` 是否正确，确保以 `/api` 结尾

### 问题：数据库写入错误
**解决**：Railway 文件系统只读，需要迁移到 Railway PostgreSQL

## 📊 部署架构

```
用户浏览器
    ↓
Vercel (前端)
    ↓
Railway (后端 API)
    ↓
SQLite 数据库
```

## 💰 成本估算

| 服务 | 免费额度 | 预计成本 |
|------|----------|----------|
| Vercel | 100GB/月带宽 | $0 |
| Railway | $5/月额度 | $0 |
| **总计** | - | **$0** |

## 🛠️ 一键部署脚本

运行部署脚本检查环境：
```bash
./deploy.sh
```

脚本会：
1. 检查 Git、Node.js 环境
2. 验证项目结构
3. 显示部署步骤

## 📞 技术支持

- **项目文档**: 查看 `DEPLOYMENT.md`
- **Vercel 帮助**: [docs.vercel.com](https://vercel.com/docs)
- **Railway 帮助**: [docs.railway.app](https://docs.railway.app)

---

## ✅ 部署完成检查清单

- [ ] 代码已推送到 GitHub
- [ ] Railway 后端部署完成
- [ ] 复制了 Railway URL
- [ ] Vercel 前端部署完成
- [ ] 配置了 `VITE_API_BASE_URL` 环境变量
- [ ] 网站功能测试通过

**恭喜！你的 Find Tab 已准备好上线部署！**