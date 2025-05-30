# Vercel 部署配置指南

## Firebase 环境变量设置

在Vercel中部署此项目时，需要设置以下环境变量：

### 1. 登录Vercel控制台
访问 [Vercel Dashboard](https://vercel.com/dashboard)

### 2. 选择项目并进入设置
- 选择您的项目
- 点击 "Settings" 标签
- 点击左侧菜单中的 "Environment Variables"

### 3. 添加以下环境变量

#### FIREBASE_PROJECT_ID
```
qx-net-next-js
```

#### FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@qx-net-next-js.iam.gserviceaccount.com
```

#### FIREBASE_PRIVATE_KEY
```
-----BEGIN PRIVATE KEY-----
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
-----END PRIVATE KEY-----
```

### 4. 重要注意事项

1. **FIREBASE_PRIVATE_KEY 格式**：
   - 必须包含完整的私钥，包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`
   - 保持原有的换行符格式
   - 不需要额外的引号或转义字符
   - 如果复制粘贴时换行符丢失，系统会自动处理

2. **环境变量作用域**：
   - 建议为所有环境（Production, Preview, Development）都设置这些变量

3. **安全性**：
   - 这些是敏感信息，确保只有授权人员可以访问
   - 不要在代码中硬编码这些值

### 5. 部署后验证

部署完成后，按以下步骤验证Firebase连接：

#### 步骤1：测试数据库连接
访问 `/api/test-db` 端点测试数据库连接：
```
https://your-app.vercel.app/api/test-db
```

#### 步骤2：测试公司API
访问 `/api/companies?query=test` 端点测试：
```
https://your-app.vercel.app/api/companies?query=test
```

#### 步骤3：检查网站功能
测试网站的公司搜索功能是否正常

### 6. 故障排除

如果仍然无法连接数据库，请按以下步骤排查：

#### 6.1 检查环境变量
1. 确认所有三个环境变量都已正确设置
2. 检查私钥格式是否完整
3. 确认没有多余的空格或特殊字符

#### 6.2 查看日志
1. 在Vercel Dashboard中查看Function Logs
2. 查找Firebase初始化相关的错误信息
3. 检查是否有权限或认证错误

#### 6.3 常见错误及解决方案

**错误1：`Firebase environment variables are required in production`**
- 解决：确保所有环境变量都已设置

**错误2：`Invalid private key format`**
- 解决：重新复制私钥，确保包含BEGIN和END标记

**错误3：`Error: Could not load the default credentials`**
- 解决：检查FIREBASE_CLIENT_EMAIL和FIREBASE_PRIVATE_KEY是否正确

**错误4：`Permission denied`**
- 解决：检查Firebase项目权限设置，确认服务账号有正确权限

#### 6.4 重新部署
如果修改了环境变量，需要重新部署：
1. 在Vercel Dashboard中点击"Redeploy"
2. 或者推送新的代码提交触发自动部署

### 7. 性能优化

为了提高数据库连接性能，已添加以下优化：

1. **函数超时设置**：在vercel.json中设置了30秒超时
2. **连接复用**：Firebase Admin SDK会自动复用连接
3. **错误处理**：改进了错误处理和日志记录

### 8. 监控和维护

建议定期检查：
1. Vercel Function Logs中的错误信息
2. Firebase控制台中的使用情况
3. API响应时间和成功率

## 联系支持

如果遇到问题，请检查：
- Vercel部署日志
- Firebase控制台中的项目设置
- 环境变量配置是否完整
- 使用 `/api/test-db` 端点进行连接测试 