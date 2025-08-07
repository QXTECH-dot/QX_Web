# 自定义域名故障排除指南

## 问题描述
Vercel自带域名可以访问数据库，但自定义域名无法访问Firebase数据库。

## 可能原因和解决方案

### 1. 检查Vercel环境变量配置

#### 步骤：
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 → Settings → Environment Variables
3. 确认环境变量的作用域设置

#### 解决方案：
确保环境变量应用到所有环境：
- ✅ Production
- ✅ Preview  
- ✅ Development

**重要：** 环境变量必须对所有域名生效，包括自定义域名。

### 2. 检查域名DNS配置

#### 验证步骤：
```bash
# 检查域名解析
nslookup your-custom-domain.com

# 检查CNAME记录
dig your-custom-domain.com CNAME
```

#### 正确配置：
- **CNAME记录**应指向：`cname.vercel-dns.com`
- **A记录**应指向Vercel的IP地址

### 3. Firebase安全规则检查

#### 检查Firestore安全规则：
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 确保规则允许从任何域名访问
    match /{document=**} {
      allow read, write: if true; // 临时测试用，生产环境需要更严格的规则
    }
  }
}
```

### 4. Firebase项目配置

#### 检查授权域名：
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 → Authentication → Settings → Authorized domains
3. 添加您的自定义域名到授权域名列表

#### 需要添加的域名：
- `your-custom-domain.com`
- `www.your-custom-domain.com`

### 5. 检查API路由

#### 测试API端点：
```bash
# 测试Vercel默认域名
curl https://your-project.vercel.app/api/companies?query=test

# 测试自定义域名
curl https://your-custom-domain.com/api/companies?query=test
```

### 6. 浏览器开发者工具检查

#### 在自定义域名上检查：
1. 打开浏览器开发者工具
2. 查看 Network 标签
3. 检查API请求的状态码和响应
4. 查看 Console 标签中的错误信息

### 7. Vercel Function Logs

#### 查看详细日志：
1. Vercel Dashboard → 项目 → Functions
2. 点击具体的API函数
3. 查看 Logs 标签
4. 对比默认域名和自定义域名的日志差异

### 8. 临时解决方案

#### 如果问题持续存在，可以尝试：

1. **重新部署项目**：
   ```bash
   # 触发重新部署
   git commit --allow-empty -m "Trigger redeploy for custom domain"
   git push origin main
   ```

2. **清除Vercel缓存**：
   - 在Vercel Dashboard中手动触发重新部署
   - 选择 "Redeploy" 而不是使用缓存

3. **检查环境变量值**：
   确保环境变量值完全相同，特别是 `FIREBASE_PRIVATE_KEY` 的格式。

### 9. 高级调试

#### 添加调试日志到API路由：
```typescript
// 在 src/app/api/companies/route.ts 中添加
export async function GET(request: Request) {
  console.log('Request URL:', request.url);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  console.log('Environment check:', {
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL
  });
  
  // ... 其余代码
}
```

### 10. 联系Vercel支持

如果以上步骤都无法解决问题，建议：

1. 收集以下信息：
   - 自定义域名
   - Vercel项目名称
   - 错误日志截图
   - API响应差异

2. 联系Vercel支持团队
3. 或在Vercel社区论坛发帖求助

## 常见错误代码

- **404**: API路由未找到 → 检查域名解析
- **500**: 服务器内部错误 → 检查环境变量和Firebase配置
- **CORS错误**: 跨域问题 → 检查Firebase授权域名
- **403**: 权限被拒绝 → 检查Firebase安全规则

## 验证清单

- [ ] 环境变量已设置到所有环境
- [ ] DNS配置正确指向Vercel
- [ ] Firebase授权域名包含自定义域名
- [ ] Firestore安全规则允许访问
- [ ] API端点在两个域名上返回相同结果
- [ ] 浏览器控制台无错误信息
- [ ] Vercel Function Logs显示正常 