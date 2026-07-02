import { redirect } from "next/navigation";
import { defaultLanguage } from "@/lib/i18n";

// Root pekar alltid till default-språket
export default function RootPage() {
  redirect(`/${defaultLanguage}`);
}
