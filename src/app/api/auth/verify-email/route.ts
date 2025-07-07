import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { promisify } from 'util';
import { sendVerificationEmail, sendMockVerificationEmail } from '@/lib/email';

const resolveMx = promisify(dns.resolveMx);

// 常见个人邮箱域名列表
const PERSONAL_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
  'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com',
  'live.com', 'msn.com', 'aol.com', 'protonmail.com', 'tutanota.com'
];

// 验证邮箱域名是否真实存在
async function validateEmailDomain(email: string): Promise<{ isValid: boolean; error?: string }> {
  try {
    const domain = email.split('@')[1];
    
    if (!domain) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // 检查是否是个人邮箱
    if (PERSONAL_EMAIL_DOMAINS.includes(domain.toLowerCase())) {
      return { isValid: false, error: 'Personal email addresses are not allowed' };
    }

    // 检查域名格式
    if (!domain.includes('.') || domain.length < 3) {
      return { isValid: false, error: 'Invalid domain format' };
    }

    // 检查MX记录是否存在（验证域名是否真实）
    try {
      const mxRecords = await resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return { isValid: false, error: 'Domain does not have valid email configuration' };
      }
    } catch (error) {
      return { isValid: false, error: 'Unable to verify domain email configuration' };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Email domain validation error:', error);
    return { isValid: false, error: 'Email validation failed' };
  }
}

// 生成验证码
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 存储验证码（在实际应用中应该使用Redis或数据库）
const verificationCodes = new Map<string, { code: string; expires: number; companyName: string }>();

export async function POST(request: NextRequest) {
  try {
    const { email, companyName, action, code } = await request.json();

    if (!email || !companyName) {
      return NextResponse.json(
        { success: false, error: 'Email and company name are required' },
        { status: 400 }
      );
    }

    // 验证邮箱域名
    const domainValidation = await validateEmailDomain(email);
    if (!domainValidation.isValid) {
      return NextResponse.json(
        { success: false, error: domainValidation.error },
        { status: 400 }
      );
    }

    // 检查域名是否与公司名称匹配（更宽松的验证）
    const companyWords = companyName.toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .split(' ')
      .filter((word: string) => word.length > 2);
    
    const domain = email.split('@')[1];
    const domainParts = domain.split('.');
    const mainDomain = domainParts[0];
    
    // 更宽松的匹配：只要域名包含公司名称的任何关键词即可
    const hasCompanyKeyword = companyWords.some((word: string) => 
      mainDomain.includes(word) || word.includes(mainDomain)
    );

    // 如果域名长度大于3且没有匹配到公司关键词，给出警告但不拒绝
    if (!hasCompanyKeyword && mainDomain.length > 3) {
      console.log(`[Email Verification] Warning: Domain "${domain}" doesn't match company "${companyName}", but allowing for better UX`);
      // 不再返回错误，只是记录警告
    }

    if (action === 'send-code') {
      // 生成验证码
      const code = generateVerificationCode();
      const expires = Date.now() + 10 * 60 * 1000; // 10分钟过期
      
      // 存储验证码
      verificationCodes.set(email, { code, expires, companyName });

      // 发送验证码邮件 - 强制使用真实邮件发送
      const emailResult = await sendVerificationEmail(email, code, companyName);

      if (!emailResult.success) {
        // 如果邮件发送失败，清理验证码
        verificationCodes.delete(email);
        return NextResponse.json(
          { success: false, error: emailResult.error || 'Failed to send verification email' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully'
      });
    }

    if (action === 'verify-code') {
      console.log(`[Verify Code] Email: ${email}, Code: ${code}`);
      
      if (!code) {
        return NextResponse.json(
          { success: false, error: 'Verification code is required' },
          { status: 400 }
        );
      }

      const storedData = verificationCodes.get(email);
      console.log(`[Verify Code] Stored data:`, storedData);
      
      if (!storedData) {
        return NextResponse.json(
          { success: false, error: 'No verification code found for this email' },
          { status: 400 }
        );
      }

      if (Date.now() > storedData.expires) {
        verificationCodes.delete(email);
        return NextResponse.json(
          { success: false, error: 'Verification code has expired' },
          { status: 400 }
        );
      }

      console.log(`[Verify Code] Comparing: stored="${storedData.code}" vs input="${code}"`);
      if (storedData.code !== code) {
        return NextResponse.json(
          { success: false, error: 'Invalid verification code' },
          { status: 400 }
        );
      }

      // 验证成功，清理验证码
      verificationCodes.delete(email);

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 