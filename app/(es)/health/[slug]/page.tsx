import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/components/guides/GuidePage";
import { getGuide, guides } from "@/lib/content/guides";
import { guideMetadata } from "@/lib/seo/guides";

export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.es.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide("es", (await params).slug);
  return guide ? guideMetadata(guide, "es") : {};
}

export default async function Page({ params }: Props) {
  const guide = getGuide("es", (await params).slug);
  if (!guide) notFound();
  return <GuidePage guide={guide} locale="es" />;
}
