"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Company } from "../types";

export function useSimilarCompanies(currentCompany: Company | null) {
  const [similarCompanies, setSimilarCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarCompanies = async () => {
      if (!db || !currentCompany) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching similar companies for:", currentCompany);

        // 获取所有公司
        const companiesSnapshot = await getDocs(collection(db, "companies"));
        const allCompanies = companiesSnapshot.docs
          .map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Company)
          )
          .filter((comp: Company) => comp.id !== currentCompany.id); // 排除当前公司

        console.log("All companies fetched:", allCompanies.length);

        // 按优先级筛选同行业公司
        const thirdIndustryMatches: Company[] = [];
        const secondIndustryMatches: Company[] = [];
        const firstIndustryMatches: Company[] = [];

        allCompanies.forEach((comp: Company) => {
          // 优先级1: 第三行业一致
          if (
            currentCompany.third_industry &&
            comp.third_industry === currentCompany.third_industry
          ) {
            thirdIndustryMatches.push(comp);
          }
          // 优先级2: 第二行业一致
          else if (
            currentCompany.second_industry &&
            comp.second_industry === currentCompany.second_industry
          ) {
            secondIndustryMatches.push(comp);
          }
          // 优先级3: 第一行业一致
          else if (
            currentCompany.industry &&
            comp.industry === currentCompany.industry
          ) {
            firstIndustryMatches.push(comp);
          }
        });

        console.log("Industry matches:", {
          third: thirdIndustryMatches.length,
          second: secondIndustryMatches.length,
          first: firstIndustryMatches.length,
        });

        // 按优先级合并，最多取3家
        const similarCompaniesList = [
          ...thirdIndustryMatches,
          ...secondIndustryMatches,
          ...firstIndustryMatches,
        ].slice(0, 3);

        setSimilarCompanies(similarCompaniesList);
        console.log("Final similar companies:", similarCompaniesList);
      } catch (error) {
        console.error("Error fetching similar companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarCompanies();
  }, [currentCompany]);

  return { similarCompanies, loading };
}
