# Firebase 环境变量设置详细指南

## 问题说明

在Vercel中设置Firebase环境变量时，经常会遇到复制粘贴导致的格式问题，特别是私钥中出现多余的空行或格式错误。

## 解决方案

### 方法1：直接复制（推荐）

即使复制时有空行也没关系，我们的代码已经优化来自动处理这些格式问题。

1. **FIREBASE_PROJECT_ID**
   ```
   qx-net-next-js
   ```

2. **FIREBASE_CLIENT_EMAIL**
   ```
   firebase-adminsdk-fbsvc@qx-net-next-js.iam.gserviceaccount.com
   ```

3. **FIREBASE_PRIVATE_KEY**
   直接复制以下内容（包括所有空行都没关系）：
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

### 方法2：手动清理（如果方法1不工作）

如果直接复制仍有问题，可以手动清理：

1. 复制私钥到文本编辑器
2. 删除所有空行
3. 确保格式如下（每行64个字符）：
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

## 在Vercel中设置步骤

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择您的项目
3. 点击 "Settings" 标签
4. 点击左侧菜单中的 "Environment Variables"
5. 添加三个环境变量：
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
6. 确保为所有环境（Production, Preview, Development）都设置
7. 点击 "Save"

## 重新部署

设置完环境变量后：
1. 在Vercel Dashboard中点击 "Deployments" 标签
2. 点击最新部署旁边的三个点
3. 选择 "Redeploy"
4. 等待部署完成

## 验证设置

部署完成后，访问以下URL验证：
```
https://your-app.vercel.app/api/test-db
```

如果成功，您应该看到：
```json
{
  "success": true,
  "message": "Database connection successful",
  "documentsCount": 1,
  "envCheck": {
    "hasProjectId": true,
    "hasClientEmail": true,
    "hasPrivateKey": true,
    "privateKeyLength": 1708
  }
}
```

## 常见错误及解决方案

### 错误1：`Private key is empty`
- **原因**：FIREBASE_PRIVATE_KEY环境变量未设置或为空
- **解决**：确保正确设置了FIREBASE_PRIVATE_KEY

### 错误2：`Private key must start with -----BEGIN PRIVATE KEY-----`
- **原因**：私钥格式不正确，缺少开始标记
- **解决**：重新复制完整的私钥，包括BEGIN和END标记

### 错误3：`Invalid private key format`
- **原因**：私钥内容损坏或格式错误
- **解决**：使用方法2手动清理私钥格式

### 错误4：`Private key format error`
- **原因**：私钥中有无效字符或格式问题
- **解决**：确保私钥只包含有效的Base64字符和标记

## 技术说明

我们的代码现在包含了智能的私钥清理功能：
- 自动移除多余的空行和空白字符
- 处理转义的换行符（\n）
- 重新格式化私钥为标准格式
- 验证私钥的完整性

这意味着即使您复制时有格式问题，系统也会自动修复。 