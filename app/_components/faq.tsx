import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Intertalim.uz qanday platforma?",
    answer:
      "Intertalim.uz — ta’limni o‘yinlar orqali qiziqarli va samarali qilishga xizmat qiluvchi platforma. Unda o‘quvchilar fanlar bo‘yicha interaktiv topshiriqlarni bajarib, bilimlarini mustahkamlaydi.",
  },
  {
    question: "Platformadan kimlar uchun?",
    answer:
      "Platforma o‘quvchilar, o‘qituvchilar va ota-onalar uchun mo‘ljallangan. Unda turli yosh guruhlari uchun mos kontent mavjud bo‘lib, individual o‘qish hamda sinf bilan ishlash jarayonida birdek foydali.",
  },
  {
    question: "Platformadan foydalanish bepulmi?",
    answer:
      "Ha, platformadan foydalanish hozirda mutlaqo bepul. Siz o'yin va metodlarni dars jarayonida bemalol sinab ko'rishingiz mumkin.",
  },
  {
    question: "Ro'yxatdan o'tmasdan ham o'yinlarni ishlata olamanmi?",
    answer:
      "Ha, hozirgi test rejimida platformadagi barcha o'yinlarni ro'yxatdan o'tmasdan ham sinab ko'rishingiz mumkin.",
  },
  {
    question: "Qaysi fanlar uchun o'yinlar mavjud?",
    answer:
      "Platformada deyarli barcha asosiy maktab fanlari bo‘yicha interaktiv o‘yinlar, mashqlar va topshiriqlar mavjud.",
  },
  {
    question: "Telefon orqali ham ishlaydimi?",
    answer:
      "Ha, platforma mobil qurilmalarga moslashtirilgan. Telefon, planshet va kompyuterda qulay ishlaydi.",
  },
  {
    question: "Yangi o'yinlar qachon qo'shiladi?",
    answer:
      "Platforma muntazam yangilanadi. Yangi o'yinlar va metodlar bosqichma-bosqich qo'shib boriladi.",
  },
  {
    question: "Taklif yoki muammo bo'lsa qayerga yozaman?",
    answer:
      "Asosiy menyudagi kontakt sahifasi orqali murojaat qilishingiz mumkin. Sizning fikringiz platformani yaxshilashga yordam beradi.",
  },
];

const Faq = () => {
  return (
    <section
      id="faq"
      className="py-20 bg-muted/20"
      data-aos="fade-up"
      data-aos-offset="120"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Tez-tez so&apos;raladigan savollar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Platformadan foydalanish bo&apos;yicha savollarga qisqa javoblar
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-border bg-card px-6 py-5 shadow-xs hover:shadow-md transition-shadow"
              data-aos="fade-up"
              data-aos-delay={80 + index * 50}
            >
              <summary className="cursor-pointer list-none text-lg font-semibold text-foreground pr-1 flex items-start justify-between gap-3">
                <span>{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
