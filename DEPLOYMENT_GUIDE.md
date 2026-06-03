# Find Mr.W - 完整部署指南

## 🎉 项目已准备就绪！

您的 "寻找 W 先生" 财务造假识别游戏已经完成了前后端分离架构！

## 📋 项目概述

### 技术栈
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express.js
- **状态管理**: Zustand
- **路由**: React Router
- **部署平台**: Vercel

### 项目结构
```
/workspace/
├── backend/              # Express.js 后端 API
│   ├── index.js         # API 服务器
│   ├── data.js          # 游戏数据
│   └── package.json
├── src/
│   ├── api/             # API 客户端
│   ├── pages/           # 页面组件
│   ├── store/           # Zustand 状态管理
│   └── types/           # TypeScript 类型
├── vercel.json          # Vercel 配置
└── package.json
```

## 🚀 部署步骤

### 第一步：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录您的账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `find-mr-w-game`（或您喜欢的名称）
   - Description: "寻找 W 先生 - 财务造假识别角色扮演游戏"
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 第二步：推送代码到 GitHub

在您的终端中运行以下命令（复制 GitHub 页面显示的命令）：

```bash
# 添加远程仓库
git remote add origin https://github.com/您的用户名/您的仓库名.git

# 重命名分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

### 第三步：部署到 Vercel

#### 方法一：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New..." → "Project"
4. 选择您刚创建的 GitHub 仓库
5. 配置项目（保持默认设置即可）
6. 点击 "Deploy"
7. 等待 1-2 分钟，部署完成后您会获得一个链接！

#### 方法二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel
```

## 🎮 本地开发

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd backend && npm install && cd ..
```

### 启动开发服务器

```bash
# 方式一：同时启动前后端
npm run dev:all

# 方式二：分别启动
# 终端 1 - 启动后端（端口 3001）
npm run dev:backend

# 终端 2 - 启动前端（端口 5173）
npm run dev
```

## 🌐 API 端点

部署后，您的 API 将可通过以下端点访问：

- `GET /api/health` - 健康检查
- `GET /api/cases` - 获取所有案件
- `GET /api/cases/:id` - 获取特定案件
- `GET /api/skills` - 获取技能列表

## 📝 已完成的功能

✅ 完整的角色扮演游戏
✅ 前后端分离架构
✅ 响应式 UI 设计
✅ 游戏进度本地存储
✅ 案件系统（3个案件）
✅ 线索收集机制
✅ 财务报表分析
✅ 技能升级系统
✅ Vercel 部署配置
✅ Git 仓库初始化

## 🔧 自定义修改

### 添加新案件

编辑 `/workspace/backend/data.js` 文件，在 `cases` 数组中添加新案件。

### 修改样式

编辑组件文件，使用 Tailwind CSS 类名来自定义样式。

## 💡 提示

- 首次部署后，Vercel 会自动为您的项目分配一个域名
- 每次推送到 GitHub，Vercel 会自动重新部署
- 游戏进度保存在玩家的浏览器本地存储中

## 🎯 下一步

1. 创建 GitHub 仓库
2. 推送代码
3. 部署到 Vercel
4. 分享您的游戏链接给朋友！

---

如有问题，请查看 `README.md` 和 `DEPLOYMENT.md` 获取更多详细信息。
