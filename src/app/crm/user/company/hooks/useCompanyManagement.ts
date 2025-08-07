"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getCompaniesByUser } from "@/lib/firebase/services/userCompany";
import { syncFirebaseAuth } from "@/lib/firebase/auth";
import { CompanyManagementState } from "../types";

export function useCompanyManagement() {
  const { data: session, status } = useSession();
  const [boundCompany, setBoundCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeout, setTimeoutFlag] = useState(false);
  const [isCheckingBind, setIsCheckingBind] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setTimeoutFlag(true), 3000);
    } else {
      setTimeoutFlag(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const checkBind = async () => {
      // Prevent duplicate calls
      if (isCheckingBind) {
        console.log("[Company Management] Already checking, skipping...");
        return;
      }

      console.log("[Company Management] Starting checkBind...");
      setIsCheckingBind(true);
      setError(null);

      // Get user email
      const userAny = session?.user as any;
      const userEmail = userAny?.email;
      const idToken = (session as any)?.idToken;

      try {
        if (status === "loading") {
          setLoading(true);
          setIsCheckingBind(false);
          return;
        }
        if (status === "unauthenticated") {
          setLoading(false);
          setError("Please log in first.");
          setIsCheckingBind(false);
          return;
        }
        if (status === "authenticated") {
          if (!userEmail) {
            setLoading(false);
            setError("User email missing, please re-login.");
            setIsCheckingBind(false);
            return;
          }

          // Try Firebase Auth sync, but don't require success
          if (idToken) {
            console.log(
              "[Company Management] Attempting Firebase Auth sync..."
            );
            try {
              const firebaseUser = await syncFirebaseAuth(idToken);
              if (firebaseUser) {
                console.log(
                  "[Company Management] Firebase Auth sync successful:",
                  firebaseUser.uid
                );
              } else {
                console.warn(
                  "[Company Management] Firebase Auth sync failed, but continuing..."
                );
              }
            } catch (error) {
              console.warn(
                "[Company Management] Firebase Auth error, but continuing:",
                error
              );
            }
          } else {
            console.warn(
              "[Company Management] No idToken available, but continuing..."
            );
          }

          // Brief wait
          await new Promise((resolve) => setTimeout(resolve, 300));

          console.log("[Company Management] Checking company binding...");
          try {
            const list = await getCompaniesByUser(userEmail);
            console.log("[Company Management] Company list:", list);

            if (list.length > 0) {
              console.log(
                "[Company Management] Found bound companies, redirecting to overview..."
              );
              router.push("/crm/user/company/overview");
            } else {
              console.log(
                "[Company Management] No bound companies, showing bind form..."
              );
              setLoading(false);
            }
          } catch (queryError: any) {
            console.error("[Company Management] Query error:", queryError);
            if (queryError.code === "permission-denied") {
              setError(
                "Database permission denied. Authentication may still be in progress. Please wait a moment and refresh."
              );
            } else {
              setError(`Database query failed: ${queryError.message}`);
            }
            setLoading(false);
            return;
          }
        }
      } catch (e: any) {
        console.error("[Company Management] Error:", e);
        setError(
          "Failed to check company binding. " +
            (e?.message || JSON.stringify(e))
        );
        setLoading(false);
      } finally {
        setIsCheckingBind(false);
      }
    };

    // Only run when session status changes to avoid infinite loop
    if (!hasInitialized && status !== "loading") {
      setHasInitialized(true);
      checkBind();
    }
  }, [session, status, hasInitialized, router]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReLogin = async () => {
    try {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  return {
    boundCompany,
    setBoundCompany,
    loading,
    error,
    timeout,
    isCheckingBind,
    handleRefresh,
    handleReLogin,
  };
}
