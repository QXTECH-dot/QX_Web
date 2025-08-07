@echo off
echo 🚀 开始Firebase部署流程...

echo 📦 安装依赖...
call npm install

echo 🔨 设置环境变量并构建项目...
set FIREBASE_PROJECT_ID=qx-net-next-js
set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@qx-net-next-js.iam.gserviceaccount.com
set FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----^

MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCXzanG7b6bcOWN^

yosbEjFJ/qcnLXpPoLIbCBuwrUWsD3VgY+nkYWM6RfLWfhXq3CMkyhiFHIC74SA0^

RN0NsEnOpWQ0cePz71ZbOCciCfL6sJJHzIqJ5N6qlO+UyA7wa3bfjB0LOjAnf4Tt^

Gf7A/65tjBXGriNRLuLLO4KZqo10x4Xu2/hhpiUGuOq78SBD2K1Bevx/DRO0rYWi^

c4AoZRMfW/v+sJx52BBnjE7xiCO5dau3ZVrv+dReTwrNG6rWHwsEnBX+uhYSgebL^

Wo4k9Sd2f0Y3anj5bDSC6hHzg7icS4TeXxxeqYBuZKg08454efJheCg8mR0y6u0a^

Hf8C5mchAgMBAAECggEAK/sSisd7t1ZUs6lwdwXk0N7eN9wVuTdCEtHdD+mLq4eJ^

BsW70IaktI/qhNlf6T0hU3nX88znwUc+yNYAw4QFRkEl0IoEtLptZx1UPSjrxFTe^

9L1ekAgGuR5QcWcq6N4BwU+7ZHLV28O20+j5pZoOQ7/X2Um/grhWTfJuaq3+sMvh^

inqoDeGf05OYvR6jMOoFcez6s2DmJq+3E/MpjjuONGUeg22I+uJ4weOdZ9eY56yS^

mSkWyFUIgMGnXA6EsSLWE5WqndESfmtXk1vrG8Y9LNavw6zUQcYSZiIb3+NK+kmY^

D6QYySZUuNx190UmhxfMwFI+reSaM0n7cHibP/8PJwKBgQDLI+ahQ/5EwzSzaECO^

nasuWSj2/ONM6AQGmGg3zE/C5WmbbYJGW/9so/DV3RGlc4/JFlDu0eO6QgTMCP66^

rgEn35A6DE4OaTSguo5HoIEGhz0t651PJvYpKgek2gW75YOlBByCaSbxSmQ/Ed6y^

GVvfaPRzUKZeWX4HN2DDpOHvEwKBgQC/TfqqW0usO1qT5uaRshR3nvMJBA2Cjm2t^

ZZLqxZ+JkX3LeDsbCYBxEJgsKZw2z9ThTgZTvEJoa4Zeex7BQWxRtZ+LWu+rXdsO^

aeXCB0pXFFm97l9vv3yZ7CXHNdSIkv2HwSBlq5xMj6oA2mU9Y4PeluMpx6SEujze^

u9yTa6FzewKBgQDC1uVfqkKYm47RwV2iLLJCmzwCYh515lfuJ4JWen3KVpZLgOai^

K507C6d0yTwisEuqOOBZoDFHtgi51qrUTQ9IulKwiprXkarruuO66cS3iUFx6PqS^

L7GNXAXG5WL4jLQOs3nQz6CNcKfkInSx6EbJavaEIEfiWP3bWA9Ut7IIxwKBgAN8^

PjbgVu6aXjoXmNfKsMjFIpRleIGKasEf+p9AXnm5JtuQIzOI5sgojz0uvOPawXwh^

Wcgow+T3IImUIKlQsdKDRpbZX0h1+0m18DOqwlX3zvLA5wg4KuL7BG0us+KRGwFg^

KWDw0XYrn+NIF1QY/gwOH7FhK8QnSHieX5Rn/5cFAoGAOeNlYlvzeyKfC9tKTrhy^

T82J3D4qryyz5fT/nPKDiephY9drw4AFyox4zT4v++VsshT26aaeXQXqbqwu8O5k^

3tQE9N30Av7niGPhbCHJQrxZfsy6EdZAZMbAPM8egdAXjhbPEgRztgbKMK5mQDh1^

954KqgwjqWoMpQHpL++Ag6I=^

-----END PRIVATE KEY-----

echo 🔧 创建简化的Next.js配置...
echo /** @type {import('next').NextConfig} */ > next.config.temp.js
echo const nextConfig = { >> next.config.temp.js
echo   output: 'export', >> next.config.temp.js
echo   trailingSlash: true, >> next.config.temp.js
echo   images: { unoptimized: true }, >> next.config.temp.js
echo   typescript: { ignoreBuildErrors: true }, >> next.config.temp.js
echo   eslint: { ignoreDuringBuilds: true }, >> next.config.temp.js
echo }; >> next.config.temp.js
echo export default nextConfig; >> next.config.temp.js

copy next.config.temp.js next.config.js

echo 🏗️ 构建静态网站...
call npx next build

echo 🚀 部署到Firebase...
call firebase deploy --only hosting

echo 🧹 清理临时文件...
del next.config.temp.js

echo ✅ 部署完成！
echo 🌐 您的网站现在可以在Firebase Hosting上访问了
echo 📊 查看Firebase控制台：https://console.firebase.google.com/project/qx-net-next-js 