# EC2 部署清单

这份清单默认按下面的生产形态编写：

- 系统：Ubuntu 22.04 / 24.04
- 进程守护：PM2
- 反向代理：Nginx
- 数据库：PostgreSQL
- 域名：已解析到当前 EC2 公网 IP

如果你的环境不是这套，也可以按步骤做等价替换。

## 1. 服务器初始化

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx
```

开放安全组端口：

- `22`：SSH
- `80`：HTTP
- `443`：HTTPS

如果你暂时直连 Node，也可以临时开放：

- `3000`

正式环境建议只开放 `80/443`，通过 Nginx 反向代理到 `3000`。

## 2. 安装 Node.js 和 PM2

推荐使用 `nvm`：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 22
nvm use 22
node -v
npm -v
```

安装 PM2：

```bash
npm install -g pm2
pm2 -v
```

## 3. 安装或准备 PostgreSQL

如果数据库也放在这台 EC2：

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

创建数据库：

```bash
sudo -u postgres psql
```

在 PostgreSQL 里执行：

```sql
CREATE DATABASE video_xiaotang;
```

如果你已经有独立数据库实例，可以直接跳过本节。

## 4. 拉取项目代码

```bash
cd /var/www
sudo mkdir -p video-xiaotang
sudo chown -R $USER:$USER /var/www/video-xiaotang
cd /var/www/video-xiaotang
git clone https://github.com/xiaolubanchad-debug/video-xiaotang.git .
```

后续更新代码：

```bash
cd /var/www/video-xiaotang
git pull origin main
```

## 5. 配置环境变量

复制模板：

```bash
cp .env.example .env
```

编辑：

```bash
nano .env
```

至少填好这些值：

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/video_xiaotang?schema=public"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="请替换成足够长的随机字符串"
INTERNAL_API_KEY="请替换成内部采集专用密钥"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="请替换默认后台密码"
```

注意：

- `NEXTAUTH_URL` 必须写你的正式域名
- `NEXTAUTH_SECRET` 不要复用本地值
- `INTERNAL_API_KEY` 要和 `openclaw` 侧保持一致
- `SUPER_ADMIN_PASSWORD` 必须替换默认值

## 6. 安装依赖并初始化

```bash
cd /var/www/video-xiaotang
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run db:seed
npm run build
```

这一步完成后，超级管理员会根据 `.env` 中的账号密码完成初始化。

## 7. 用 PM2 启动服务

```bash
cd /var/www/video-xiaotang
pm2 start npm --name video-xiaotang -- run start
pm2 save
pm2 startup
```

检查状态：

```bash
pm2 status
pm2 logs video-xiaotang
```

如果要重启：

```bash
pm2 restart video-xiaotang
```

## 8. 配置 Nginx

新建站点配置：

```bash
sudo nano /etc/nginx/sites-available/video-xiaotang
```

写入：

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/video-xiaotang /etc/nginx/sites-enabled/video-xiaotang
sudo nginx -t
sudo systemctl reload nginx
```

## 9. 配置 HTTPS

推荐用 Certbot：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

完成后访问：

```text
https://your-domain.com
```

## 10. 上线后验收

至少手动检查：

### 前台

- 首页打开正常
- 搜索可用
- 视频详情页可播放
- 登录 / 注册可用
- 用户中心可访问

### 后台

- `/admin/login` 可登录
- 视频管理可打开
- 首页区块管理可打开
- 评论管理可打开
- 用户管理可打开

### 采集

- `POST /api/internal/videos/upsert` 能通过 `x-api-key` 访问
- `openclaw` 推送的视频能进入后台
- 已发布视频能在前台正常看到

## 11. 更新发布流程

以后每次发版建议这样走：

```bash
cd /var/www/video-xiaotang
git pull origin main
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run build
pm2 restart video-xiaotang
```

如果你这次改动影响了超级管理员初始化逻辑，才需要再次执行：

```bash
npm run db:seed
```

## 12. 回滚思路

如果新版本异常：

1. 回到上一个稳定 commit
2. 重新 `npm install`
3. 重新 `npm run build`
4. `pm2 restart video-xiaotang`

如果是数据库 migration 引起的问题，不要直接手工删表，先确认 migration 内容再处理。

## 13. 当前项目上线前的特别提醒

这几个点上线前务必确认：

- `.env` 里不要保留默认后台密码
- 不要把测试视频发布到首页
- `NEXTAUTH_URL` 必须是正式域名
- `INTERNAL_API_KEY` 必须改成正式值
- `npm run build` 和 `npx playwright test` 至少在上线前跑一次
