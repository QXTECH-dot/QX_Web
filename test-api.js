// 简单的API测试脚本
async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/companies/?limit=3');
    const data = await response.json();
    
    console.log('API响应状态:', response.status);
    console.log('API响应数据结构:');
    console.log('- success:', data.success);
    console.log('- data数组长度:', data.data ? data.data.length : '未定义');
    console.log('- total:', data.total);
    
    if (data.data && data.data.length > 0) {
      console.log('\n第一家公司数据:');
      const firstCompany = data.data[0];
      console.log('- id:', firstCompany.id);
      console.log('- name:', firstCompany.name || firstCompany.name_en);
      console.log('- location:', firstCompany.location);
      console.log('- services:', firstCompany.services);
    }
    
  } catch (error) {
    console.error('API测试失败:', error.message);
  }
}

testAPI(); 