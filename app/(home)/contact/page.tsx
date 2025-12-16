import { buildMetadata } from "@/lib/seo";
import ContactPage from "./contact-page";

export const metadata = buildMetadata({
  title: "Bog'lanish va fikr bildirish",
  description:
    "Interaktiv-ta'lim bo'yicha takliflaringizni yuboring, yangi o'yin va metodlar uchun g'oyalaringizni baham ko'ring.",
  path: "/contact",
  keywords: ["bog'lanish", "aloqa", "feedback", "qo'llab-quvvatlash"],
});

export default function ContactPageRoute() {
  return <ContactPage />;
}
