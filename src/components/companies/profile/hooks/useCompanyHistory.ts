"use client";

import { useState, useEffect } from "react";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { HistoryEventType } from "../types";

export function useCompanyHistory(id: string) {
  const [history, setHistory] = useState<HistoryEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!db) {
        console.error("Firestore not initialized");
        return;
      }

      try {
        setLoading(true);

        // 首先获取公司信息，确定companyId
        let companyId = "";

        // 先尝试按slug查找公司
        const companiesRef = collection(db, "companies");
        const slugQuery = query(companiesRef, where("slug", "==", id));
        const slugSnapshot = await getDocs(slugQuery);

        if (!slugSnapshot.empty) {
          const companyData = slugSnapshot.docs[0].data();
          companyId = companyData.companyId || slugSnapshot.docs[0].id;
        } else {
          // 如果按slug找不到，尝试按ID查找
          const companyRef = doc(db, "companies", id);
          const companySnap = await getDoc(companyRef);
          if (companySnap.exists()) {
            const companyData = companySnap.data();
            companyId = companyData.companyId || companySnap.id;
          }
        }

        if (!companyId) {
          console.error("Could not find company or companyId for history");
          setError("Company not found");
          return;
        }

        console.log("Fetching history for companyId:", companyId);

        const historyRef = collection(db, "history");
        const q = query(historyRef, where("companyId", "==", companyId));
        const querySnapshot = await getDocs(q);

        console.log(
          `获取公司 ID: ${companyId} 的历史数据，找到 ${querySnapshot.docs.length} 条记录`
        );

        if (querySnapshot.docs.length > 0) {
          console.log("History数据样本:", querySnapshot.docs[0].data());
        }

        const historyData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            year: data.date || data.year, // 使用date字段，回退到year
            event: data.description || data.event, // 使用description字段，回退到event
          };
        });

        // 按年份降序排序（最新的在前）
        historyData.sort((a, b) => {
          // 处理可能是字符串格式的年份
          const yearA = parseInt(String(a.year)) || 0;
          const yearB = parseInt(String(b.year)) || 0;
          return yearB - yearA;
        });

        console.log("处理后的history数据:", historyData);

        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("Failed to load company history data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id]);

  return { history, loading, error };
}
