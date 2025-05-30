# Firebase 部署指南

## 前提条件

1. 确保您已经安装了Node.js 18或更高版本
2. 确保您有Firebase项目的管理员权限

## 步骤1：安装Firebase CLI

如果还没有安装Firebase CLI，请运行：

```bash
npm install -g firebase-tools
```

## 步骤2：登录Firebase

```bash
firebase login
```

这将打开浏览器窗口，请使用您的Google账户登录。

## 步骤3：初始化Firebase项目（如果需要）

如果这是第一次设置，运行：

```bash
firebase init
```

选择以下选项：
- ✅ Firestore: Configure security rules and indexes files
- ✅ Functions: Configure a Cloud Functions directory and its files
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Storage: Configure a security rules file for Cloud Storage

然后：
- 选择现有项目：`qx-net-next-js`
- Firestore规则文件：使用默认 `firestore.rules`
- Firestore索引文件：使用默认 `firestore.indexes.json`
- Functions语言：选择 `JavaScript`
- 是否使用ESLint：`No`
- 是否安装依赖：`Yes`
- Hosting公共目录：输入 `out`
- 配置为单页应用：`Yes`
- 设置自动构建和部署：`No`
- Storage规则文件：使用默认 `storage.rules`

## 步骤4：安装依赖

```bash
npm install
```

## 步骤5：构建项目

```bash
npm run firebase:build
```

## 步骤6：部署到Firebase

### 完整部署（推荐首次部署）

```bash
npm run firebase:deploy
```

### 仅部署Hosting

```bash
npm run firebase:deploy:hosting
```

### 仅部署Functions

```bash
npm run firebase:deploy:functions
```

## 步骤7：验证部署

部署完成后，您会看到类似以下的输出：

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/qx-net-next-js/overview
Hosting URL: https://qx-net-next-js.web.app
```

访问Hosting URL来验证您的网站是否正常工作。

## 环境变量配置

在Firebase Functions中，环境变量会自动从Firebase项目配置中读取。由于您使用的是同一个Firebase项目，数据库连接应该会自动工作。

如果需要设置额外的环境变量，可以使用：

```bash
firebase functions:config:set someservice.key="THE API KEY"
```

## 故障排除

### 问题1：构建失败

如果构建失败，请检查：
1. Node.js版本是否为18或更高
2. 所有依赖是否正确安装
3. TypeScript错误（已配置忽略）

### 问题2：Functions部署失败

如果Functions部署失败：
1. 检查Firebase项目是否启用了Cloud Functions
2. 确保您的Firebase计划支持Cloud Functions（需要Blaze计划）
3. 检查函数代码是否有语法错误

### 问题3：Hosting部署失败

如果Hosting部署失败：
1. 确保`out`目录存在且包含构建文件
2. 检查`firebase.json`配置是否正确
3. 确保您有项目的部署权限

### 问题4：数据库连接问题

在Firebase环境中，数据库连接应该自动工作，因为：
1. 使用相同的Firebase项目
2. Firebase Admin SDK会自动使用项目的默认凭据
3. 不需要手动配置环境变量

## 本地测试

在部署之前，您可以本地测试：

```bash
# 构建项目
npm run firebase:build

# 启动本地Firebase模拟器
npm run firebase:serve
```

这将在本地启动Firebase Hosting和Functions模拟器。

## 持续部署

您可以设置GitHub Actions来自动部署：

1. 在GitHub仓库中，转到Settings > Secrets
2. 添加Firebase服务账户密钥作为secret
3. 创建`.github/workflows/firebase-hosting-merge.yml`文件

## 监控和日志

部署后，您可以在Firebase Console中监控：
1. Hosting使用情况
2. Functions执行日志
3. Firestore使用情况
4. 错误报告

访问：https://console.firebase.google.com/project/qx-net-next-js

## 成本考虑

Firebase的定价基于使用量：
- Hosting：免费额度通常足够小型网站
- Functions：需要Blaze计划，按执行次数计费
- Firestore：按读写操作计费

建议监控使用情况以避免意外费用。

## 下一步

部署成功后：
1. 设置自定义域名（如果需要）
2. 配置SSL证书（自动提供）
3. 设置监控和警报
4. 优化性能和成本 