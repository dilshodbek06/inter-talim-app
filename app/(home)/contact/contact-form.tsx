"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MessageSquare,
  Send,
  Sparkles,
  Star,
  Mail,
  User,
  Gamepad2,
} from "lucide-react";
import { FaInstagram, FaTelegram } from "react-icons/fa";
import { eduGames } from "@/mock/mock-data";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "To'liq ism kamida 3 ta belgidan iborat bo'lishi kerak",
    })
    .max(100, { message: "To'liq ism 100 ta belgidan oshib ketmasligi kerak" }),
  email: z
    .string()
    .trim()
    .email({ message: "Email formati noto'g'ri" })
    .max(255, { message: "Email 255 belgidan ko'p bo'lmasligi kerak" }),
  gameName: z.string().min(1, { message: "Iltimos o'yinni tanlang" }),
  message: z
    .string()
    .trim()
    .min(10, {
      message: "Xabar matni kamida 10 ta belgidan iborat bo'lishi kerak",
    })
    .max(2000, {
      message: "Xabar matni 2000 ta belgidan oshib ketmasligi kerak",
    }),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const GAME_OPTIONS = eduGames;

const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.NEXT_PUBLIC_CHAT_ID!;

const CONTACT_CARD_COLOR_STYLES = {
  accent: {
    bg: "bg-accent/10",
    text: "text-accent",
  },
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
  },
  secondary: {
    bg: "bg-secondary/10",
    text: "text-secondary",
  },
} as const;

type ContactCardColor = keyof typeof CONTACT_CARD_COLOR_STYLES;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      gameName: "",
      message: "",
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const message = `📩 New message from ${data.name}\n\n📧 Email: ${data.email}\n\n🎮 Game: ${data.gameName}\n\n📝 Message:\n${data.message}`;

    const { data: tgData } = await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });

    if (tgData.ok) {
      toast.success(
        "Xabaringiz muvaffaqiyatli yuborildi. Xabar qoldirganingiz uchun rahmat!",
      );
    }

    form.reset();
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-20  overflow-hidden">
      {/* Floating Educational Icons */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-edu-blue/20 dark:bg-edu-blue/10 rounded-full flex items-center justify-center animate-float backdrop-blur-sm">
        <MessageSquare className="w-8 h-8 text-edu-blue" />
      </div>
      <div className="absolute top-32 right-16 w-14 h-14 bg-edu-yellow/20 dark:bg-edu-yellow/10 rounded-full flex items-center justify-center animate-float-slow backdrop-blur-sm">
        <Star className="w-7 h-7 text-edu-yellow" />
      </div>
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-edu-coral/20 dark:bg-edu-coral/10 rounded-full flex items-center justify-center animate-float backdrop-blur-sm">
        <Sparkles className="w-6 h-6 text-edu-coral" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-6 animate-slide-up">
            <div className="inline-block px-4 py-2 bg-secondary/20 dark:bg-secondary/10 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-foreground">
                💬 Fikringizni eshitishni xohlaymiz
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-primary">Izohingizni </span>yuboring
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Platformani yanada yaxshilashga yordam bering! Fikr va
              takliflaringiz biz uchun juda muhim.
            </p>
          </div>

          {/* Feedback Form Card */}
          <Card className="border-2 hover:border-primary/50 transition-all duration-300 shadow-xl animate-scale-in">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Izoh qoldirish</h2>
                  <p className="text-muted-foreground">
                    Ta’limiy o‘yinlarimiz haqidagi fikringizni bizga ayting.
                  </p>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            To‘liq ism
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ismingizni yozing..."
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
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gameName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-primary" />
                          O‘yin nomi
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="O‘yinni tanlang" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {GAME_OPTIONS.map((game) => (
                              <SelectItem key={game.id} value={game.title}>
                                {game.textIcon} {game.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          Xabar matni
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Fikrlaringiz, takliflaringiz yoki duch kelgan xatoliklar haqida yozib qoldiring..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full md:w-auto group"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="mr-2 w-5 h-5 animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        Yuborish
                        <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in">
            {[
              {
                icon: FaInstagram,
                title: "Instagram",
                description: "@interaktiv_talim",
                color: "accent" as ContactCardColor,
                href: "https://www.instagram.com/interaktiv_talim/",
              },

              {
                icon: FaTelegram,
                title: "Telegram",
                description: "@intertalim_uz",
                color: "primary" as ContactCardColor,
                href: "https://t.me/intertalim_uz",
              },
              {
                icon: MessageSquare,
                title: "Aloqa vaqti",
                description: "har kun 24/7",
                color: "secondary" as ContactCardColor,
              },
            ].map((item) => {
              const style = CONTACT_CARD_COLOR_STYLES[item.color];
              const card = (
                <Card
                  key={item.title}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
                >
                  <CardContent className="p-6 text-center space-y-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform",
                        style.bg,
                      )}
                    >
                      <item.icon className={cn("w-6 h-6", style.text)} />
                    </div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );

              if (!item.href) return card;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${item.title} sahifasini ochish`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
                >
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
