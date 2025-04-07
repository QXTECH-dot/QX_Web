import { StartupFundingForm } from "@/components/StartupFundingForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fund My Start-up - QX Net",
  description: "Submit your startup details to connect with investors and secure funding for your business venture.",
};

export default function StartupFundingPage() {
  return <StartupFundingForm />;
}
