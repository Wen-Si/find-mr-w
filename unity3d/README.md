# 🎮 寻找W先生 - Unity 3D WebGL 版本

基于 Unity 2022.3.15f1 构建的 3D 财务侦探游戏

## 📋 项目概述

这是一个将原有 React Web 版本游戏完全重写为 Unity 3D WebGL 的项目。

### 技术规格

- **游戏引擎**：Unity 2022.3 LTS
- **目标平台**：WebGL
- **编程语言**：C#
- **渲染管线**：Built-in Render Pipeline
- **物理引擎**：Unity Physics

### 系统要求

- **最低配置**：
  - 处理器：Intel Core i5 或同等处理器
  - 内存：4GB RAM
  - 显卡：支持 WebGL 2.0
  - 存储空间：500MB
  - 浏览器：Chrome, Firefox, Safari, Edge 最新版本

## 🏗️ 项目架构

### 目录结构

```
unity3d/
├── Assets/
│   ├── Scripts/
│   │   ├── Core/          # 核心游戏系统
│   │   │   ├── GameManager.cs       # 游戏管理器（单例）
│   │   │   └── GameModels.cs        # 数据模型定义
│   │   ├── Network/       # 网络通信
│   │   │   └── NetworkManager.cs     # HTTP 请求管理
│   │   ├── UI/            # 用户界面
│   │   │   ├── UIManager.cs         # UI 管理器
│   │   │   └── FinancialPanelManager.cs  # 财务分析面板
│   │   ├── Gameplay/      # 游戏玩法
│   │   │   ├── Scene3DManager.cs     # 3D 场景管理
│   │   │   └── ClueObject.cs         # 线索交互对象
│   │   └── Utils/         # 工具类
│   ├── Prefabs/           # 预制体
│   ├── Materials/         # 材质
│   ├── Textures/          # 纹理贴图
│   ├── Audio/             # 音频文件
│   └── Scenes/            # Unity 场景文件
├── Packages/
│   └── manifest.json      # Unity 包管理器配置
└── ProjectSettings/
    └── ProjectSettings.json  # 项目设置
```

### 核心系统

#### 1. GameManager（游戏管理器）

**职责**：
- 管理游戏状态（登录、游戏进度）
- 处理用户认证
- 加载和保存游戏数据
- 协调各系统间的通信

**关键功能**：
- 用户登录/注册
- 游戏进度管理
- 线索收集
- 疑点识别
- 案件完成

#### 2. NetworkManager（网络管理器）

**职责**：
- 处理所有 HTTP 请求
- 管理认证令牌
- 与后端 API 通信

**API 端点**：
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息
- `GET /api/game/cases` - 获取所有案件
- `GET /api/game/progress` - 获取游戏进度
- `POST /api/game/complete` - 完成案件

#### 3. Scene3DManager（3D 场景管理器）

**职责**：
- 管理 3D 场景
- 处理相机控制
- 对象交互检测

**相机控制**：
- 鼠标右键拖拽：旋转视角
- 滚轮：缩放
- WASD 键：移动视角

#### 4. UIManager（UI 管理器）

**职责**：
- 管理所有 UI 界面
- 处理用户输入
- 显示游戏信息

**UI 界面**：
- 开场动画界面
- 登录/注册界面
- 游戏主界面
- 案件调查界面

## 🎯 游戏玩法

### 1. 用户认证

玩家首次进入游戏需要：
1. 注册新账号或登录现有账号
2. 填写用户名、邮箱、密码
3. 完成认证后进入游戏主界面

### 2. 案件调查

#### 3D 场景探索
- 在 3D 办公室环境中移动
- 点击可交互对象收集线索
- 鼠标悬停高亮显示可交互物品

#### 财务分析
- 切换查看三种财务报表：
  - 资产负债表
  - 利润表
  - 现金流量表
- 点击可疑项目识别造假点
- 需要先收集相关线索才能发现某些疑点

### 3. 进度系统

- **经验值**：完成任务获得
- **等级**：经验值积累提升
- **技能**：达到等级解锁
- **线索**：收集关于 W 先生的线索

## 🔧 构建指南

### 环境准备

1. **安装 Unity Hub**
   - 下载地址：https://unity.com/download
   - 安装 Unity 2022.3.15f1 或更高版本

2. **安装 Unity 版本**
   - 打开 Unity Hub
   - 点击 "Installs"
   - 点击 "Add"
   - 选择 Unity 2022.3 LTS 版本
   - 确保选中 "WebGL Build Support" 模块

### 打开项目

1. 克隆仓库
   ```bash
   git clone [repository-url]
   cd unity3d
   ```

2. 打开 Unity Hub
   - 点击 "Open"
   - 选择 `unity3d` 文件夹
   - 项目将出现在列表中
   - 点击打开项目

