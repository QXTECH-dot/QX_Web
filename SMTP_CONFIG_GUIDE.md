# SMTP 邮件配置指南

## 📧 为CRM邮件验证功能配置真实邮件发送

要启用真实的邮件发送功能，您需要配置SMTP服务。以下是详细的配置步骤：

## 🔧 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件（与package.json同级目录）

### 2. 选择邮件服务提供商

## 选项A：Gmail SMTP（推荐 - 免费可靠）

### Gmail配置步骤：

1. **开启两步验证**
   - 登录您的Gmail账号
   - 进入 [Google账户安全设置](https://myaccount.google.com/security)
   - 开启"两步验证"

2. **生成应用专用密码**
   - 在Google账户安全页面，找到"应用专用密码"
   - 选择"邮件"和"Windows计算机"
   - 生成16位应用专用密码（例如：abcd efgh ijkl mnop）

3. **配置.env.local文件：**
```env
# Gmail SMTP 配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=你的邮箱@gmail.com
SMTP_PASS=应用专用密码
SMTP_FROM="QX Net 验证邮件" <你的邮箱@gmail.com>

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的随机密钥
```

## 选项B：Outlook/Hotmail SMTP

### Outlook配置步骤：

1. **配置.env.local文件：**
```env
# Outlook SMTP 配置
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=你的邮箱@outlook.com
SMTP_PASS=你的密码
SMTP_FROM="QX Net 验证邮件" <你的邮箱@outlook.com>

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的随机密钥
```

## 选项C：SendGrid（专业服务）

### SendGrid配置步骤：

1. **注册SendGrid账号**
   - 访问 [SendGrid官网](https://sendgrid.com/)
   - 注册免费账号（每月100封邮件）

2. **获取API密钥**
   - 进入SendGrid控制台
   - 创建API密钥

3. **配置.env.local文件：**
```env
# SendGrid SMTP 配置
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=你的SendGrid_API密钥
SMTP_FROM="QX Net 验证邮件" <验证邮箱@你的域名.com>

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=你的随机密钥
```

## 🔐 生成NextAuth密钥

在终端运行以下命令生成随机密钥：

```bash
# 方法1：使用OpenSSL
openssl rand -base64 32

# 方法2：使用Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法3：在线生成
# 访问 https://generate-secret.vercel.app/32
```

## 📁 .env.local 文件完整示例

创建 `.env.local` 文件（使用Gmail配置）：

```env
# SMTP 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=qixin.support@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM="QX Net 验证邮件" <qixin.support@gmail.com>

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=8mJdZ9X7vK2L4nR6tY1uI5oP3qA0sD9fH2gJ8bM6nR1tY4uI7oP

# Firebase 配置（如果需要）
FIREBASE_PROJECT_ID=qx-net-next-js
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@qx-net-next-js.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n您的Firebase私钥\n-----END PRIVATE KEY-----"
```

## 🧪 测试邮件配置

创建完 `.env.local` 文件后：

1. **重启开发服务器**
```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

2. **测试邮件发送**
   - 访问邮箱验证页面
   - 输入真实的邮箱地址
   - 点击"发送验证码"
   - 检查您的邮箱收件箱（可能在垃圾邮件文件夹中）

## ⚠️ 常见问题解决

### 1. Gmail "身份验证失败"
- 确保开启了两步验证
- 使用应用专用密码，不是账户密码
- 检查SMTP_USER是否为完整邮箱地址

### 2. 邮件被标记为垃圾邮件
- 检查垃圾邮件文件夹
- 考虑使用专业邮件服务（SendGrid）

### 3. 端口被阻止
- 如果587端口被阻止，尝试使用465端口（secure: true）
- 如果465端口也被阻止，联系网络管理员

### 4. 邮件发送失败
- 检查控制台错误信息
- 验证SMTP配置是否正确
- 测试网络连接

## 🚀 生产环境建议

对于生产环境，建议：

1. **使用专业邮件服务**：SendGrid、AWS SES、阿里云邮件推送
2. **配置邮件域名认证**：SPF、DKIM、DMARC记录
3. **监控邮件发送状态**：成功率、退信率等
4. **使用专用发件域名**：例如 noreply@qixin.com.au

## 📞 技术支持

如果配置过程中遇到问题，请：

1. 检查控制台错误日志
2. 验证环境变量是否正确设置
3. 测试SMTP连接是否成功

配置完成后，邮件验证功能将能够发送真实的验证码邮件到用户邮箱！ 