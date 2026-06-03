# 🚀 快速入门指南

## 5分钟快速启动

### 步骤 1：安装 Unity

1. 下载 Unity Hub：https://unity.com/download
2. 安装 Unity 2022.3 LTS
3. **重要**：在安装时勾选 **WebGL Build Support**

### 步骤 2：打开项目

1. 启动 Unity Hub
2. 点击 "Open" → 选择 `unity3d` 文件夹
3. 等待资源导入完成（约 2-5 分钟）

### 步骤 3：启动后端服务器

```bash
cd /workspace/backend
npm install
npm start
```

服务器将在 http://localhost:3001 运行

### 步骤 4：在 Unity 中运行游戏

1. 在 Unity Editor 中打开项目
2. 在 Project 窗口找到 `Assets/Scenes/`
3. 双击打开 `MainScene.unity`
4. 点击 Unity Editor 顶部的 **▶ Play** 按钮

### 步骤 5：测试游戏

1. 游戏将在编辑器中运行
2. 使用演示账号登录：
   - 邮箱：`demo@example.com`
   - 密码：`test123`

## 🎮 控制说明

### 3D 场景控制

| 操作 | 按键/鼠标 |
|------|----------|
| 旋转视角 | 鼠标右键拖拽 |
| 缩放 | 滚轮 |
| 移动视角 | W/A/S/D |
| 选择对象 | 鼠标左键 |
| 查看提示 | 鼠标悬停 |

### UI 操作

- **登录/注册**：输入邮箱和密码
- **切换界面**：点击按钮导航
- **收集线索**：点击 3D 场景中的发光对象
- **识别疑点**：在财务面板中点击红色高亮项目

## 🔧 构建 WebGL

### 开发测试

1. File → Build Settings
2. 选择 WebGL 平台
3. 点击 Build & Run
4. 选择输出目录

### 生产部署

构建完成后，会生成：
```
build/
├── index.html
├── Build/
│   ├── index.html
│   └── ...
└── TemplateData/
```

上传到 Web 服务器即可访问！

## ❓ 常见问题

### Q: Unity 无法打开项目？
**A**: 确保安装了 Unity 2022.3 LTS 和 WebGL Build Support 模块

### Q: WebGL 构建失败？
**A**: 检查是否有足够的磁盘空间（至少需要 2GB 可用空间）

### Q: 游戏无法连接到后端？
**A**: 确保后端服务器在 http://localhost:3001 运行

### Q: 3D 场景显示异常？
**A**: 在 Unity Editor 中检查 Game 视图的分辨率设置

## 📦 包含的内容

✅ **完整的 C# 脚本系统**
- GameManager（游戏管理）
- NetworkManager（网络通信）
- UIManager（用户界面）
- Scene3DManager（3D 场景）
- ClueObject（线索交互）

✅ **3D 场景资源**
- 办公室环境示例
- 可交互对象
- 材质和纹理

✅ **UI 系统**
- 登录/注册界面
- 游戏主界面
- 案件调查界面
- 财务分析面板

✅ **后端集成**
- JWT 认证
- 进度保存
- 用户管理

## 🎯 下一步

- 阅读完整 README.md 文档
- 自定义 3D 场景和对象
- 添加更多游戏内容
- 部署到 Web 服务器

---

**有问题？** 查看 README.md 或提交 Issue！
