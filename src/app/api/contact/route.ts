import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, companyEmail, companyName, defaultEmail } = body;

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 准备邮件内容
    const mailContent = `
      新的联系请求
      
      来自: ${name}
      邮箱: ${email}
      电话: ${phone || '未提供'}
      公司: ${company || '未提供'}
      
      消息内容:
      ${message}
      
      此消息是通过 ${companyName} 的公司页面发送的。
    `;

    // 确定收件人列表
    const recipients = [defaultEmail];
    if (companyEmail) {
      recipients.push(companyEmail);
    }

    // 发送邮件
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: recipients.join(', '),
      subject: `来自 ${name} 的新联系请求 - ${companyName}`,
      text: mailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 