"use client";

import React from "react";
import { Save } from "lucide-react";
import { BlogModalFooterProps } from "../types";
import { calculateReadTime } from "@/lib/firebase/services/blog";

export function BlogModalFooter({
  formData,
  saving,
  saveSuccess,
  onClose,
  onSave,
}: BlogModalFooterProps) {
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
      <div className="text-sm text-gray-500">
        {formData.content.length} content blocks • ~
        {calculateReadTime(formData.content)} min read
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 font-medium disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : saveSuccess ? "Saved!" : "Save"}
        </button>
      </div>
    </div>
  );
}
