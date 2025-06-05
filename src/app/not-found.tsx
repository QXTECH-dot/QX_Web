"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">
          Back to Home
        </Link>
      </Button>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
} 