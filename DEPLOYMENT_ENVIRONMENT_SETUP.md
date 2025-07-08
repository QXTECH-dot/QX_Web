# 部署环境配置指南

## 问题诊断

本地开发环境（localhost:3000）可以正常访问Firebase数据，但部署后的生产环境（qxweb.com.au）无法访问，这通常是以下几个原因：

## 1. Firebase项目域名授权

### 步骤1：在Firebase控制台中授权域名
1. 访问 [Firebase控制台](https://console.firebase.google.com/)
2. 选择项目：`qx-net-next-js`
3. 进入 **Authentication** > **Settings** > **Authorized domains**
4. 添加以下域名：
   - `qxweb.com.au`
   - `www.qxweb.com.au`
   - 你的部署平台域名（如果使用Vercel/Netlify等）

### 步骤2：检查Firestore安全规则
确保 `firestore.rules` 文件包含正确的权限设置：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许已认证用户读写自己的数据
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // 允许已认证用户读取公司数据
    match /companies/{companyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // 允许已认证用户访问用户公司关联数据
    match /user_company/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 2. 环境变量配置

### 如果使用Vercel部署：
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** > **Environment Variables**
4. 添加以下环境变量：

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD_JzocS0akP7yWAMCelO8l6at3RGxHMdU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=qx-net-next-js.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=qx-net-next-js
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=qx-net-next-js.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=412313045911
NEXT_PUBLIC_FIREBASE_APP_ID=1:412313045911:web:cbb21106eb73a8fb1352d2
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-MER4ZNDV5H
NEXTAUTH_URL=https://qxweb.com.au
NEXTAUTH_SECRET=your-secure-random-string-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### 如果使用Netlify部署：
1. 访问 [Netlify Dashboard](https://app.netlify.com/)
2. 选择你的项目
3. 进入 **Site settings** > **Environment variables**
4. 添加上述相同的环境变量

## 3. Google OAuth配置

### 步骤1：在Google Cloud Console中添加授权域名
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择你的项目
3. 进入 **APIs & Services** > **Credentials**
4. 编辑你的OAuth 2.0客户端ID
5. 在 **Authorized JavaScript origins** 中添加：
   - `https://qxweb.com.au`
   - `https://www.qxweb.com.au`
6. 在 **Authorized redirect URIs** 中添加：
   - `https://qxweb.com.au/api/auth/callback/google`
   - `https://www.qxweb.com.au/api/auth/callback/google`

## 4. 调试工具

我已经添加了调试工具来帮助诊断问题：

### 访问调试页面：
- 用户资料页面：`https://qxweb.com.au/crm/user/profile` （包含调试信息）
- 专门的Firebase测试页面：`https://qxweb.com.au/debug/firebase-test`

### 检查浏览器控制台：
打开浏览器开发者工具，查看Console标签页中的错误信息。

## 5. 常见错误解决方案

### 错误：`Missing or insufficient permissions`
- **原因**：Firestore安全规则问题或用户未正确认证
- **解决**：检查安全规则，确保用户已登录

### 错误：`auth/unauthorized-domain`
- **原因**：域名未在Firebase中授权
- **解决**：在Firebase控制台中添加域名到授权列表

### 错误：`Failed to fetch`
- **原因**：网络问题或Firebase配置错误
- **解决**：检查Firebase配置和网络连接

## 6. 部署后验证清单

- [ ] Firebase项目中已添加生产域名
- [ ] Google OAuth中已添加生产域名
- [ ] 环境变量已正确设置
- [ ] Firestore安全规则已部署
- [ ] 用户可以正常登录
- [ ] 调试页面显示连接成功

## 7. 紧急修复

如果问题仍然存在，可以临时修改Firestore规则为更宽松的权限（仅用于测试）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // 临时允许所有访问
    }
  }
}
```

**注意：这个规则仅用于测试，不要在生产环境中长期使用！**

## 联系支持

如果按照上述步骤仍然无法解决问题，请提供以下信息：
1. 浏览器控制台的完整错误信息
2. 调试页面的输出结果
3. 部署平台的构建日志 