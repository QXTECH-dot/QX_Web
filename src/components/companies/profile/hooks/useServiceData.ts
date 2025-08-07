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
import { Service } from "@/types/service";

export function useServiceData(slugOrId: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!db) {
          console.error("Firebase database not initialized");
          setError("Database connection error");
          return;
        }

        if (!slugOrId) {
          console.error("Slug or ID is empty");
          setError("Invalid slug or ID");
          return;
        }

        console.log("Starting to fetch services data, slug or ID:", slugOrId);

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
          console.error("Could not find company or companyId");
          setError("Company not found");
          return;
        }

        console.log("Found companyId:", companyId);

        // 使用companyId查询services
        const servicesCol = collection(db, "services");
        const q = query(servicesCol, where("companyId", "==", companyId));

        const querySnapshot = await getDocs(q);
        console.log("Found services:", querySnapshot.size);

        if (querySnapshot.empty) {
          console.log("No services data found");
          setServices([]);
          return;
        }

        const servicesData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Single service data:", data);
          return {
            serviceId: doc.id,
            companyId: data.companyId,
            title: data.title,
            description: data.description,
          };
        });

        console.log("Processed services data:", servicesData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services data:", error);
        if (error instanceof Error) {
          setError(error.message);
          console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slugOrId]);

  return { services, loading, error };
}
