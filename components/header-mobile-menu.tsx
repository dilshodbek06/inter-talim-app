"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import type { HeaderUser, NavLink } from "./header-types";

type HeaderMobileMenuProps = {
  navLinks: NavLink[];
  user: HeaderUser | null;
};

export default function HeaderMobileMenu({
  navLinks,
  user,
}: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen((s) => !s);
  const closeMenu = () => setIsOpen(false);

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
      closeMenu();
      router.push("/sign-in");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <>
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-background/50 transition-colors"
          aria-label={isOpen ? "Yopish" : "Menyu ochish"}
          aria-expanded={isOpen}
        >
          <div
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </div>
        </button>
      </div>

      <div
        className={`md:hidden absolute left-0 right-0 top-full w-full bg-background border-t border-border overflow-hidden transition-all duration-300 ease-out 
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col items-start px-4 py-4 gap-4">
          {navLinks.map((link) => (
            <div key={link.href} className="w-full">
              <Link
                href={link.href}
                onClick={closeMenu}
                className="font-medium text-foreground/80 hover:text-primary w-full block transition-colors duration-300"
              >
                {link.label}
              </Link>
            </div>
          ))}

          {user ? (
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
                onClick={handleSignOut}
              >
                Chiqish
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <Button variant="default" size="sm" className="w-full" asChild>
                <Link href="/sign-up" onClick={closeMenu}>
                  Bepul qo‘shilish
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
