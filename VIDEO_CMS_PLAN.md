# 视频网站 CMS 方案

## 1. 产品 PRD

### 1.1 项目定位

打造一个支持前台展示、视频播放、内容运营和后台管理的一体化视频网站。系统以 CMS 为核心，支持内容采集、上传、审核、发布、推荐、统计与用户运营，适合做影视站、短视频站、教育视频站、会员视频站等。

### 1.2 产品目标

- 提供完整的视频内容发布与管理能力
- 提供适配移动端和桌面端的前台观看体验
- 提供可运营的后台 CMS，由单个超级管理员统一管理
- 支持后续扩展会员、广告、专题、支付、推荐系统
- 提供内容新增/删除 API，供 `openclaw` 实时采集后自动入库

### 1.3 用户角色

- 游客：浏览、搜索、观看部分公开内容
- 注册用户：收藏、评论、查看历史、订阅
- 会员用户：观看会员内容、高清内容、无广告内容
- 超级管理员：唯一后台管理者，负责视频、推荐位、评论、用户和系统设置
- `openclaw` 采集服务：通过受保护 API 自动新增、更新、删除视频内容

### 1.4 前台功能清单

#### 首页

- 顶部导航
- 频道入口
- Banner 轮播
- 热门推荐
- 最新上新
- 分类分区
- 专题合集
- 榜单模块
- 底部站点信息与友情链接

#### 分类页

- 一级频道展示
- 多维筛选：分类、地区、年份、语言、题材
- 排序：最新、最热、评分、播放量
- 列表分页或无限滚动

#### 搜索页

- 关键词搜索
- 热搜词
- 联想提示
- 搜索历史
- 搜索结果筛选

#### 视频详情页

- 视频标题、海报、简介
- 播放器
- 清晰度切换
- 集数切换
- 字幕切换
- 标签与分类
- 演员/导演信息
- 相关推荐
- 点赞、收藏、分享
- 评论区

#### 用户系统

- 注册 / 登录 / 找回密码
- 第三方登录预留
- 个人资料
- 观看历史
- 收藏夹
- 我的评论
- 我的订阅
- 会员中心

#### 专题与运营页面

- 专题页
- 榜单页
- 活动页
- 作者/UP主页

### 1.5 后台 CMS 功能清单

#### 仪表盘

- 视频总数
- 播放总量
- 用户增长
- 采集成功/失败数量
- 热门内容排行

#### 内容管理

- 视频新增、编辑、删除、上下架
- 多视频源管理
- 多集管理
- 封面、海报、预告片管理
- 字幕管理
- 批量导入与批量操作
- 采集来源标记
- 外部内容 ID 去重

#### 分类与标签管理

- 频道管理
- 子分类管理
- 标签管理
- 地区/年份/语言维度管理

#### 专题与推荐位管理

- Banner 管理
- 首页推荐位管理
- 榜单管理
- 专题合集管理
- 手动置顶与排序

#### 用户与互动管理

- 用户列表
- 会员状态管理
- 封禁与黑名单
- 评论审核
- 敏感词过滤

#### 广告与商业化

- Banner 广告
- 播放前贴片广告
- 暂停广告
- 会员免广告策略

#### 数据统计

- 视频播放量
- 完播率
- 用户留存
- 热门关键词
- 来源渠道
- 内容表现排行

#### 系统配置

- 站点基础设置
- SEO 设置
- 存储设置
- 转码设置
- 播放器设置
- API Key 设置
- 采集来源白名单
- 操作日志

### 1.6 核心业务流程

1. `openclaw` 在网络上实时采集视频内容
2. `openclaw` 调用新增内容 API，将视频基础信息、分类、标签、封面、播放地址写入系统
3. 系统按外部来源 ID 做幂等去重，避免重复入库
4. 超级管理员在后台补充推荐位、专题、上下架和内容修正
5. 如后续接入转码服务，系统生成多清晰度资源
6. 用户在前台浏览、搜索、观看、评论、收藏
7. `openclaw` 或超级管理员可调用删除接口移除内容
8. 后台统计播放、采集和互动数据

