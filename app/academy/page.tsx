import { redirect } from "next/navigation";
import { academyUrl } from "@/lib/config/contact";

export default function Page() {
  redirect(academyUrl);
}
