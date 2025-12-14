"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import Logo from "./logo";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/#features", label: "Xususiyatlar" },
  { href: "/#how-it-works", label: "Qanday ishlaydi" },
  { href: "/#testimonials", label: "Izohlar" },
  { href: "/contact", label: "Aloqa" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((s) => !s);

  const { data: user } = authClient.useSession();
  const router = useRouter();

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

          {user ? (
            <Button variant="default" size="sm" onClick={handleSignOut}>
              <LogOut /> Chiqish
            </Button>
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

      {/* Mobile menu without Framer Motion (CSS Transition/Conditional rendering) */}
      {/* Bu yerda 'AnimatePresence' o'rniga oddiy shartli renderlash ishlatiladi.
        Menyu ko'rinishini 'max-h' va 'opacity' yordamida taqlid qilamiz.
        Eslatma: 'max-h' asosidagi tranzitsiya silliqligi framer motion kabi ideal bo'lmaydi.
        Agar 'tailwindcss-motion' plaginida 'motion-slide-down' kabi animatsiyalar mavjud bo'lsa,
        undan foydalanish mumkin, ammo bu yechim umumiydir.
      */}
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

          {/* Auth controls */}
          {user ? (
            <div className="w-full">
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
