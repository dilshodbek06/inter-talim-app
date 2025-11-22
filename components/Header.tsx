"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
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

  // useUser() client hook (authClient API ga mos)
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
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}

          {/* If user is logged in show sign out, otherwise show sign up */}
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

        {/* Hamburger button with Framer Motion */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-background/50 transition-colors"
            aria-label={isOpen ? "Yopish" : "Menyu ochish"}
            aria-expanded={isOpen}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile menu with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.24 }}
            className="md:hidden bg-background border-t border-border"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 },
                },
                hidden: {},
              }}
              className="flex flex-col items-start px-4 py-4 gap-4"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-medium text-foreground/80 hover:text-primary w-full block"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth controls: show sign-out if logged in, otherwise sign-up */}
              {user ? (
                <motion.div
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  className="w-full"
                >
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
                </motion.div>
              ) : (
                <motion.div
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  className="w-full"
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      Bepul qo‘shilish
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
