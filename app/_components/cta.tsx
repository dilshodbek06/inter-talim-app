import { Button } from "@/components/ui/button";
import Link from "next/link";
// ArrowRight endi lucide-react dan import qilinadi
import { ArrowRight } from "lucide-react";

const Cta = () => {
  return (
    <section
      className="py-20 bg-accent text-accent-foreground"
      data-aos="fade-up"
      data-aos-offset="100"
    >
      <div className="container mx-auto px-4 text-center space-y-8">
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