### 1.7 非功能需求

- 支持 SEO
- 支持移动端响应式
- 支持 CDN / 对象存储
- 支持权限控制和操作日志
- 支持缓存与高并发读场景
- 支持后续接入会员、支付、推荐算法

### 1.8 MVP 范围

#### 第一阶段必须做

- 前台：首页、分类页、搜索页、详情页、登录注册、用户中心
- 后台：视频管理、分类管理、标签管理、推荐位管理、评论审核、用户管理
- 基础能力：上传封面、录入视频地址、播放器、SEO、单超级管理员登录
- 采集接入：内容新增 API、内容删除 API、来源去重、API 鉴权

#### 第二阶段扩展

- 多清晰度转码
- 会员系统
- 广告系统
- 专题页
- 数据报表
- 收藏和历史

#### 第三阶段扩展

- 支付
- 自动推荐
- 弹幕
- 多作者投稿
- AI 标签和摘要

## 2. 数据库表结构设计

### 2.1 核心表

#### users

- id
- email
- phone
- password_hash
- nickname
- avatar
- bio
- status
- member_level
- member_expired_at
- is_super_admin
- created_at
- updated_at

#### videos

- id
- title
- slug
- subtitle
- description
- cover_url
- poster_url
- trailer_url
- type
- category_id
- region
- language
- year
- duration_seconds
- status
- audit_status
- published_at
- view_count
- like_count
- favorite_count
- comment_count
- source_provider
- source_external_id
- source_payload
- created_by
- created_at
- updated_at

#### video_sources

- id
- video_id
- source_type
- source_url
- storage_path
- cdn_url
- resolution
- bitrate
- format
- sort_order
- created_at

#### video_episodes

- id
- video_id
- title
- episode_no
- source_id
- duration_seconds
- is_free
- published_at
- sort_order

#### video_subtitles

- id
- video_id
- episode_id
- language
- file_url
- format

#### categories

- id
- parent_id
- name
- slug
- description
- sort_order
- status

#### tags

- id
- name
- slug
- color

#### video_tags

- id
- video_id
- tag_id

#### collections

- id
- title
- slug
- description
- cover_url
- type
- status
- sort_order
- created_at

#### collection_items

- id
- collection_id
- video_id
- sort_order

#### banners

- id
- title
- image_url
- target_url
- video_id
- sort_order
- start_at
- end_at
- status

#### comments

- id
- video_id
- user_id
- parent_id
- content
- status
- like_count
- created_at

#### favorites

- id
- user_id
- video_id
- created_at

#### watch_histories

- id
- user_id
- video_id
- episode_id
- progress_seconds
- watched_at

#### searches

- id
- user_id
- keyword
- created_at

#### ingest_logs

- id
- provider
- action
- external_id
- request_payload
- response_status
- error_message
- created_at

#### ads

- id
- name
- type
- image_url
- video_url
- target_url
- placement
- start_at
- end_at
- status

#### pages

- id
- title
- slug
- content
- seo_title
- seo_description
- status

#### system_settings

- id
- setting_key
- setting_value
- updated_at

#### audit_logs

- id
- user_id
- action
- module
- target_id
- detail
- created_at

### 2.2 关系说明

- `videos` 对 `categories` 是多对一
- `videos` 对 `tags` 是多对多
- `videos` 对 `video_sources` 是一对多
- `videos` 对 `video_episodes` 是一对多
- `videos` 对 `comments` 是一对多
- `users` 对 `comments`、`favorites`、`watch_histories` 是一对多
- `collections` 对 `videos` 是多对多
- `ingest_logs` 记录 `openclaw` 对内容接口的调用结果

### 2.3 建表建议

- 所有主键使用 UUID 或 bigint
- 高频查询字段加索引：`slug`、`status`、`published_at`、`category_id`
- 为 `source_provider + source_external_id` 建唯一索引，保证采集幂等
- 搜索相关字段可先做普通索引，后续接入全文搜索
- 评论、历史、日志类表做好分页索引

