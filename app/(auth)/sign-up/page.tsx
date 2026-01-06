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
  UserPlus,
  Mail,
  Lock,
  User,
  Sparkles,
  Star,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100, { message: "Password must be less than 100 characters" }),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      // Better Auth orqali ro'yxatdan o'tish logikasi
      await authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.fullName,
          callbackURL: "/resources", // Ro'yxatdan o'tish muvaffaqiyatli bo'lsa yo'naltirish
        },

        {
          onRequest: () => {
            setIsLoading(true);
          },
          // Callback funksiyalari orqali ishlash holatini kuzatish
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: "/resources",
          newUserCallbackURL: "/resources",
          errorCallbackURL: "/sign-up",
          requestSignUp: true,
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
      toast.error("Google orqali ro‘yhatdan o‘tishda xatolik yuz berdi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-20 left-10 w-8 h-8 text-primary/20 animate-pulse" />
        <Sparkles className="absolute top-40 right-20 w-6 h-6 text-secondary/30 animate-bounce" />
        <BookOpen className="absolute bottom-20 left-20 w-10 h-10 text-primary/15 animate-pulse" />
        <Star className="absolute bottom-40 right-10 w-6 h-6 text-secondary/20 animate-bounce" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Bizga qo‘shiling
            </h1>
            <p className="text-muted-foreground">Shaxsiy akkaunt yarating</p>
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        To‘liq ism
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="To‘liq ism kiriting..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  {isLoading ? "Kuting..." : "Ro‘yhatdan o‘tish"}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground">
                  yoki davom eting
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={handleGoogleSignUp}
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
              Google orqali ro‘yhatdan o‘tish
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Akkauntigiz bormi?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:underline font-semibold"
              >
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
