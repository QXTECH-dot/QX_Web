import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/firebase/services/user';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// GET - 获取所有用户及其公司绑定信息
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    // 获取所有用户
    const users = await getAllUsers();
    
    // 获取所有用户的公司绑定信息
    const usersWithBindings = await Promise.all(
      users.map(async (user) => {
        try {
          // 查询用户的公司绑定
          const userCompanyQuery = query(
            collection(db, 'user_company'),
            where('email', '==', user.email)
          );
          const userCompanySnapshot = await getDocs(userCompanyQuery);
          
          const companyBindings = await Promise.all(
            userCompanySnapshot.docs.map(async (doc) => {
              const binding = doc.data();
              
              // 获取公司名称
              let companyName = 'Unknown Company';
              try {
                const companyQuery = query(
                  collection(db, 'companies'),
                  where('companyId', '==', binding.companyId)
                );
                const companySnapshot = await getDocs(companyQuery);
                if (!companySnapshot.empty) {
                  companyName = companySnapshot.docs[0].data().name;
                }
              } catch (error) {
                console.error('Error fetching company name:', error);
              }
              
              return {
                companyId: binding.companyId,
                role: binding.role,
                companyName
              };
            })
          );

          return {
            ...user,
            companyBindings
          };
        } catch (error) {
          console.error('Error fetching user company bindings:', error);
          return {
            ...user,
            companyBindings: []
          };
        }
      })
    );

    // 应用搜索过滤器
    let filteredUsers = usersWithBindings;
    
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role && role !== 'all') {
      filteredUsers = filteredUsers.filter(user => 
        user.companyBindings?.some(binding => binding.role === role)
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}