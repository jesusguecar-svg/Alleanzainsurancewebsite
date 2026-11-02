import { GuidesIndex } from "@/components/guides/GuidesIndex";
import { guideIndexMetadata } from "@/lib/seo/guides";

export const metadata = guideIndexMetadata("en");

export default function Page() {
  return <GuidesIndex locale="en" />;
}
