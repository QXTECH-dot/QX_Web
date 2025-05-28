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

2. **环境变量作用域**：
   - 建议为所有环境（Production, Preview, Development）都设置这些变量

3. **安全性**：
   - 这些是敏感信息，确保只有授权人员可以访问
   - 不要在代码中硬编码这些值

### 5. 部署后验证

部署完成后，可以通过以下方式验证Firebase连接：

1. 查看Vercel的Function Logs
2. 访问 `/api/companies?query=test` 端点测试
3. 检查网站的公司搜索功能是否正常

### 6. 故障排除

如果仍然无法连接数据库：

1. 检查环境变量是否正确设置
2. 确认私钥格式完整无误
3. 查看Vercel Function Logs中的错误信息
4. 确认Firebase项目权限设置正确

## 联系支持

如果遇到问题，请检查：
- Vercel部署日志
- Firebase控制台中的项目设置
- 环境变量配置是否完整 