"use client";

import { TextLoop } from "@/components/text-loop";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const { data: user } = authClient.useSession();
  const router = useRouter();

  const handleClick = () => {
    if (user?.user) {
      router.push("/resources");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <section
      className="relative py-16 sm:py-24 overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="900"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-5"
        style={{ backgroundImage: `url(/images/hero-bg.png)` }}
      />

      {/* Floating Educational Icons */}
      <GradientItems />
      <div className="container z-2 relative mx-auto px-4">
        <div
          className="max-w-4xl mx-auto text-center space-y-6 animate-slide-up"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <div className="inline-block px-4 py-2 bg-secondary/20 dark:bg-secondary/10 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold text-foreground">
              🎉 25+ O‘qituvchilar safiga qo‘shiling
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Ta&apos;lim jarayoni biz bilan{" "}
            </h1>
            <h1 className="text-primary text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <TextLoop>
                {["Qiziqarli", "Interaktiv", "Raqamli"].map((text) => (
                  <span key={text} className="block text-left">
                    {text}
                  </span>
                ))}
              </TextLoop>
            </h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interaktiv o‘yinlar, viktorinalar va o‘qitish vositalari — hammasi
            bir joyda. O‘rganish va o‘qitish usulingizni boyiting.
          </p>
          <div className="flex gap-2 sm:gap-4 justify-center w-full">
            <Button
              onClick={handleClick}
              variant="hero"
              size="xl"
              className="group px-1 sm:px-8 flex-1 sm:flex-none min-w-0 justify-center"
            >
              Hozir boshlash
              <ArrowRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Link href="/resources" className="flex-1 sm:flex-none min-w-0">
              <Button
                variant="hero-outline"
                size="xl"
                className="w-full justify-center"
              >
                O‘yinlarni ko‘rish
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 justify-center pt-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-secondary text-secondary" />
              <Star className="w-5 h-5 fill-secondary text-secondary" />
              <Star className="w-5 h-5 fill-secondary text-secondary" />
              <Star className="w-5 h-5 fill-secondary text-secondary" />
              <Star className="w-5 h-5 fill-secondary text-secondary" />
            </div>
            <span className="text-sm text-muted-foreground">
              O‘qituvchilar 4.7 bilan baholadi
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

function GradientItems() {
  return (
    <div>
      <div className="absolute top-20 left-10 w-16 h-16 bg-edu-blue/10 dark:bg-edu-blue/10 rounded-full flex items-center justify-center animate-float backdrop-blur-sm">
        <BookOpen className="w-8 h-8 text-edu-blue" />
      </div>
      <div className="absolute top-32 right-16 w-14 h-14 bg-edu-yellow/20 dark:bg-edu-yellow/10 rounded-full flex items-center justify-center animate-float-slow backdrop-blur-sm">
        <GraduationCap className="w-7 h-7 text-edu-yellow-dark" />
      </div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-edu-coral/20 dark:bg-edu-coral/10 rounded-full flex items-center justify-center animate-float backdrop-blur-sm">
        <Brain className="w-6 h-6 text-edu-coral" />
      </div>
      <div className="absolute top-1/2 right-32 w-16 h-16 bg-secondary/20 dark:bg-secondary/10 rounded-full flex items-center justify-center animate-float-slow backdrop-blur-sm">
        <Lightbulb className="w-8 h-8 text-secondary" />
      </div>
      <div className="absolute bottom-20 right-1/4 w-14 h-14 bg-primary/20 dark:bg-primary/10 rounded-full flex items-center justify-center animate-float backdrop-blur-sm">
        <Sparkles className="w-7 h-7 text-primary" />
      </div>
      <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-accent/20 dark:bg-accent/10 rounded-full flex items-center justify-center animate-float-slow backdrop-blur-sm">
        <Gamepad2 className="w-6 h-6 text-accent" />
      </div>
    </div>
  );
}
