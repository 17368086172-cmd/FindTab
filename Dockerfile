FROM node:20

WORKDIR /app

# 复制package.json文件
COPY backend/package*.json ./

# 安装依赖 - node:20镜像已经包含了Python和构建工具
RUN npm install

# 复制后端代码
COPY backend/ ./

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "index.js"]