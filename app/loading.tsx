import { Loader2, Sparkles, BookOpen } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-edu-blue/5 to-edu-yellow/5">
      <div className="relative">
        {/* Floating decorative elements */}
        <div className="absolute -top-20 -left-20 w-32 h-32 bg-edu-blue/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-20 -right-20 w-32 h-32 bg-edu-yellow/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        {/* Main loading content */}
        <div className="relative flex flex-col items-center gap-8 p-8">
          {/* Animated icons */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-edu-blue to-edu-coral rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-8 rounded-full shadow-2xl">
              <BookOpen className="w-16 h-16 text-edu-blue animate-pulse" />
            </div>

            {/* Orbiting sparkles */}
            <Sparkles
              className="absolute -top-2 -right-2 w-6 h-6 text-edu-yellow animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <Sparkles
              className="absolute -bottom-2 -left-2 w-6 h-6 text-edu-coral animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            />
          </div>

          {/* Loading text */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-edu-blue animate-spin" />
              <h2 className="text-2xl font-bold bg-linear-to-r from-edu-blue via-edu-coral to-edu-yellow bg-clip-text text-transparent">
                Sahifa yuklanmoqda...
              </h2>
            </div>

            {/* Animated dots */}
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-edu-blue rounded-full animate-bounce" />
              <div
                className="w-3 h-3 bg-edu-yellow rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-3 h-3 bg-edu-coral rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
