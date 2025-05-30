// 检查Firebase数据结构
async function checkFirebaseData() {
  try {
    const response = await fetch('http://localhost:3000/api/companies/?limit=1');
    const data = await response.json();
    
    console.log('=== Firebase数据结构分析 ===');
    console.log('API响应状态:', response.status);
    console.log('API响应成功:', data.success);
    console.log('数据总数:', data.total);
    
    if (data.data && data.data.length > 0) {
      const company = data.data[0];
      console.log('\n=== 第一家公司的所有字段 ===');
      console.log(JSON.stringify(company, null, 2));
      
      console.log('\n=== 字段映射分析 ===');
      console.log('ID字段:', company.id ? '✅ id' : '❌ 缺少id');
      console.log('公司名称:', company.name ? '✅ name' : company.name_en ? '✅ name_en' : '❌ 缺少名称字段');
      console.log('位置信息:', company.location ? '✅ location' : '❌ 缺少location');
      console.log('描述信息:', company.description ? '✅ description' : company.shortDescription ? '✅ shortDescription' : '❌ 缺少描述');
      console.log('Logo:', company.logo ? '✅ logo' : '❌ 缺少logo');
      console.log('服务列表:', company.services ? '✅ services' : '❌ 缺少services');
      console.log('行业信息:', company.industries ? '✅ industries' : company.industry ? '✅ industry' : '❌ 缺少行业');
      console.log('团队规模:', company.teamSize ? '✅ teamSize' : '❌ 缺少teamSize');
      console.log('语言列表:', company.languages ? '✅ languages' : '❌ 缺少languages');
      console.log('ABN:', company.abn ? '✅ abn' : '❌ 缺少abn');
      console.log('验证状态:', company.verified !== undefined ? '✅ verified' : '❌ 缺少verified');
    } else {
      console.log('❌ 没有获取到公司数据');
    }
    
  } catch (error) {
    console.error('检查失败:', error.message);
  }
}

checkFirebaseData(); 