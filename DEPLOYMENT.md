# 部署指南

## GitHub 部署

1. 在 GitHub 上创建一个新仓库
2. 初始化本地 Git 仓库：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Vercel 部署

### 方法 1: Vercel Dashboard (推荐)

1. 访问 [vercel.com](https://vercel.com) 并使用 GitHub 账号登录
2. 点击 "New Project"
3. 选择您的 GitHub 仓库
4. 配置项目：
   - 保持默认设置
   - Vercel 会自动检测项目类型
5. 点击 "Deploy"

### 方法 2: Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

## 本地开发

1. 安装所有依赖：
```bash
npm install
npm run install:backend
```

2. 启动开发服务器：
```bash
# 单独启动前端
npm run dev

# 单独启动后端
npm run dev:backend

# 同时启动两者
npm run dev:all
```

## 项目架构

```
├── backend/          # Express.js 后端 API
│   ├── index.js
│   ├── data.js
│   └── package.json
├── src/             # React 前端
│   ├── api/
│   ├── pages/
│   ├── store/
│   └── types/
└── vercel.json      # Vercel 配置
```