### 2.4 简化 ER 思路

```mermaid
flowchart LR
  U["users"] --> F["favorites"]
  U --> WH["watch_histories"]
  U --> C["comments"]
  V["videos"] --> VS["video_sources"]
  V --> VE["video_episodes"]
  V --> C
  V --> F
  V --> WH
  V --> VT["video_tags"]
  VT --> T["tags"]
  V --> CA["categories"]
  I["ingest_logs"] --> V
  CO["collections"] --> CI["collection_items"]
  CI --> V
```

## 2.5 采集 API 设计要求

### 鉴权方式

- `openclaw` 调用内部 API 时必须携带 `x-api-key`
- 服务端校验 API Key，后续可增加 IP 白名单
- 所有采集接口写入 `ingest_logs`

### 必要接口

#### 新增或更新视频

- `POST /api/internal/videos/upsert`
- 按 `source_provider + source_external_id` 做幂等写入
- 支持写入标题、简介、封面、分类、标签、播放源、集数、字幕、上下架状态

#### 删除视频

- `DELETE /api/internal/videos/:sourceProvider/:sourceExternalId`
- 支持按来源和外部 ID 删除
- 删除动作写入日志

#### 批量推送

- `POST /api/internal/videos/batch-upsert`
- 支持批量导入，返回成功、失败、跳过数量

### 接口约束

- 返回明确的成功、重复、失败状态
- 对重复内容只更新，不重复创建
- 错误响应保留结构化信息，便于 `openclaw` 重试
- 所有删除动作都要留审计日志

## 3. 前后台页面原型清单

### 3.1 前台页面

#### 公共页面

- 首页
- 分类页
- 搜索结果页
- 视频详情页
- 专题页
- 榜单页
- 404 页面

#### 用户页面

- 登录页
- 注册页
- 忘记密码页
- 用户中心首页
- 个人资料页
- 我的收藏页
- 观看历史页
- 我的评论页
- 我的订阅页
- 会员中心页

#### 内容扩展页面

- 作者主页
- 活动专题页
- 静态单页：关于我们、版权声明、隐私政策

### 3.2 后台页面

#### 仪表盘

- 数据总览
- 趋势图表
- 待办提醒

#### 内容中心

- 视频列表页
- 新增视频页
- 编辑视频页
- 多集管理页
- 视频源管理页
- 字幕管理页

#### 分类与标签

- 分类列表页
- 标签列表页

#### 运营中心

- Banner 管理页
- 推荐位管理页
- 专题管理页
- 榜单管理页
- 广告管理页

#### 用户与互动

- 用户列表页
- 用户详情页
- 评论审核页
- 黑名单管理页

#### 数据中心

- 播放统计页
- 用户统计页
- 搜索统计页
- 内容表现页

#### 系统中心

- 管理员账号页
- 系统设置页
- SEO 设置页
- API Key 设置页
- 存储配置页
- 播放器配置页
- 操作日志页

### 3.3 后台导航建议

1. 仪表盘
2. 视频管理
3. 分类标签
4. 专题推荐
5. 评论用户
6. 广告商业化
7. 数据统计
8. 系统设置

## 4. 推荐技术栈

- 前台：Next.js
- 后台：自建 Next.js Admin
- 服务端：Next.js API
- 数据库：PostgreSQL
- ORM：Prisma
- 鉴权：NextAuth 或 JWT
- 缓存：Redis
- 文件存储：OSS / S3
- 视频处理：FFmpeg + 队列服务
- 采集系统：`openclaw` 通过内部 API 实时推送内容

## 5. 下一步建议

1. 先确认是做影视点播站、短视频站还是教育视频站
2. 我可以继续帮你输出 Prisma 数据模型
3. 我可以继续帮你输出前后台低保真页面结构
4. 我也可以直接在当前目录搭建一个 `Next.js + Prisma + CMS Admin` 的项目骨架
