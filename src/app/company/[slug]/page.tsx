"use client";

import { CompanyProfile } from "@/components/companies/CompanyProfile";
import { Suspense } from "react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";

export default function CompanyProfilePage({ params }: { params: { slug: string } }) {
  // 动态SEO数据
  const [seo, setSeo] = useState({ title: '', description: '' });

  useEffect(() => {
    // 这里可以根据实际API获取公司信息，简化处理：
    async function fetchCompany() {
      try {
        const res = await fetch(`/api/companies/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setSeo({
            title: `${data.name_en || data.name} - QX Web 公司信息`,
            description: data.fullDescription || data.shortDescription || data.description || `${data.name_en || data.name}公司简介、服务、联系方式、历史等信息。`
          });
        } else {
          setSeo({ title: '公司信息 - QX Net', description: '查看公司详细信息、服务、历史、联系方式等。' });
        }
      } catch {
        setSeo({ title: '公司信息 - QX Net', description: '查看公司详细信息、服务、历史、联系方式等。' });
      }
    }
    fetchCompany();
  }, [params.slug]);

  return (
    <>
      <NextSeo title={seo.title} description={seo.description} />
      <div className="w-full px-4 sm:px-6 lg:max-w-[calc(100%-250px)] lg:mx-auto lg:px-0">
        <Suspense fallback={<div>Loading...</div>}>
          <CompanyProfile id={params.slug} />
        </Suspense>
      </div>
    </>
  );
}