3. 等待 Unity 导入资源
   - 首次打开需要导入所有资源
   - 可能需要几分钟时间

### 项目配置

#### WebGL 设置

1. 打开 **Edit > Project Settings > Player**
2. 选择 **WebGL** 标签
3. 配置以下选项：
   - Company Name: FindMrWGame
   - Product Name: Find Mr.W - Financial Detective Game
   - Default Canvas Width: 960
   - Default Canvas Height: 600
   - Memory Size: 512MB

#### Quality 设置

1. 打开 **Edit > Project Settings > Quality**
2. 为 WebGL 选择合适的质量等级
3. 建议：
   - Texture Quality: Half Res
   - Anisotropic Textures: Disabled
   - Anti Aliasing: 2x

### 构建游戏

#### 开发构建（快速测试）

1. 在 Unity Editor 中直接运行
   - 点击 Play 按钮
   - 游戏将在编辑器中运行

#### 发布构建

1. 构建 WebGL
   - 点击 **File > Build Settings**
   - 选择 **WebGL** 平台
   - 点击 **Build**
   - 选择输出目录
   - 等待构建完成

2. 构建输出
   - 生成的文件：
     - `index.html` - 主页面
     - `Build/` - 游戏数据
     - `TemplateData/` - 模板资源

### 部署

#### 本地测试

使用本地服务器测试构建结果：

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```

访问：`http://localhost:8000`

#### 服务器部署

1. 上传构建文件到 Web 服务器
2. 配置服务器支持 .htaccess 和 gzip 压缩
3. 确保服务器正确提供所有文件类型

#### Vercel/Netlify 部署

1. 创建 `vercel.json` 或 `netlify.toml`
2. 配置构建命令
3. 推送到 Git 仓库
4. 自动部署

## 🎨 3D 美术规范

### 场景设置

- **场景尺寸**：20x20 单位地面
- **相机距离**：5-20 单位
- **光照**：一个 Directional Light + Ambient Light
- **雾效**：轻微深度雾增强层次感

### 材质规范

- 使用 Standard Shader
- 启用 GPU Instancing
- 合理使用 LOD
- 纹理最大尺寸：1024x1024

### 对象交互

- 所有可交互对象添加 `ClueObject` 组件
- 使用发光效果提示交互
- 交互半径：2 单位

## 🔌 后端集成

### API 配置

游戏需要后端服务器运行在 `http://localhost:3001`

确保后端提供以下端点：
- POST `/api/auth/login`
- POST `/api/auth/register`
- GET `/api/auth/me`
- GET `/api/game/cases`
- GET `/api/game/progress`
- POST `/api/game/complete`

### 认证流程

1. 玩家登录后获取 JWT 令牌
2. 所有后续请求携带令牌
3. 令牌存储在 PlayerPrefs
4. 游戏启动时验证令牌

## 📝 开发注意事项

### WebGL 特定问题

1. **跨域问题**
   - 确保后端配置 CORS
   - 开发时使用本地服务器

2. **内存限制**
   - WebGL 默认内存限制 2GB
   - 优化纹理和模型大小
   - 使用内存分析器监控

3. **性能优化**
   - 减少 Draw Calls
   - 使用对象池
   - 优化着色器

### Unity 特定建议

1. **场景管理**
   - 使用 Addressables 管理资源
   - 实现场景异步加载
   - 管理好场景切换

2. **数据持久化**
   - PlayerPrefs 用于小数据
   - 考虑使用云存储

3. **错误处理**
   - 实现全局异常捕获
   - 网络请求超时处理
   - 提供用户友好的错误提示

## 🐛 调试技巧

### Unity Editor 调试

1. **Console 窗口**：查看日志和错误
2. **Profiler**：分析性能瓶颈
3. **Frame Debugger**：查看渲染调用

### WebGL 调试

1. **浏览器开发者工具**
   - Console 面板查看日志
   - Network 面板查看请求
   - Memory 面板分析内存

2. **Unity Remote**（可选）
   - 连接真机调试

## 📚 参考资源

### Unity 文档
- Unity 官方文档：https://docs.unity3d.com/
- WebGL 构建文档：https://docs.unity3d.com/Manual/webgl.html

### 相关工具
- Unity Asset Store：获取美术资源
- TextMeshPro：高质量文本渲染

## 🚀 未来计划

- [ ] 添加更多 3D 场景
- [ ] 实现成就系统
- [ ] 添加音效和背景音乐
- [ ] 优化移动端触控操作
- [ ] 实现排行榜功能
- [ ] 添加社交分享功能

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

---

**开发团队**：财务侦探工作室  
**版本**：1.0.0  
**最后更新**：2024年
