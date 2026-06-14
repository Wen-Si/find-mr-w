# Find Mr.W - 部署指南

## 问题说明

GitHub Pages 只能托管静态前端文件，无法运行后端API服务器。因此，注册和登录功能需要独立的后端服务。

## 解决方案：使用 Railway.app 部署后端

Railway.app 提供免费的 Hobby 计划，支持 Node.js 应用部署。

### 第一步：部署后端到 Railway

1. **访问 Railway.app**
   - 打开浏览器，访问 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 授权 Railway 访问你的 GitHub 仓库

3. **选择后端仓库**
   - 选择 `find-mr-w` 仓库
   - Railway 会自动检测到 Node.js 应用

4. **配置环境变量（可选）**
   - Railway 会自动设置 `PORT` 环境变量
   - 如果需要自定义 JWT 密钥，可以添加 `JWT_SECRET` 环境变量

5. **等待部署完成**
   - Railway 会自动安装依赖并启动服务
   - 部署完成后，你会获得一个公共URL，例如：
     `https://find-mr-w-backend.up.railway.app`

6. **验证后端服务**
   - 访问 `https://find-mr-w-backend.up.railway.app/api/health`
   - 如果返回 `{"status":"ok"}`，说明后端部署成功

### 第二步：配置前端环境变量

1. **创建生产环境配置文件**
   ```bash
   # 在项目根目录创建 .env 文件
   cp .env.example .env
   ```

2. **修改 .env 文件**
   ```
   # 将 YOUR_BACKEND_URL 替换为 Railway 提供的后端地址
   VITE_API_URL=https://find-mr-w-backend.up.railway.app/api
   ```

### 第三步：重新构建前端

1. **安装依赖**（如果还没有）
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **构建生产版本**
   ```bash
   npm run build
   ```

3. **部署到 GitHub Pages**
   ```bash
   # 如果使用 GitHub Actions
   git add .
   git commit -m "Add production API URL"
   git push origin master

   # 或者手动部署
   npm run deploy
   ```

## 备选方案：其他免费后端托管服务

如果 Railway 不满足需求，可以考虑：

1. **Render.com**
   - 提供 Free Tier
   - 部署方式类似 Railway
   - URL 格式：`https://your-app.onrender.com`

2. **Fly.io**
   - 提供免费额度
   - 需要安装 flyctl CLI
   - 适合全球部署

3. **Heroku**
   - 提供 Free Tier
   - 需要信用卡（免费）
   - 即将停止免费计划

## 本地开发测试

如果只是想在本地测试：

1. **启动后端**
   ```bash
   cd backend
   npm start
   # 后端运行在 http://localhost:3001
   ```

2. **启动前端（开发模式）**
   ```bash
   npm run dev
   # 前端运行在 http://localhost:5173
   # Vite 代理会自动转发 /api 请求到后端
   ```

## 故障排除

### 问题：注册时出现 "Unexpected token '<'"
- **原因**：前端请求的 API 地址无法访问
- **解决**：确保后端已部署并配置了正确的 VITE_API_URL

### 问题：Railway 部署失败
- 检查 GitHub 仓库是否包含完整的 backend 代码
- 查看 Railway 部署日志
- 确保 package.json 中的 start 脚本正确

### 问题：CORS 错误
- Railway 部署的后端会自动配置 CORS
- 如果遇到 CORS 问题，检查后端是否正确设置了 CORS 中间件

## 技术架构

```
用户浏览器
    ↓
GitHub Pages (前端静态文件)
    ↓ (API 请求)
Railway (后端 API 服务器)
    ↓
JSON 数据存储 (Railway 提供的临时存储)
```

## 注意事项

- Railway 的免费计划有月度使用限制（500小时/月）
- 长时间不活跃的应用可能会进入休眠状态
- 数据存储在 Railway 实例中，重启后会丢失（适合开发测试）
- 建议后续迁移到云数据库（如 MongoDB Atlas）以持久化数据

## 获取帮助

如果遇到问题：
1. 查看 Railway 部署日志
2. 检查浏览器控制台错误信息
3. 验证后端 API 是否正常工作
