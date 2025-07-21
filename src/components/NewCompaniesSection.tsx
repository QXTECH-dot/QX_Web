"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// 公司数据接口
interface Company {
  id: string;
  slug?: string;
  name_en?: string;
  state?: string;
  industry?: string;
  languages?: string[];
  logo?: string;
  verified?: boolean;
}

// 信息丰富度评分函数
function getCompanyInfoScore(company: Company): number {
  let score = 0;
  if (company.logo) score += 1;
  if (company.name_en) score += 1;
  if (company.industry) score += 1;
  if (company.state) score += 1;
  if (company.languages && company.languages.length > 0) score += 1;
  if (company.verified) score += 1;
  return score;
}

export function NewCompaniesSection() {
  const [newcomerCompanies, setNewcomerCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 跑马灯动画暂停/继续控制（必须放在顶部）
  const marqueeRef = useRef<HTMLDivElement>(null);
  const handleMouseEnter = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'paused';
    }
  };
  const handleMouseLeave = () => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = 'running';
    }
  };

  useEffect(() => {
    const fetchNewCompanies = async () => {
      try {
        setLoading(true);
        
        if (!db) {
          console.error("Firestore 未初始化");
          setError("数据库连接错误，请稍后再试");
          return;
        }
        
        // 创建查询，查全量公司（可选limit100）
        const companiesRef = collection(db, "companies");
        const q = query(
          companiesRef
          // 可选：limit(100)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.log("没有找到公司数据");
          setNewcomerCompanies([]);
          return;
        }
        
        // 将文档数据映射到公司对象
        const companies = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug,
            name_en: data.name_en || 'No Name',
            state: data.state || '',
            industry: data.industry || '',
            languages: data.languages || [],
            logo: data.logo || "/images/default-company-logo.png",
            verified: data.verified || false,
          } as Company;
        });
        
        // 按信息丰富度降序排序，取前10家
        companies.sort((a, b) => getCompanyInfoScore(b) - getCompanyInfoScore(a));
        setNewcomerCompanies(companies.slice(0, 10));
        console.log("获取到的新公司数据:", companies);
      } catch (error) {
        console.error("获取新公司数据时出错:", error);
        setError("无法加载最新公司数据。请稍后再试。");
      } finally {
        setLoading(false);
      }
    };

    fetchNewCompanies();
  }, []);

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Today's Newcomers on QX Web
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            Loading latest companies...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden flex flex-col h-full p-6">
                <div className="animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-md mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 如果出错，显示错误信息
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Today's Newcomers on QX Web
          </h2>
          <p className="text-center text-red-500 mb-10">{error}</p>
          <div className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              重试
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // 如果没有数据，显示无数据状态
  if (newcomerCompanies.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Today's Newcomers on QX Web
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            暂无最新加入的公司
          </p>
          <div className="text-center">
            <Link href="/companies">
              <Button variant="outline">
                浏览所有公司
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 卡片B：左侧logo+右侧信息分区+底部按钮，风格更偏向列表卡片
  function CompanyCardB({ company }: { company: Company }) {
    return (
      <Card className="flex flex-col min-w-[260px] max-w-[260px] h-[240px] shadow border border-gray-200 bg-white mx-2">
        <div className="flex items-center gap-3 p-3 pb-1">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <Image
              src={company.logo || "/images/default-company-logo.png"}
              alt={`${company.name_en} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base truncate">{company.name_en}</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-4 gap-1 mt-1">
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span className="font-medium">Industry</span>
            <span className="text-right break-words whitespace-normal line-clamp-2 max-w-[100px]">{company.industry || 'Not specified'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span className="font-medium">State</span>
            <span className="truncate text-right">{company.state || 'Not specified'}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span className="font-medium">Languages</span>
            <span className="truncate text-right">
              {Array.isArray(company.languages) && company.languages.length > 0
                ? company.languages.join(', ')
                : 'Not specified'}
            </span>
          </div>
        </div>
        <div className="p-3 pt-1 mt-auto">
          <Link href={`/company/${company.slug || company.id}`}>
            <Button variant="outline" className="w-full text-xs rounded">View profile</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // 跑马灯样式
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Today's Newcomers on QX Web
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Latest companies that joined QX Web
        </p>

        {/* 跑马灯容器 */}
        <div className="relative overflow-hidden w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={marqueeRef}
            className="flex gap-6 animate-marquee"
            style={{
              width: newcomerCompanies.length * 320 * 2,
              animation: `marquee 30s linear infinite`,
              animationPlayState: 'running',
            }}
          >
            {/* 原始10家公司 */}
            {newcomerCompanies.map((company, idx) => (
              <CompanyCardB key={company.id} company={company} />
            ))}
            {/* 复制一份用于无缝滚动 */}
            {newcomerCompanies.map((company, idx) => (
              <CompanyCardB key={`copy-${company.id}-${idx}`} company={company} />
            ))}
          </div>
        </div>
        {/* 跑马灯动画样式 */}
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            will-change: transform;
            display: flex;
          }
        `}</style>
      </div>
    </section>
  );
}
