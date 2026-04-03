#!/bin/bash

# Find Tab 一键部署脚本
# 使用 Vercel + Railway 部署

echo "🚀 Find Tab 部署脚本"
echo "======================"

# 检查是否已安装必要的工具
echo "🔍 检查环境..."

if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ 环境检查通过"

# 检查项目结构
echo "📁 检查项目结构..."

if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ 项目结构不正确，请确保 frontend/ 和 backend/ 目录存在"
    exit 1
fi

echo "✅ 项目结构正确"

# 显示部署步骤
echo ""
echo "📋 部署步骤："
echo "1. 将代码推送到 GitHub 仓库"
echo "2. 访问 https://railway.app 部署后端"
echo "3. 访问 https://vercel.com 部署前端"
echo "4. 配置环境变量"
echo ""
echo "📚 详细步骤请查看 DEPLOYMENT.md 文件"
echo ""

# 检查 Git 仓库状态
echo "🔍 检查 Git 状态..."

if [ ! -d ".git" ]; then
    echo "⚠️  当前目录不是 Git 仓库"
    echo "建议："
    echo "  git init"
    echo "  git add ."
    echo "  git commit -m 'Initial commit'"
    echo "  git remote add origin <你的仓库URL>"
    echo "  git push -u origin main"
else
    git status
fi

echo ""
echo "🎯 下一步操作："
echo "1. 创建 GitHub 仓库（如果还没有）"
echo "2. 将代码推送到 GitHub："
echo "   git remote add origin https://github.com/你的用户名/你的仓库名.git"
echo "   git push -u origin main"
echo "3. 按照 DEPLOYMENT.md 的步骤部署到 Railway 和 Vercel"
echo ""
echo "💡 提示："
echo "- Railway 后端部署后，会获得一个 URL（如：https://xxx.up.railway.app）"
echo "- 在 Vercel 部署前端时，设置环境变量 VITE_API_BASE_URL 为 Railway URL + /api"
echo "- 例如：VITE_API_BASE_URL=https://xxx.up.railway.app/api"
echo ""
echo "✅ 脚本执行完成！"