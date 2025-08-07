"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getCompanyById,
  getOfficesByCompanyId,
  getServicesByCompanyId,
  getHistoryByCompanyId,
} from "@/lib/firebase/services/company";
import { getCompaniesByUser } from "@/lib/firebase/services/userCompany";
import { ConfirmDialogState, ToastState } from "../types";

export function useCompanyOverview() {
  const { data: session } = useSession();
  const [company, setCompany] = useState<any>(null);
  const [userCompany, setUserCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    show: false,
    title: "",
    message: "",
    type: "confirm",
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Logo裁剪相关状态
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>("");

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!session?.user?.email) {
          setError("User not authenticated");
          return;
        }

        // 获取用户与公司的绑定关系
        const userCompanies = await getCompaniesByUser(session.user.email);

        if (!userCompanies || userCompanies.length === 0) {
          setError("No company binding found for this user");
          return;
        }

        const userCompany = userCompanies[0];
        setUserCompany(userCompany);

        // 获取公司基本信息
        console.log(
          "[CompanyOverview] Attempting to get company details for ID:",
          userCompany.companyId
        );
        let companyDetails = await getCompanyById(userCompany.companyId);
        console.log(
          "[CompanyOverview] Company details result:",
          companyDetails
        );

        // 如果按原ID没找到，尝试一些常见的ID格式变换
        if (!companyDetails && userCompany.companyId) {
          console.log("[CompanyOverview] Trying alternative ID formats...");

          const alternativeIds = [
            userCompany.companyId.replace(/^COMP_/, ""),
            userCompany.companyId.replace(/^company_/, ""),
            `COMP_${userCompany.companyId}`,
            `company_${userCompany.companyId}`,
          ];

          for (const alternativeId of alternativeIds) {
            if (alternativeId !== userCompany.companyId) {
              console.log("[CompanyOverview] Trying ID:", alternativeId);
              companyDetails = await getCompanyById(alternativeId);
              if (companyDetails) {
                console.log(
                  "[CompanyOverview] Found company with alternative ID:",
                  alternativeId
                );
                break;
              }
            }
          }
        }

        if (companyDetails) {
          // 并行获取offices、services、history数据
          const [officesData, servicesData, historyData] = await Promise.all([
            getOfficesByCompanyId(userCompany.companyId).catch((err) => {
              console.log("[CompanyOverview] Failed to load offices:", err);
              return [];
            }),
            getServicesByCompanyId(userCompany.companyId).catch((err) => {
              console.log("[CompanyOverview] Failed to load services:", err);
              return [];
            }),
            getHistoryByCompanyId(userCompany.companyId).catch((err) => {
              console.log("[CompanyOverview] Failed to load history:", err);
              return [];
            }),
          ]);

          console.log("[CompanyOverview] Loaded additional data:", {
            offices: officesData.length,
            services: servicesData.length,
            history: historyData.length,
          });

          const updatedCompany = {
            ...companyDetails,
            offices:
              officesData.length > 0
                ? officesData.map((office: any) => ({
                    id: office.officeId,
                    city: office.city,
                    address: office.address,
                    state: office.state,
                    isHeadquarters: office.isHeadquarters || false,
                  }))
                : [
                    {
                      id: "office-001",
                      city: "Sydney",
                      address: "123 Business St, Sydney NSW 2000",
                      state: "NSW",
                      isHeadquarters: true,
                    },
                  ],
            services:
              servicesData.length > 0
                ? servicesData.map((service: any) => ({
                    id: service.serviceId,
                    title: service.title,
                    description: service.description,
                  }))
                : [
                    {
                      id: "service-001",
                      title: "Business Consulting",
                      description: "Strategic business consulting services",
                    },
                  ],
            history:
              historyData.length > 0
                ? historyData.map((history: any) => ({
                    id: history.historyId,
                    year: history.date,
                    event: history.description,
                  }))
                : [
                    {
                      id: "history-001",
                      year: "2012",
                      event: "VUE project launched",
                    },
                    {
                      id: "history-002",
                      year: "2018",
                      event: "Expanded operations to international markets",
                    },
                  ],
          };
          setCompany(updatedCompany);
        } else {
          console.log(
            "[CompanyOverview] Company not found, trying alternative search..."
          );
          setError(
            `Company information not found for ID: ${userCompany.companyId}. Please check the company binding or contact support.`
          );
        }
      } catch (error: any) {
        setError("Failed to load company data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, [session]);

  return {
    company,
    setCompany,
    userCompany,
    loading,
    error,
    editMode,
    setEditMode,
    editData,
    setEditData,
    saving,
    setSaving,
    toast,
    setToast,
    confirmDialog,
    setConfirmDialog,
    showCropper,
    setShowCropper,
    cropperImageSrc,
    setCropperImageSrc,
  };
}
