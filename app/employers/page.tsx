import type { Metadata } from "next";
import EmployerLanding from "@/components/EmployerLanding";

export const metadata: Metadata = {
  title: "Supplemental Employee Benefits for Employers | Alleanza Insurance",
  description:
    "Explore voluntary supplemental insurance benefits for your workforce with clear, licensed guidance and hands-on enrollment support from Alleanza Insurance.",
  keywords: [
    "supplemental insurance for employees",
    "voluntary employee benefits",
    "employer supplemental benefits",
    "worksite benefits",
    "employee benefits enrollment",
  ],
  alternates: { canonical: "/employers" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/employers",
    siteName: "Alleanza Insurance",
    title: "Benefits that help your people feel protected",
    description:
      "A practical path to voluntary supplemental benefits, with enrollment support for your organization and your employees.",
  },
};

export default function Page() {
  return <EmployerLanding />;
}
