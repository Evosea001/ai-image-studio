# 🎨 AI 风格迁移 - AI Image Studio

> 一张照片，百变风格 — 基于火山引擎 Ark API (豆包 Seedream 4.5) 的 AI 图片风格迁移工具

上传你的照片，选择心仪的艺术风格，AI 在几秒钟内将照片转化为漫画、油画、素描、赛博朋克等不同风格的艺术作品。支持前后对比滑块、作品画廊管理与下载。

---

## ✨ 功能特性

支持 **6 种 AI 艺术风格**，每种风格都有专属的 Prompt 提示词驱动豆包大模型生成：

| 风格 | 说明 | 风格 ID |
|------|------|---------|
| 🎌 **日系漫画** | 鲜明的色块和轮廓线，保留人物特征，经典动漫质感 | `comic` |
| 💎 **3D 渲染** | 细腻的光影效果，CG 质感，高精度细节渲染 | `3d` |
| 🎨 **古典油画** | 厚重的笔触质感，温暖色调，艺术大师风格 | `oil` |
| ✏️ **精细素描** | 黑白灰层次分明，铅笔手绘质感 | `sketch` |
| 🌆 **赛博朋克** | 霓虹灯光效，暗色调，未来科技感 | `cyberpunk` |
| 🖌️ **水彩画** | 柔和的色彩晕染，透明层次，留白艺术 | `watercolor` |

其他功能：

