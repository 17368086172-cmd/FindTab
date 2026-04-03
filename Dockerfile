FROM node:20-alpine

WORKDIR /app

# 安装Python和构建工具，并创建python符号链接
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# 复制package.json文件
COPY backend/package*.json ./

# 安装依赖
RUN npm config set python /usr/bin/python && \
    npm install

# 复制后端代码
COPY backend/ ./

# 暴露端口
EXPOSE 3001

# 启动应用
CMD ["node", "index.js"]