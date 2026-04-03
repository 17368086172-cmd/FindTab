# Find Tab 部署指南

使用 Vercel + Railway 进行部署，完全免费。

## 部署步骤

### 第一步：准备代码仓库

1. 将代码推送到 GitHub 仓库
2. 确保仓库结构如下：
   ```
   Find Tab/
   ├── frontend/    # React 前端
   └── backend/     # Node.js 后端
   ```

### 第二步：部署后端到 Railway

1. **访问 [Railway](https://railway.app)**，用 GitHub 登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库，选择 `backend` 目录
4. Railway 会自动检测 Node.js 项目并部署
5. 部署完成后，Railway 会提供一个 URL，如：
   ```
   https://your-project-name.up.railway.app
   ```
6. **复制这个 URL**，后面会用到

### 第三步：部署前端到 Vercel

1. **访问 [Vercel](https://vercel.com)**，用 GitHub 登录
2. 点击 "Add New..." → "Project"
3. 导入你的 GitHub 仓库
4. 选择 `frontend` 目录作为项目根目录
5. 在 "Environment Variables" 部分，添加：
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-project-name.up.railway.app/api`（替换为你的 Railway URL）
6. 点击 "Deploy"
7. 部署完成后，Vercel 会提供一个 URL，如：
   ```
   https://find-tab.vercel.app
   ```

### 第四步：验证部署

1. 访问你的 Vercel 前端 URL
2. 网站应该能正常加载
3. 测试搜索功能、卡片点击等功能
4. 如果遇到 CORS 错误，检查后端 CORS 配置

## 配置说明

### 后端配置 (Railway)

- **端口**: Railway 会自动设置 `PORT` 环境变量
- **数据库**: 当前使用 SQLite 文件，Railway 会保留文件
- **CORS**: 已配置允许所有来源访问

### 前端配置 (Vercel)

- **环境变量**: 通过 Vercel Dashboard 设置
- **构建命令**: `npm run build`
- **输出目录**: `dist`

## 常见问题

### 1. CORS 错误
**症状**: 前端无法访问后端 API
**解决**: 检查后端 CORS 配置，确保允许前端域名

### 2. API 404 错误
**症状**: 前端显示 API 请求失败
**解决**: 检查 `VITE_API_BASE_URL` 是否正确，确保 URL 以 `/api` 结尾

### 3. 数据库写入错误
**症状**: 收藏、历史等功能失效
**解决**: Railway 的文件系统是只读的，需要修改为使用 Railway 的 PostgreSQL 数据库

### 4. 冷启动延迟
**症状**: 首次访问较慢
**解决**: 免费服务正常现象，可考虑升级到付费计划

## 高级配置

### 使用 Railway PostgreSQL 数据库

1. 在 Railway Dashboard 添加 PostgreSQL 插件
2. 修改 `backend/database.js` 使用 PostgreSQL 连接
3. 重新部署后端

### 绑定自定义域名

**Vercel**:
1. 在 Vercel Dashboard → Settings → Domains
2. 添加你的域名
3. 按照提示配置 DNS

**Railway**:
1. 在 Railway Dashboard → Settings → Domains
2. 添加自定义域名
3. 配置 CNAME 记录

## 监控和维护

### 查看日志
- **Vercel**: Dashboard → Logs
- **Railway**: Dashboard → Logs

### 监控性能
- **Vercel**: Analytics 面板
- **Railway**: Metrics 面板

## 成本估算

- **Vercel**: 免费（每月 100GB 带宽）
- **Railway**: 免费（每月 $5 额度）
- **总计**: 完全免费

## 技术支持

如有问题，请参考：
- [Vercel 文档](https://vercel.com/docs)
- [Railway 文档](https://docs.railway.app)
- [项目 GitHub Issues](https://github.com/your-username/find-tab/issues)

---

**部署完成！** 你的 Find Tab 现在已上线，可以通过 Vercel 提供的 URL 访问。