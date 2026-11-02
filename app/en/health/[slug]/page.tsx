import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/components/guides/GuidePage";
import { getGuide, guides } from "@/lib/content/guides";
import { guideMetadata } from "@/lib/seo/guides";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.en.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide("en", (await params).slug);
  return guide ? guideMetadata(guide, "en") : {};
}

export default async function Page({ params }: Props) {
  const guide = getGuide("en", (await params).slug);
  if (!guide) notFound();
  return <GuidePage guide={guide} locale="en" />;
}
