"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, Send } from "lucide-react";

export default function TestSMTPPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          companyName: "SMTP Test Company",
          action: 'send-code'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          message: "测试邮件发送成功！请检查您的邮箱收件箱。"
        });
      } else {
        setResult({
          success: false,
          message: data.error || "邮件发送失败，请检查SMTP配置。"
        });
      }
    } catch (error) {
      console.error('SMTP test error:', error);
      setResult({
        success: false,
        message: "网络错误或服务器配置问题。"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SMTP 邮件测试</h1>
          <p className="text-gray-600">测试您的SMTP邮件配置是否正确</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              邮件发送测试
            </CardTitle>
            <CardDescription>
              配置好.env.local文件后，使用此页面测试邮件发送功能
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleTestEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  测试邮箱地址 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  required
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  输入您想要接收测试邮件的邮箱地址
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full"
              >
                {loading ? (
                  <>发送中...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    发送测试邮件
                  </>
                )}
              </Button>
            </form>

            {/* 结果显示 */}
            {result && (
              <div
                className={`border rounded-md p-4 flex items-center gap-2 ${
                  result.success
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>{result.message}</span>
              </div>
            )}

            {/* 配置指南 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📝 配置检查清单：</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <div>✅ 已创建 .env.local 文件</div>
                <div>✅ 已配置 SMTP_HOST, SMTP_PORT</div>
                <div>✅ 已配置 SMTP_USER, SMTP_PASS</div>
                <div>✅ 已配置 SMTP_FROM</div>
                <div>✅ 已重启开发服务器</div>
              </div>
            </div>

            {/* 常见错误解决 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">⚠️ 常见问题：</h4>
              <div className="space-y-1 text-sm text-yellow-800">
                <div><strong>认证失败：</strong> 检查用户名密码是否正确</div>
                <div><strong>连接被拒绝：</strong> 检查SMTP主机和端口</div>
                <div><strong>邮件未收到：</strong> 检查垃圾邮件文件夹</div>
              </div>
            </div>

            {/* 配置示例 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">📋 .env.local 示例：</h4>
              <pre className="text-xs text-gray-700 bg-white p-2 rounded border overflow-x-auto">
{`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="QX Web" <your-email@gmail.com>`}
              </pre>
            </div>

            <div className="text-center">
              <a
                href="/SMTP_CONFIG_GUIDE.md"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                📖 查看完整配置指南
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 