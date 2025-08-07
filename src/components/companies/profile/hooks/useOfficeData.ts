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
import { OfficeType } from "../types";

export function useOfficeData(slugOrId: string) {
  const [offices, setOffices] = useState<OfficeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        if (!db) {
          setError("Database connection error");
          return;
        }
        if (!slugOrId) {
          setError("Invalid slug or ID");
          return;
        }

        // 首先获取公司信息，确定companyId
        let companyId = "";

        // 先尝试按slug查找公司
        const companiesRef = collection(db, "companies");
        const slugQuery = query(companiesRef, where("slug", "==", slugOrId));
        const slugSnapshot = await getDocs(slugQuery);

        if (!slugSnapshot.empty) {
          const companyData = slugSnapshot.docs[0].data();
          companyId = companyData.companyId || slugSnapshot.docs[0].id;
        } else {
          // 如果按slug找不到，尝试按ID查找
          const companyRef = doc(db, "companies", slugOrId);
          const companySnap = await getDoc(companyRef);
          if (companySnap.exists()) {
            const companyData = companySnap.data();
            companyId = companyData.companyId || companySnap.id;
          }
        }

        if (!companyId) {
          setError("Company not found");
          return;
        }

        console.log("Fetching offices for companyId:", companyId);

        const officesCol = collection(db, "offices");
        const q = query(officesCol, where("companyId", "==", companyId));
        const querySnapshot = await getDocs(q);

        console.log("Found offices:", querySnapshot.size);

        const officesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            officeId: doc.id,
            city: data.city || "",
            address: data.address || "",
            state: data.state || "",
            isHeadquarters: data.isHeadquarters || false,
            ...data,
          };
        });
        setOffices(officesData);
      } catch (error) {
        console.error("Error fetching offices:", error);
        setError("Error fetching offices");
      } finally {
        setLoading(false);
      }
    };
    fetchOffices();
  }, [slugOrId]);

  return { offices, loading, error };
}
