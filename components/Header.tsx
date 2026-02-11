"use client";

import Link from "next/link";
import Logo from "./logo";
import HeaderAuthControls from "./header-auth-controls";
import HeaderMobileMenu from "./header-mobile-menu";
import { authClient } from "@/lib/auth-client";
import type { NavLink } from "./header-types";

const navLinks: NavLink[] = [
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
  const { data: session, isPending } = authClient.useSession();
  const headerUser = session?.user
    ? {
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      }
    : null;

  return (
    <nav className=" top-0 z-50 relative border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-0 flex items-center justify-between animate-fade-down">
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

          <HeaderAuthControls user={headerUser} isLoading={isPending} />
        </div>

        <HeaderMobileMenu
          navLinks={navLinks}
          user={headerUser}
          isLoading={isPending}
        />
      </div>
    </nav>
  );
};

export default Header;