- **📤 图片上传** — 支持点击上传与拖拽上传，JPG / PNG / WebP，最大 30MB
- **🔐 用户认证** — 邮箱密码注册登录，JWT Session，未登录用户不可使用
- **📊 前后对比** — 拖动滑块实时对比原图与生成结果
- **🖼️ 作品画廊** — 查看历史生成作品，支持下载与删除
- **📱 响应式设计** — 桌面端与移动端自适应布局

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | [Next.js](https://nextjs.org/) 16.2.6 (App Router) |
| **UI 框架** | [React](https://react.dev/) 19.2.4 |
| **语言** | [TypeScript](https://www.typescriptlang.org/) 5.x |
| **样式** | [Tailwind CSS](https://tailwindcss.com/) v4 |
| **数据库 ORM** | [Prisma](https://www.prisma.io/) 7.8.0 |
| **数据库** | [SQLite](https://www.sqlite.org/)（开发）/ [Turso](https://turso.tech/)（生产/libSQL） |
| **认证** | [NextAuth.js](https://next-auth.js.org/) v5 (beta) — Credentials 邮箱密码 |
| **AI API** | [火山引擎 Ark](https://www.volcengine.com/product/ark) — 豆包 Seedream 4.5 图像生成模型 |
| **文件存储** | [Uploadthing](https://uploadthing.com/)（依赖，当前未深度集成） |
| **部署** | [Docker](https://www.docker.com/) — 多阶段构建，Alpine 镜像 |
| **表单校验** | [Zod](https://zod.dev/) 4.x |
| **通知** | [react-hot-toast](https://react-hot-toast.com/) |
| **图标** | [react-icons](https://react-icons.github.io/react-icons/) (Feather Icons) |

---

## 🚀 快速开始

### 前置要求

- Node.js 22+ (推荐 22 LTS)
- npm 10+
- 火山引擎 Ark API 密钥（[点此申请](https://console.volcengine.com/ark)）
- （可选）Docker 与 Docker Compose

### 1. 克隆并安装依赖

```bash
git clone <your-repo-url> ai-image-studio
cd ai-image-studio
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入必要的配置（详见下方[环境变量配置](#-环境变量配置)章节）。

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 5. 构建与生产启动

```bash
npm run build
npm start
```

### Docker 部署

```bash
# 构建镜像
docker build -t ai-image-studio .

# 运行容器
docker run -d \
  --name ai-image-studio \
  -p 3000:3000 \
  -e ARK_API_KEY=your-key \
  -e DATABASE_URL=file:./data/dev.db \
  -e AUTH_SECRET=your-secret \
  -e UPLOADTHING_TOKEN=your-token \
  ai-image-studio
```

> 注意：若使用 Docker 部署 SQLite，建议挂载数据卷持久化数据库文件：
> `-v ./data:/app/prisma/data`

---

## 🔐 环境变量配置

项目需要配置以下 7 个环境变量（创建 `.env` 文件于项目根目录）：

| 变量名 | 必填 | 说明 | 示例值 |
|--------|------|------|--------|
| `ARK_API_KEY` | ✅ | 火山引擎 Ark API 密钥，用于调用豆包 Seedream 4.5 图像生成模型 | `sk-xxxxxxxxxxxx` |
| `DATABASE_URL` | ✅ | 数据库连接地址。开发环境使用本地 SQLite 文件；生产环境可改用 Turso/libSQL 远程数据库 | `file:./dev.db` |
| `TURSO_AUTH_TOKEN` | ❌ | Turso 数据库认证令牌。仅在连接 Turso 远程数据库时需要 | `eyJhbGciOiJ...` |
| `AUTH_SECRET` | ✅ | NextAuth JWT 加密密钥。可使用 `openssl rand -base64 32` 生成 | `zX8p...Kw==` |
| `UPLOADTHING_TOKEN` | ✅ | Uploadthing 存储服务令牌（项目依赖，当前暂未深度集成主线流程） | `sk_live_...` |
| `AUTH_URL` | ❌ | NextAuth 回调 URL，生产部署时建议设置 | `https://your-domain.com` |
| `NEXTAUTH_URL` | ❌ | NextAuth 基础 URL，某些部署环境中需要显式指定 | `https://your-domain.com` |

### 获取各密钥

- **ARK_API_KEY** — 前往 [火山引擎控制台 > 密钥管理](https://console.volcengine.com/ark) 创建 API Key
- **AUTH_SECRET** — 终端执行 `openssl rand -base64 32` 生成
- **UPLOADTHING_TOKEN** — 前往 [Uploadthing Dashboard](https://uploadthing.com/dashboard) 创建
- **TURSO_AUTH_TOKEN** — 前往 [Turso 控制台](https://turso.tech/) 数据库详情页获取

---

## 📡 API 路由说明

| 方法 | 路由 | 认证 | 描述 |
|------|------|------|------|
| `POST` | `/api/auth/[...nextauth]` | ❌ | NextAuth 认证处理（登录/登出/会话） |
| `POST` | `/api/register` | ❌ | 用户注册（name, email, password） |
| `POST` | `/api/generate` | ✅ | AI 风格迁移生成（image base64, style id） |
| `GET` | `/api/images` | ✅ | 获取当前用户的所有作品列表 |
| `DELETE` | `/api/images/[id]` | ✅ | 删除指定作品（仅限本人） |

### 接口详情

#### `POST /api/generate`

请求体：

```json
{
  "image": "data:image/png;base64,...",
  "style": "cyberpunk"
}
```

成功响应：

```json
{
  "id": "clx...",
  "resultUrl": "https://...",
  "style": "cyberpunk"
}
```

#### `GET /api/images`

成功响应：

```json
[
  {
    "id": "clx...",
    "resultUrl": "https://...",
    "style": "cyberpunk",
    "createdAt": "2025-06-02T10:00:00.000Z"
  }
]
```

---

## 📁 项目结构

```
ai-image-studio/
├── Dockerfile                    # Docker 多阶段构建配置
├── .env.example                  # 环境变量模板
├── package.json                  # 项目依赖与脚本
├── tsconfig.json                 # TypeScript 配置
├── next.config.js                # Next.js 配置
│
├── prisma/
│   ├── schema.prisma             # 数据库模型定义 (User, Image)
│   └── migrations/               # 数据库迁移文件
│
├── public/                       # 静态资源
│
└── src/
    ├── app/                      # Next.js App Router 页面
    │   ├── layout.tsx            # 根布局 (Navbar + Providers + Toaster)
    │   ├── providers.tsx         # SessionProvider 包装
    │   ├── globals.css           # Tailwind v4 全局样式
    │   ├── page.tsx              # 首页 — 欢迎页 + 风格概览
    │   │
    │   ├── generate/
    │   │   └── page.tsx          # 创作页 — 上传 → 选风格 → 生成 → 对比
    │   │
    │   ├── gallery/
    │   │   └── page.tsx          # 作品画廊 — 查看/下载/删除历史作品
    │   │
    │   ├── login/
    │   │   └── page.tsx          # 登录页 — 邮箱密码登录
    │   │
    │   ├── register/
    │   │   └── page.tsx          # 注册页 — 邮箱密码注册
    │   │
    │   └── api/
    │       ├── auth/
    │       │   └── [...nextauth]/
    │       │       └── route.ts  # NextAuth API 路由
    │       ├── register/
    │       │   └── route.ts      # 注册 API
    │       ├── generate/
    │       │   └── route.ts      # AI 生成 API (调用火山引擎 Ark)
    │       └── images/
    │           ├── route.ts      # 获取作品列表 API
    │           └── [id]/
    │               └── route.ts  # 删除作品 API
    │
    ├── components/
    │   ├── Navbar.tsx            # 顶部导航栏 (响应式)
    │   ├── ImageUploader.tsx     # 图片上传组件 (拖拽+点击)
    │   ├── StyleSelector.tsx     # 风格选择器 (6种风格网格)
    │   ├── CompareSlider.tsx     # 前后对比滑块
    │   └── ImageCard.tsx         # 作品卡片 (下载+删除)
    │
    ├── lib/
    │   ├── auth.ts               # NextAuth 配置 (Credentials + JWT)
    │   └── prisma.ts             # Prisma 客户端初始化 (libSQL 适配器)
    │
    ├── proxy.ts                  # 路由中间件配置 (保护 /generate, /gallery)
    │
    └── generated/
        └── prisma/               # Prisma 自动生成的客户端代码
```

---

## ⚠️ 注意事项

### 💾 数据库选择

- **开发环境**：默认使用 SQLite (`file:./dev.db`)，无需额外配置数据库服务，开箱即用
- **生产环境**：推荐使用 [Turso](https://turso.tech/)（基于 libSQL 的边缘数据库），配置 `DATABASE_URL` 为 Turso 远程地址并设置 `TURSO_AUTH_TOKEN`
- 若使用 PostgreSQL，Prisma schema 中 `datasource` 的 `provider` 需改为 `"postgresql"`，并安装 `@prisma/adapter-pg`（项目中已包含依赖）
- 数据库迁移：`npx prisma migrate dev`（开发） / `npx prisma migrate deploy`（生产）

### 💰 API 费用

- 本项目使用火山引擎 Ark 平台的 **豆包 Seedream 4.5** 图像生成模型
- 该模型为**付费 API**，按生成图片张数计费
- 收费标准请查阅 [火山引擎 Ark 定价页](https://www.volcengine.com/product/ark)
- 建议在火山引擎控制台设置**调用限额**，避免超支
- 每次调用返回的图片 URL 有时效性，建议生成后尽快下载保存

### 🖼️ 图片大小限制

- **前端限制**：上传组件限制为 30MB（可通过修改 `ImageUploader.tsx` 中的提示文字调整，但后端不做强制限制）
- **API 限制**：火山引擎 Ark API 对输入图片有自身限制（建议分辨率不超过 2048×2048，base64 编码后大小控制在 10MB 以内）
- 上传图片会通过 `FileReader.readAsDataURL` 转为 base64 编码，大图片会导致编码耗时增加与请求体过大
- 建议上传前将图片缩放到合理尺寸（建议使用工具预先处理）

### 🔐 认证安全

- 当前使用 Credentials Provider（邮箱+密码），密码使用 bcrypt 加盐哈希存储
- JWT Session 策略，Token 存储在 cookie 中
- 路由保护通过 `proxy.ts` 中间件实现，未登录用户访问 `/generate`、`/gallery`、`/api/generate` 会被拦截
- 生产环境务必设置强 `AUTH_SECRET`

### 🐳 Docker 部署

- Dockerfile 采用多阶段构建，最终镜像基于 `node:22-alpine`，体积较小
- 构建时会生成 Prisma Client 并执行 `next build`
- 容器启动时自动执行 `prisma migrate deploy` 同步数据库结构
- 若使用 SQLite，记得挂载 volume 持久化数据库文件，否则容器重启后数据丢失

---

## 📄 许可证

MIT License

---

*本项目为 AI 图片风格迁移学习实践项目，不构成商业产品的保证。火山引擎 Ark API 的使用需遵守其服务条款。*
