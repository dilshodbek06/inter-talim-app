"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Logo from "./logo";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserMenu, { UserMenuSkeleton } from "./user-menu";

const navLinks = [
  { href: "/#features", label: "Xususiyatlar" },
  { href: "/#how-it-works", label: "Qanday ishlaydi" },
  { href: "/#testimonials", label: "Izohlar" },
  { href: "/contact", label: "Aloqa" },
];

// const languages = [
//   { code: "uz", label: "O'zbekcha", short: "UZ", flag: "🇺🇿" },
//   { code: "ru", label: "Русский", short: "RU", flag: "🇷🇺" },
//   { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
// ];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((s) => !s);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();

  const displayName =
    user?.name || user?.email?.split("@")[0] || "Foydalanuvchi";
  const displayEmail = user?.email || "";
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between animate-fade-down">
        {/* Logo */}
        <Logo />

        {/* Desktop navigation (o'zgarishsiz qoladi) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-foreground/80 transition-colors hover:text-primary animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {link.label}
            </Link>
          ))}

          {/* <LanguageDropdown
            languages={languages}
            language={language}
            onChange={setLanguage}
          /> */}

          {isPending ? (
            <UserMenuSkeleton />
          ) : user ? (
            <UserMenu
              user={user}
              onNavigateResources={() => router.push("/resources")}
              onSignOut={handleSignOut}
            />
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link href="/sign-up">Bepul qo‘shilish</Link>
            </Button>
          )}
        </div>

        {/* Hamburger button without Framer Motion */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-background/50 transition-colors"
            aria-label={isOpen ? "Yopish" : "Menyu ochish"}
            aria-expanded={isOpen}
          >
            {/* Elementni aylantirish uchun CSS Transition ishlatildi */}
            <div
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-background border-t border-border overflow-hidden transition-all duration-300 ease-out 
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col items-start px-4 py-4 gap-4">
          {/* Har bir link endi 'motion.div' emas, balki oddiy 'div' ichida */}
          {navLinks.map((link) => (
            <div key={link.href} className="w-full">
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-medium text-foreground/80 hover:text-primary w-full block transition-colors duration-300"
              >
                {link.label}
              </Link>
            </div>
          ))}

          {/* <div className="w-full">
            <LanguageDropdown
              languages={languages}
              language={language}
              onChange={setLanguage}
              align="start"
            />
          </div> */}

          {/* Auth controls */}
          {isPending ? (
            <div className="w-full">
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-background/80 px-3 py-2 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-muted/70 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-muted/70 animate-pulse" />
                  <div className="h-2.5 w-2/3 rounded bg-muted/70 animate-pulse" />
                </div>
              </div>
              <div className="h-9 w-full rounded-md bg-muted/70 animate-pulse" />
            </div>
          ) : user ? (
            <div className="w-full">
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-background/80 px-3 py-2 shadow-sm">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image || ""} alt={displayName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {userInitials || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {displayEmail}
                  </p>
                </div>
              </div>
              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
              >
                Chiqish
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <Button variant="default" size="sm" className="w-full" asChild>
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  Bepul qo‘shilish
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
