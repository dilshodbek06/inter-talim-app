import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

const Pricing = () => {
  return (
    <section className="py-20 bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-secondary/20 dark:bg-secondary/10 rounded-full backdrop-blur-sm">
            <span className="text-sm font-semibold text-foreground">
              🎓 Pricing
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your Learning Adventure
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Perfect for students, teachers, and schools of all sizes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 animate-scale-in group"
            style={{ animationDelay: "0s" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-edu-blue/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="text-5xl mb-4">🎮</div>
                <h3 className="text-2xl font-bold">Free Explorer</h3>
                <p className="text-muted-foreground">
                  Perfect for getting started
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">
                  $0
                  <span className="text-lg text-muted-foreground font-normal">
                    /forever
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  "Access to 50+ learning games",
                  "Basic progress tracking",
                  "Student dashboard",
                  "Community support",
                  "Weekly challenges",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-edu-blue mt-0.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full group-hover:bg-edu-blue group-hover:text-white transition-colors"
              >
                Start Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan - Most Popular */}
          <Card
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-secondary animate-scale-in group"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-secondary via-edu-yellow to-secondary" />
            <div className="absolute -top-1 -right-4 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-bold rotate-14 shadow-lg">
              ⭐ Popular
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-edu-yellow/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />

            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold">Pro Learner</h3>
                <p className="text-muted-foreground">For serious students</p>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">
                  $9
                  <span className="text-lg text-muted-foreground font-normal">
                    /month
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Billed monthly or $90/year
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Everything in Free",
                  "Unlimited game access",
                  "Advanced analytics & reports",
                  "Custom quiz builder",
                  "Priority support",
                  "Ad-free experience",
                  "Downloadable certificates",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 group-hover:scale-105 transition-transform shadow-lg">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* School Plan */}
          <Card
            className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 animate-scale-in group"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="text-5xl mb-4">🏫</div>
                <h3 className="text-2xl font-bold">School Edition</h3>
                <p className="text-muted-foreground">
                  For teachers & institutions
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-foreground">
                  Custom
                  <span className="text-lg text-muted-foreground font-normal block">
                    pricing
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  "Everything in Pro",
                  "Unlimited student accounts",
                  "Teacher admin dashboard",
                  "Class management tools",
                  "Bulk license management",
                  "Custom integrations",
                  "Dedicated account manager",
                  "Professional development",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
              >
                Contact Sales
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center space-y-4 animate-fade-in">
          <p className="text-muted-foreground">
            Trusted by 50,000+ students and teachers worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-edu-blue" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-edu-blue" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-edu-blue" />
              <span>Safe & secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
