"use client";

import React, { useEffect } from "react";
import { ConfirmDialogState } from "../types";

interface ConfirmDialogProps {
  dialog: ConfirmDialogState;
  onClose: () => void;
}

export function ConfirmDialog({ dialog, onClose }: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dialog.show) {
        onClose();
      }
    };

    if (dialog.show) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [dialog.show, onClose]);

  if (!dialog.show) return null;

  const getButtonColors = () => {
    switch (dialog.type) {
      case "delete":
        return {
          confirm: "bg-red-600 hover:bg-red-700 text-white",
          cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
        };
      case "discard":
        return {
          confirm: "bg-yellow-600 hover:bg-yellow-700 text-white",
          cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
        };
      default:
        return {
          confirm: "bg-blue-600 hover:bg-blue-700 text-white",
          cancel: "bg-gray-300 hover:bg-gray-400 text-gray-800",
        };
    }
  };

  const buttonColors = getButtonColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-scale-in">
        <h3 className="text-lg font-semibold mb-4">{dialog.title}</h3>
        <p className="text-gray-600 mb-6">{dialog.message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              dialog.onCancel();
              onClose();
            }}
            className={`px-4 py-2 rounded ${buttonColors.cancel}`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              dialog.onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded ${buttonColors.confirm}`}
          >
            {dialog.type === "delete"
              ? "Delete"
              : dialog.type === "discard"
              ? "Discard"
              : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
