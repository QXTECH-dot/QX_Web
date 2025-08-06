// Node.js 脚本：批量为公司生成slug
const fs = require('fs');
const path = require('path');

// 读取原始公司数据
const inputPath = path.join(__dirname, '../src/data/companiesData.ts');
const outputPath = path.join(__dirname, '../src/data/companiesData.withSlug.ts');

// 读取文件内容
let fileContent = fs.readFileSync(inputPath, 'utf-8');

// 提取公司数组部分
const match = fileContent.match(/export const companiesData: Company\[] = (\[.*\];)/s);
if (!match) {
  console.error('未找到公司数据数组');
  process.exit(1);
}

let companies = eval(match[1].replace(/([a-zA-Z0-9_]+):/g, '"$1":'));

// slugify函数
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// 生成唯一slug
const slugMap = {};
companies.forEach(company => {
  let baseSlug = slugify(company.name || company.name_en || company.id || '');
  let slug = baseSlug;
  let i = 2;
  while (slugMap[slug]) {
    slug = `${baseSlug}_${i++}`;
  }
  slugMap[slug] = true;
  company.slug = slug;
});

// 生成新TS文件内容
const newContent =
  fileContent.replace(/export const companiesData: Company\[] = \[.*\];/s,
    'export const companiesData: Company[] = ' + JSON.stringify(companies, null, 2) + ';');

fs.writeFileSync(outputPath, newContent, 'utf-8');
console.log('已生成带slug的新公司数据文件：', outputPath); 