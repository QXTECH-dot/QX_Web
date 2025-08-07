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
import { Company } from "../types";

export function useCompanyData(id: string, initialData?: Company) {
  const [company, setCompany] = useState<Company | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If initialData is provided, use it and skip API call
    if (initialData) {
      const companyData = {
        ...initialData,
        name: initialData.name_en || initialData.name || "",
        logo: initialData.logo || "",
        industry: Array.isArray(initialData.industry)
          ? initialData.industry
          : [initialData.industry || "Other"],
      };
      setCompany(companyData);
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      try {
        if (!db) {
          console.error("Firebase database not initialized");
          return;
        }

        let companySnap;

        // 首先尝试按slug查找
        if (id) {
          const companiesRef = collection(db, "companies");
          const slugQuery = query(companiesRef, where("slug", "==", id));
          const slugSnapshot = await getDocs(slugQuery);

          if (!slugSnapshot.empty) {
            companySnap = slugSnapshot.docs[0];
          } else {
            // 如果按slug找不到，尝试按ID查找（向后兼容）
            const companyRef = doc(db, "companies", id);
            companySnap = await getDoc(companyRef);
          }
        }

        if (companySnap && companySnap.exists()) {
          const data = companySnap.data() as Company;
          const companyData = {
            ...data,
            id: companySnap.id,
            name: data.name_en || data.name || "",
            logo: data.logo || "",
            industry: Array.isArray(data.industry)
              ? data.industry
              : [data.industry || "Other"],
          };
          setCompany(companyData);
        } else {
          setError("Company not found");
        }
      } catch (err) {
        console.error("Error fetching company:", err);
        setError("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id, initialData]);

  return { company, loading, error };
}
