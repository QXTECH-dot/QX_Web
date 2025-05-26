import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase/admin";

export async function GET() {
  const officesSnapshot = await firestore.collection("offices").get();

  const stateCounts: Record<string, number> = {};
  officesSnapshot.forEach(doc => {
    const data = doc.data();
    const state = data.state;
    if (state) {
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    }
  });

  return NextResponse.json(stateCounts);
} 