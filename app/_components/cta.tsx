import { Button } from "@/components/ui/button";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="py-20 bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 text-center space-y-8 animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ta’limingizni yangi bosqichga olib chiqmoqchimisiz?
          </h2>
          <p className="text-xl opacity-90">
            Allaqachon minglab o‘quvchilar va ustozlar ta’limni qiziqarli va
            samarali qilmoqda.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={"/resources"}>
            <Button
              size="xl"
              className="bg-background text-foreground hover:bg-background/90 shadow-lg"
            >
              Bepul sinab ko‘rish <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
        {/* <div className="pt-4 text-sm opacity-80">
          No credit card required • 100% Free forever • Cancel anytime
        </div> */}
      </div>
    </section>
  );
};

export default Cta;

const ArrowRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
