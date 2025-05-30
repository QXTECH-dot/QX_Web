# Firebase 配置说明

## 🔑 您的Firebase配置信息

### 客户端Firebase配置（前端使用）

如果您需要在前端直接连接Firebase（用户认证、实时数据库等），请在 `.env.local` 中添加：

```env
# Firebase 客户端配置（前端使用）
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qx-net-next-js.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qx-net-next-js
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qx-net-next-js.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=412313045911
NEXT_PUBLIC_FIREBASE_APP_ID=1:412313045911:web:cbb21106eb73a8fb1352d2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MER4ZNDV5H
```

### 服务端Firebase Admin配置（当前使用）

您当前使用的是Firebase Admin SDK，配置如下：

```env
# Firebase Admin 配置（服务端使用）
FIREBASE_PROJECT_ID=qx-net-next-js
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@qx-net-next-js.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXzanG7b6bcOWN
yosbEjFJ/qcnLXpPoLIbCBuwrUWsD3VgY+nkYWM6RfLWfhXq3CMkyhiFHIC74SA0
RN0NsEnOpWQ0cePz71ZbOCciCfL6sJJHzIqJ5N6qlO+UyA7wa3bfjB0LOjAnf4Tt
Gf7A/65tjBXGriNRLuLLO4KZqo10x4Xu2/hhpiUGuOq78SBD2K1Bevx/DRO0rYWi
c4AoZRMfW/v+sJx52BBnjE7xiCO5dau3ZVrv+dReTwrNG6rWHwsEnBX+uhYSgebL
Wo4k9Sd2f0Y3anj5bDSC6hHzg7icS4TeXxxeqYBuZKg08454efJheCg8mR0y6u0a
Hf8C5mchAgMBAAECggEAK/sSisd7t1ZUs6lwdwXk0N7eN9wVuTdCEtHdD+mLq4eJ
BsW70IaktI/qhNlf6T0hU3nX88znwUc+yNYAw4QFRkEl0IoEtLptZx1UPSjrxFTe
9L1ekAgGuR5QcWcq6N4BwU+7ZHLV28O20+j5pZoOQ7/X2Um/grhWTfJuaq3+sMvh
inqoDeGf05OYvR6jMOoFcez6s2DmJq+3E/MpjjuONGUeg22I+uJ4weOdZ9eY56yS
mSkWyFUIgMGnXA6EsSLWE5WqndESfmtXk1vrG8Y9LNavw6zUQcYSZiIb3+NK+kmY
D6QYySZUuNx190UmhxfMwFI+reSaM0n7cHibP/8PJwKBgQDLI+ahQ/5EwzSzaECO
nasuWSj2/ONM6AQGmGg3zE/C5WmbbYJGW/9so/DV3RGlc4/JFlDu0eO6QgTMCP66
rgEn35A6DE4OaTSguo5HoIEGhz0t651PJvYpKgek2gW75YOlBByCaSbxSmQ/Ed6y
GVvfaPRzUKZeWX4HN2DDpOHvEwKBgQC/TfqqW0usO1qT5uaRshR3nvMJBA2Cjm2t
ZZLqxZ+JkX3LeDsbCYBxEJgsKZw2z9ThTgZTvEJoa4Zeex7BQWxRtZ+LWu+rXdsO
aeXCB0pXFFm97l9vv3yZ7CXHNdSIkv2HwSBlq5xMj6oA2mU9Y4PeluMpx6SEujze
u9yTa6FzewKBgQDC1uVfqkKYm47RwV2iLLJCmzwCYh515lfuJ4JWen3KVpZLgOai
K507C6d0yTwisEuqOOBZoDFHtgi51qrUTQ9IulKwiprXkarruuO66cS3iUFx6PqS
L7GNXAXG5WL4jLQOs3nQz6CNcKfkInSx6EbJavaEIEfiWP3bWA9Ut7IIxwKBgAN8
PjbgVu6aXjoXmNfKsMjFIpRleIGKasEf+p9AXnm5JtuQIzOI5sgojz0uvOPawXwh
Wcgow+T3IImUIKlQsdKDRpbZX0h1+0m18DOqwlX3zvLA5wg4KuL7BG0us+KRGwFg
KWDw0XYrn+NIF1QY/gwOH7FhK8QnSHieX5Rn/5cFAoGAOeNlYlvzeyKfC9tKTrhy
T82J3D4qryyz5fT/nPKDiephY9drw4AFyox4zT4v++VsshT26aaeXQXqbqwu8O5k
3tQE9N30Av7niGPhbCHJQrxZfsy6EdZAZMbAPM8egdAXjhbPEgRztgbKMK5mQDh1
954KqgwjqWoMpQHpL++Ag6I=
-----END PRIVATE KEY-----"
```

## 📋 配置说明

### 1. 环境变量位置

- **开发环境**: 在项目根目录创建 `.env.local` 文件
- **生产环境**: 在部署平台（Vercel/Firebase）设置环境变量

### 2. 两种配置的区别

#### 客户端配置 (NEXT_PUBLIC_*)
- 用于前端直接连接Firebase
- 支持用户认证、实时数据库、存储等
- 变量名必须以 `NEXT_PUBLIC_` 开头
- 会暴露在浏览器中，相对安全

#### 服务端配置 (FIREBASE_*)
- 用于服务端API路由连接Firebase
- 使用Firebase Admin SDK
- 具有完全管理权限
- 私钥必须保密，不能暴露

### 3. 当前项目状态

您的项目目前使用的是**服务端配置**，因为：
- 使用了Firebase Admin SDK
- 在API路由中连接Firestore
- 已经部署到Firebase Hosting（静态网站）

### 4. 是否需要客户端配置？

**如果您需要以下功能，则需要添加客户端配置：**
- 用户登录/注册
- 实时数据更新
- 客户端直接上传文件
- 前端直接查询数据库

**当前项目不需要客户端配置，因为：**
- 使用静态导出（没有API路由）
- 数据是预构建的静态内容
- 没有用户认证功能

## 🔧 如何使用

### 方案1：继续使用当前配置（推荐）
保持现有的Firebase Admin配置，适合静态网站。

### 方案2：添加客户端配置
如果需要动态功能，可以添加客户端Firebase配置。

### 方案3：混合使用
同时使用两种配置，服务端处理敏感操作，客户端处理用户交互。

## 📝 注意事项

1. **私钥安全**: `FIREBASE_PRIVATE_KEY` 必须保密
2. **环境变量格式**: 私钥需要用双引号包围
3. **换行符处理**: 私钥中的 `\n` 需要正确处理
4. **部署平台**: 不同平台的环境变量设置方式不同

## 🚀 快速设置

如果您想添加客户端配置，请创建 `.env.local` 文件并添加上述客户端配置变量。 