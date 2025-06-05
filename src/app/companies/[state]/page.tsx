"use client";

import React, { useEffect, useState, use } from "react";
import { useSearchParams, redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Link from "next/link";
import Image from "next/image";

export default function CompaniesByStatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = use(params);
  redirect(`/companies?location=${state.toUpperCase()}`);
  return null;
} 