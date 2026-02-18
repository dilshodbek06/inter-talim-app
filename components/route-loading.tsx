import { Loader2, Sparkles, BookOpen } from "lucide-react";

const DEFAULT_TITLE = "Sahifa yuklanmoqda...";
const DEFAULT_SUBTITLE = "Iltimos, biroz kuting.";

type RouteLoadingProps = {
  title?: string;
  subtitle?: string;
  overlay?: boolean;
};

const RouteLoading = ({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  overlay = false,
}: RouteLoadingProps) => {
  const wrapperClass = overlay ? "fixed inset-0 z-50" : "min-h-screen";

  return (
    <div
      className={`${wrapperClass} flex items-center justify-center bg-linear-to-br from-background via-edu-blue/5 to-edu-yellow/5 cursor-wait`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-32 h-32 bg-edu-blue/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-20 -right-20 w-32 h-32 bg-edu-yellow/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />

        <div className="relative flex flex-col items-center gap-8 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-edu-blue to-edu-coral rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-8 rounded-full shadow-2xl">
              <BookOpen className="w-16 h-16 text-edu-blue animate-pulse" />
            </div>

            <Sparkles
              className="absolute -top-2 -right-2 w-6 h-6 text-edu-yellow animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <Sparkles
              className="absolute -bottom-2 -left-2 w-6 h-6 text-edu-coral animate-spin"
              style={{ animationDuration: "4s", animationDirection: "reverse" }}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-edu-blue animate-spin" />
              <h2 className="text-2xl font-bold bg-linear-to-r from-edu-blue via-edu-coral to-edu-yellow bg-clip-text text-transparent">
                {title}
              </h2>
            </div>

            <p className="text-sm text-slate-600 text-center max-w-sm">
              {subtitle}
            </p>

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

export default RouteLoading;
