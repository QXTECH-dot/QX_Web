import nodemailer from 'nodemailer';

// 邮件发送结果接口
interface EmailResult {
  success: boolean;
  error?: string;
}

// 邮件配置
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
};

// 创建邮件传输器
const transporter = nodemailer.createTransport(emailConfig);

// 验证邮件配置
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}

// 开发环境的模拟邮件发送
export async function sendMockVerificationEmail(
  email: string, 
  code: string, 
  companyName: string
): Promise<EmailResult> {
  try {
    console.log('=== MOCK EMAIL VERIFICATION ===');
    console.log(`TO: ${email}`);
    console.log(`COMPANY: ${companyName}`);
    console.log(`VERIFICATION CODE: ${code}`);
    console.log('================================');
    
    // 模拟发送延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Mock email error:', error);
    return { success: false, error: 'Mock email failed' };
  }
}

// 生产环境的真实邮件发送
export async function sendVerificationEmail(
  email: string, 
  code: string, 
  companyName: string
): Promise<EmailResult> {
  try {
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 邮件内容
    const mailOptions = {
      from: process.env.SMTP_FROM || '"QX Net" <noreply@qixin.com.au>',
      to: email,
      subject: `Company Verification Code for ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #f59e0b; margin: 0;">QX Net</h1>
            <p style="color: #666; margin: 10px 0;">Company Verification</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Email Verification Required</h2>
            <p>Hello,</p>
            <p>You are verifying your management rights for <strong>${companyName}</strong>.</p>
            <p>Please enter the following verification code to complete the process:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #fff; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; display: inline-block;">
                <div style="font-size: 32px; font-weight: bold; color: #f59e0b; letter-spacing: 4px;">${code}</div>
              </div>
            </div>
            
            <p>This code will expire in 10 minutes.</p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 14px;">
            <p><strong>Security Notice:</strong></p>
            <ul>
              <li>This code is only valid for 10 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this verification, please ignore this email</li>
            </ul>
            
            <p style="margin-top: 20px;">
              Best regards,<br>
              QX Net Team
            </p>
          </div>
        </div>
      `,
    };

    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

// 统一的邮件发送接口
export async function sendEmail(
  email: string, 
  code: string, 
  companyName: string
): Promise<EmailResult> {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return sendMockVerificationEmail(email, code, companyName);
  } else {
    return sendVerificationEmail(email, code, companyName);
  }
} 