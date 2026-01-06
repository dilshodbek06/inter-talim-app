"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  LogIn,
  Mail,
  Lock,
  Sparkles,
  Star,
  BookOpen,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email manzil noto‘g‘ri kiritilgan" })
    .max(255, { message: "Email manzil 255 ta belgidan oshmasligi kerak" }),

  password: z.string().min(1, { message: "Parol kiritish majburiy" }),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/resources",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            router.push("/resources");
            setIsLoading(false);
            form.reset();
          },
          onError: (ctx) => {
            console.log(ctx.error);
            toast.error(ctx.error.message);
            setIsLoading(false);
          },
        }
      );
    } catch (e: unknown) {
      console.log(e);
      toast.error("Kirishda xatolik yuz berdi.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/resources",
          errorCallbackURL: "/sign-in",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: (ctx) => {
            const { url, redirect } = ctx.data ?? {};
            if (redirect && url && typeof window !== "undefined") {
              window.location.href = url;
              return;
            }
            router.push("/resources");
            setIsLoading(false);
          },
          onError: (ctx) => {
            console.log(ctx.error);
            toast.error(ctx.error.message);
            setIsLoading(false);
          },
        }
      );
    } catch (e: unknown) {
      console.log(e);
      toast.error("Google orqali kirishda xatolik yuz berdi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-linear-to-br from-background via-secondary/5 to-primary/10 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Rocket className="absolute top-20 left-10 w-8 h-8 text-secondary/20 animate-pulse" />
        <Sparkles className="absolute top-40 right-20 w-6 h-6 text-primary/30 animate-bounce" />
        <BookOpen className="absolute bottom-20 left-20 w-10 h-10 text-secondary/15 animate-pulse" />
        <Star className="absolute bottom-40 right-10 w-6 h-6 text-primary/20 animate-bounce" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/10 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Xush kelibsiz!
            </h1>
            <p className="text-muted-foreground">
              Davom etish uchun profilingizga kiring
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-3xl shadow-xl p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email kiriting..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Parol
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Parol kiriting..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Kuting..." : "Kirish"}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  yoki davom etish
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google orqali kirish
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Akkauntingiz hali yoqmi?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:underline font-semibold"
              >
                Ro‘yhatdan o‘tish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
