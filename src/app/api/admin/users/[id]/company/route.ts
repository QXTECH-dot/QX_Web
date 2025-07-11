import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

// 验证管理员权限的中间件函数 - 临时禁用
function verifyAdminToken(request: NextRequest) {
  // 临时返回admin用户，跳过验证
  return { role: 'admin', email: 'admin@qxnet.com' };
}

// PUT - 更新用户的公司绑定
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: userId } = params;
    const { companyId, role } = await request.json();

    // 验证必填字段
    if (!companyId || !role) {
      return NextResponse.json(
        { error: 'Company ID and role are required' },
        { status: 400 }
      );
    }

    // 验证公司是否存在
    const companyQuery = query(
      collection(db, 'companies'),
      where('companyId', '==', companyId)
    );
    const companySnapshot = await getDocs(companyQuery);
    
    if (companySnapshot.empty) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // 获取用户信息
    const userQuery = query(
      collection(db, 'users'),
      where('__name__', '==', userId)
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userSnapshot.docs[0].data();
    const userEmail = userData.email;

    // 删除现有的公司绑定
    const existingBindingsQuery = query(
      collection(db, 'user_company'),
      where('email', '==', userEmail)
    );
    const existingBindingsSnapshot = await getDocs(existingBindingsQuery);
    
    // 删除所有现有绑定
    await Promise.all(
      existingBindingsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    );

    // 创建新的公司绑定
    const bindingId = `COMP_${companyId}_USER`;
    await setDoc(doc(db, 'user_company', bindingId), {
      companyId,
      email: userEmail,
      id: bindingId,
      role,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'User company binding updated successfully'
    });

  } catch (error) {
    console.error('Update user company binding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - 删除用户的公司绑定
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: userId } = params;

    // 获取用户信息
    const userQuery = query(
      collection(db, 'users'),
      where('__name__', '==', userId)
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userSnapshot.docs[0].data();
    const userEmail = userData.email;

    // 删除所有公司绑定
    const bindingsQuery = query(
      collection(db, 'user_company'),
      where('email', '==', userEmail)
    );
    const bindingsSnapshot = await getDocs(bindingsQuery);
    
    await Promise.all(
      bindingsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    );

    return NextResponse.json({
      success: true,
      message: 'User company bindings removed successfully'
    });

  } catch (error) {
    console.error('Delete user company binding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}