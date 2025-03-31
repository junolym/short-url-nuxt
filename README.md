> 本项目适合前端/全栈开发练手，也可用于测试AI代码生成，探索零代码实践。

### 为什么选择这个项目？

- 🌟 **简单实用**：短链接是一个容易理解又实用的功能，可用于短信/邮件推广，二维码简化等场景
- 🎯 **全栈实践**：涵盖前端UI、后端API和CRUD数据库操作
- 🧩 **扩展丰富**：可以根据需要添加更多功能，如二维码生成、用户认证、统计分析等

---

# 短链接生成器

一个使用Nuxt.js构建的现代化短链接生成和管理系统。

## 功能特性

- 🔗 生成短链接
- 📊 管理和跟踪链接
- 🎨 现代化UI界面
- 📱 响应式设计
- 🚀 快速重定向
- 🔒 安全可靠

## 技术栈

- **前端框架**: [Nuxt 3](https://nuxt.com/)
- **UI框架**: [@nuxt/ui](https://ui.nuxt.com/)
- **数据库**: SQLite3
- **开发语言**: TypeScript

## 本地开发

### 前置要求

- Node.js 18.x 或更高版本
- npm 9.x 或更高版本

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## Docker部署

### 使用Docker Compose

1. 构建并启动容器：

```bash
docker compose up -d
```

2. 停止服务：

```bash
docker compose down
```

### 手动Docker操作

1. 构建镜像：

```bash
docker build -t short-url-app .
```

2. 运行容器：

```bash
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data short-url-app
```

## 项目结构

```
.
├── app.vue              # 应用入口
├── components/         # 组件目录
├── pages/             # 页面目录
│   ├── index.vue      # 主页
│   └── manage.vue     # 管理页面
├── server/            # 服务器端代码
│   ├── api/          # API路由
│   └── utils/        # 工具函数
├── public/           # 静态资源
└── nuxt.config.ts    # Nuxt配置文件
```

## 环境变量

创建 `.env` 文件并设置以下变量：

```env
# 应用配置
BASE_URL=http://localhost:3000

# 数据库配置
DB_PATH=./data/urls.db
```

## 许可证

[MIT](LICENSE)