#!/bin/bash

echo "🚀 开始Firebase部署流程..."

# 检查是否安装了Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI未安装，正在安装..."
    npm install -g firebase-tools
fi

# 检查是否已登录Firebase
if ! firebase projects:list &> /dev/null; then
    echo "🔐 请登录Firebase..."
    firebase login
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run firebase:build

# 部署到Firebase
echo "🚀 部署到Firebase..."
npm run firebase:deploy

echo "✅ 部署完成！"
echo "🌐 您的网站现在可以在Firebase Hosting上访问了"
echo "📊 查看Firebase控制台：https://console.firebase.google.com/project/qx-net-next-js" 