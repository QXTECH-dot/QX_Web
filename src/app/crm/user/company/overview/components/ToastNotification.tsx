"use client";

import React, { useEffect } from "react";
import { ToastState } from "../types";

interface ToastNotificationProps {
  toast: ToastState | null;
  onClose: () => void;
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div
        className={`px-4 py-3 rounded shadow-lg ${
          toast.type === "success"
            ? "bg-green-100 border border-green-400 text-green-700"
            : "bg-red-100 border border-red-400 text-red-700"
        }`}
      >
        <div className="flex items-center justify-between">
          <span>{toast.message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
