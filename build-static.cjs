const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 开始静态构建流程...');

// 1. 备份API文件夹
const apiPath = path.join(__dirname, 'src', 'app', 'api');
const apiBackupPath = path.join(__dirname, 'src', 'app', 'api-backup');

if (fs.existsSync(apiPath)) {
  console.log('📦 备份API文件夹...');
  if (fs.existsSync(apiBackupPath)) {
    fs.rmSync(apiBackupPath, { recursive: true, force: true });
  }
  fs.renameSync(apiPath, apiBackupPath);
}

try {
  // 2. 运行构建
  console.log('🔨 开始构建...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ 构建成功！');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
} finally {
  // 3. 恢复API文件夹
  if (fs.existsSync(apiBackupPath)) {
    console.log('🔄 恢复API文件夹...');
    if (fs.existsSync(apiPath)) {
      fs.rmSync(apiPath, { recursive: true, force: true });
    }
    fs.renameSync(apiBackupPath, apiPath);
  }
}

console.log('🎉 静态构建流程完成！'); 