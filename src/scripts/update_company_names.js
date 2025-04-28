// 更新公司名称脚本
// 此脚本用于更新数据库中公司记录的name_en字段

const { db } = require('../lib/firebase/config');
const { collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// 为每个公司设置name_en字段
async function updateCompanyNames() {
  try {
    console.log('开始更新公司name_en字段...');
    
    // 获取所有公司
    const companiesCol = collection(db, 'companies');
    const querySnapshot = await getDocs(companiesCol);
    
    console.log(`找到 ${querySnapshot.size} 个公司记录`);
    
    // 记录更新成功和失败的数量
    let successCount = 0;
    let failureCount = 0;
    
    // 逐个处理公司记录
    for (const docSnapshot of querySnapshot.docs) {
      try {
        const companyId = docSnapshot.id;
        const companyData = docSnapshot.data();
        
        // 检查是否已有name_en字段
        if (companyData.name_en) {
          console.log(`公司 ${companyId} 已有name_en字段: ${companyData.name_en}`);
          continue;
        }
        
        // 如果没有name_en字段但有name字段，则使用name字段的值
        if (companyData.name) {
          const docRef = doc(db, 'companies', companyId);
          await updateDoc(docRef, {
            name_en: companyData.name
          });
          
          console.log(`已更新公司 ${companyId}: name_en = ${companyData.name}`);
          successCount++;
        } else {
          console.log(`公司 ${companyId} 没有name字段，无法更新name_en`);
          failureCount++;
        }
      } catch (error) {
        console.error(`更新公司 ${docSnapshot.id} 时出错:`, error);
        failureCount++;
      }
    }
    
    console.log(`更新完成！成功: ${successCount}, 失败: ${failureCount}`);
  } catch (error) {
    console.error('更新公司name_en字段时出错:', error);
  }
}

// 运行更新函数
updateCompanyNames()
  .then(() => console.log('脚本执行完毕'))
  .catch(error => console.error('脚本执行出错:', error)); 