# video-xiaotang

一个面向中文内容站场景的视频网站项目，包含前台站点、单超级管理员 CMS 后台，以及给 `openclaw` 等内部任务使用的采集接口。

当前版本聚焦“内容采集 -> 后台运营 -> 前台播放”的最小闭环，重点是单视频播放、内容运营和用户基础能力，不做复杂多集追剧系统。

## 项目能力

### 前台站点

- 首页 Banner 与 4 个固定内容区块
  - 热门推荐
  - 最新更新
  - 站长精选
  - 猜你喜欢
- 分类页、搜索页、视频详情页
- 单视频播放
- 用户注册 / 登录
- 用户中心
  - 我的收藏
  - 我的评论
  - 最近观看
- 评论提交与前台展示

### 后台 CMS

- 超级管理员登录
- 仪表盘
- 视频管理
  - 新增 / 编辑 / 删除
  - 状态切换
  - 条件筛选
- 分类管理
- 标签管理
- Banner 管理
- 首页内容区块管理
- 评论审核
- 采集日志查看
- 用户管理
  - 按邮箱搜索
  - 删除普通用户及其关联数据

### 内部采集能力

- `POST /api/internal/videos/upsert`
- `POST /api/internal/videos/batch-upsert`
- `DELETE /api/internal/videos/:sourceProvider/:sourceExternalId`
- 使用 `x-api-key` 鉴权
- 使用 `sourceProvider + sourceExternalId` 做幂等去重

更完整的采集协议见：[OPENCLAW_INGEST_API.md](./OPENCLAW_INGEST_API.md)

## 技术栈

- 框架：Next.js 16 + React 19
- 语言：TypeScript
- 样式：Tailwind CSS 4
- 数据库：PostgreSQL
- ORM：Prisma
- 认证：NextAuth
- 播放支持：`hls.js`
- 测试：Playwright

## 快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制一份环境变量模板：

```bash
cp .env.example .env
```

Windows PowerShell 也可以直接手动复制。

`.env.example` 默认包含这些关键项：

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/video_xiaotang?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
INTERNAL_API_KEY="replace-with-an-internal-api-key"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="12345678"
```

建议至少替换：

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `INTERNAL_API_KEY`
- `SUPER_ADMIN_PASSWORD`

### 3. 准备数据库

先在本机 PostgreSQL 中创建数据库：

```sql
CREATE DATABASE video_xiaotang;
```

### 4. 运行 Prisma migration

```bash
npm run prisma:migrate
```

### 5. 生成 Prisma Client

```bash
npm run prisma:generate
```

### 6. 初始化超级管理员

```bash
npm run db:seed
```

默认会根据 `.env` 中的：

- `SUPER_ADMIN_EMAIL`
- `SUPER_ADMIN_PASSWORD`

创建或更新超级管理员账号。

### 7. 启动开发环境

```bash
npm run dev
```

默认访问地址：

- 前台首页：`http://localhost:3000`
- 前台登录：`http://localhost:3000/login`
- 用户中心：`http://localhost:3000/me`
- 后台登录：`http://localhost:3000/admin/login`

## 部署说明

### 运行前准备

正式部署前请确保：

- 已准备可用的 PostgreSQL 实例
- 已正确配置生产环境变量
- 已替换默认超级管理员密码
- 已替换 `NEXTAUTH_SECRET` 与 `INTERNAL_API_KEY`

### 推荐环境变量

生产环境至少需要配置：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/video_xiaotang?schema=public"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="a-long-random-production-secret"
INTERNAL_API_KEY="a-long-random-internal-api-key"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="replace-this-password"
```

### 构建与启动

在服务器上执行：

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run build
npm run start
```

默认生产启动端口为 `3000`。

### Nginx 反向代理示例

如果你使用 Nginx，可以将域名反代到 Node 服务：

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

如果后续接 HTTPS，建议配合证书与反向代理一起处理。

### 部署后检查

部署完成后建议至少检查：

- 前台首页是否正常打开
- 后台登录是否正常
- 数据库 migration 是否执行成功
- `openclaw` 采集接口是否能通过 `x-api-key` 访问
- `npm run build` 是否在部署机上通过

## 默认账号

如果你沿用了示例环境变量，默认超级管理员为：

- 邮箱：`admin@example.com`
- 密码：`12345678`

仅建议用于本地开发，请在真实环境中替换。

## 常用命令

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run prisma:migrate
npm run prisma:generate
npm run prisma:studio
npm run db:seed
```

## 测试

项目已接入 Playwright，可以按场景执行回归：

```bash
npx playwright test tests/frontend-flow.spec.ts
npx playwright test tests/admin-video-flow.spec.ts
npx playwright test tests/public-auth-comment-flow.spec.ts
npx playwright test tests/user-center-flow.spec.ts
npx playwright test tests/admin-user-management.spec.ts
```

也可以先做基础检查：

```bash
npm run lint
npm run build
```

## OpenClaw 接入说明

推荐 `openclaw` 第一版优先走这组稳定字段：

- `sourceProvider`
- `sourceExternalId`
- `title`
- `videoUrl`
- `videoFormat`

推荐补充：

- `description`
- `coverUrl`
- `posterUrl`
- `type`
- `category`
- `tags`
- `year`
- `region`
- `language`
- `status`
- `publishedAt`

支持的 `videoFormat`：

- `mp4`
- `m3u8`
- `webm`

完整请求示例与返回结构见：[OPENCLAW_INGEST_API.md](./OPENCLAW_INGEST_API.md)

## 搜索与内容规则

- 搜索 V1 只支持：标题 + 标签
- 当前版本聚焦：单视频播放
- 后台只有一个超级管理员角色
- 首页内容区块遵循“优先不重复，不足时补位”的策略

## 目录结构

```text
src/
  app/                 Next.js App Router 页面与 API
    admin/             后台页面
    api/               前台 / 后台 / 内部接口
    category/          分类页
    login/             前台登录页
    me/                用户中心
    search/            搜索页
    videos/            视频详情页
  components/          前后台 UI 组件
  lib/                 查询、校验、服务层逻辑
prisma/
  schema.prisma        数据模型
  seed.ts              超级管理员初始化
tests/                 Playwright 回归测试
OPENCLAW_INGEST_API.md 采集接口文档
VIDEO_CMS_PLAN.md      产品方案草案
DEVELOPMENT_PLAN.md    开发计划草案
```

## 主要数据模型

当前仓库里的核心模型包括：

- `User`
- `Video`
- `Category`
- `Tag`
- `VideoSource`
- `VideoEpisode`
- `Collection`
- `Banner`
- `Comment`
- `Favorite`
- `WatchHistory`
- `IngestLog`

数据模型定义见：[prisma/schema.prisma](./prisma/schema.prisma)

## 当前范围与非目标

当前版本已完成的是内容站 MVP，不是完整长视频平台。下面这些暂时不在当前范围内：

- 多角色后台权限系统
- 会员支付
- 广告投放系统
- 多集追剧体验
- 断点续播
- 全文搜索与联想搜索
- 复杂推荐算法

## 文档

- [OPENCLAW_INGEST_API.md](./OPENCLAW_INGEST_API.md)
- [VIDEO_CMS_PLAN.md](./VIDEO_CMS_PLAN.md)
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)

## 说明

仓库里可能存在一些本地调试目录或日志文件，这些不属于正式项目输出。提交代码时建议只关注业务源码、Prisma、测试和正式文档。
