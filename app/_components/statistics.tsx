import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Gamepad2,
  Star,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const Statistics = () => {
  return (
    <section className="py-20 bg-linear-to-r from-edu-blue/10 via-edu-yellow/10 to-edu-coral/10 dark:from-edu-blue/5 dark:via-edu-yellow/5 dark:to-edu-coral/5 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-edu-yellow/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-edu-coral/20 rounded-full blur-xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-edu-blue/20 rounded-full blur-xl animate-float" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full">
            <span className="text-sm font-semibold text-foreground">
              📊 Our Impact
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Making a Difference Every Day
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our growing community of learners and educators worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Users,
              number: "50,000+",
              label: "Active Users",
              color: "edu-blue",
              emoji: "👥",
            },
            {
              icon: Gamepad2,
              number: "2.5M+",
              label: "Games Played",
              color: "edu-yellow",
              emoji: "🎮",
            },
            {
              icon: Trophy,
              number: "98%",
              label: "Success Rate",
              color: "edu-coral",
              emoji: "🏆",
            },
            {
              icon: Award,
              number: "15,000+",
              label: "Certificates Earned",
              color: "primary",
              emoji: "🎓",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="relative group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card/80 backdrop-blur-sm relative overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-linear-to-br from-${stat.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <CardContent className="p-0 space-y-4 relative z-10">
                  {/* Icon with animated background */}
                  <div className="relative inline-block">
                    <div
                      className={`w-20 h-20 rounded-full bg-${stat.color}/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className={`w-10 h-10 text-${stat.color}`} />
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                      {stat.emoji}
                    </div>
                  </div>

                  {/* Animated Number */}
                  <div className="space-y-2">
                    <div
                      className={`text-5xl font-bold text-${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {stat.number}
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional Achievement Badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 animate-fade-in">
          {[
            { icon: Star, text: "4.9/5 Average Rating" },
            { icon: Target, text: "85% Improvement Rate" },
            { icon: Zap, text: "24/7 Learning Access" },
          ].map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-6 py-3 bg-card/80 backdrop-blur-sm rounded-full border-2 border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
