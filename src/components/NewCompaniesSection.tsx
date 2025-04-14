"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// 公司数据接口
interface Company {
  id: string;
  name?: string;
  name_en?: string;
  location?: string;
  state?: string;
  shortDescription?: string;
  description?: string;
  logo?: string;
  verified?: boolean;
}

export function NewCompaniesSection() {
  const [newcomerCompanies, setNewcomerCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewCompanies = async () => {
      try {
        setLoading(true);
        
        if (!db) {
          console.error("Firestore 未初始化");
          setError("数据库连接错误，请稍后再试");
          return;
        }
        
        // 创建查询，按创建时间排序并限制返回4个结果
        const companiesRef = collection(db, "companies");
        const q = query(
          companiesRef,
          orderBy("createdAt", "desc"),
          limit(4)
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
            name: data.name_en || data.name || "未命名公司",
            location: data.state || "",
            shortDescription: data.shortDescription || "",
            logo: data.logo || "/images/default-company-logo.png",
            verified: data.verified || false,
          } as Company;
        });
        
        setNewcomerCompanies(companies);
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
            Today's Newcomers on QX Net
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
            Today's Newcomers on QX Net
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
            Today's Newcomers on QX Net
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

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Today's Newcomers on QX Net
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Latest companies that joined QX Net
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newcomerCompanies.map((company) => (
            <Card key={company.id} className="overflow-hidden flex flex-col h-full">
              <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 mr-3 flex items-center justify-center">
                    {company.logo ? (
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/default-company-logo.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400 text-xl">CO</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">
                      {company.name}
                      {company.verified && (
                        <span className="ml-1 text-xs text-primary">✓</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">{company.location}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {company.shortDescription || "No description available"}
                </p>
              </div>
              <div className="p-4 border-t flex justify-between">
                <Link href={`/company/${company.id}`}>
                  <Button variant="outline" size="sm">
                    View profile
                  </Button>
                </Link>
                <Link href={`/company/${company.id}/contact`}>
                  <Button variant="link" size="sm" className="text-primary">
                    Get In Touch
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/companies">
            <Button variant="outline">
              View All Companies
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
