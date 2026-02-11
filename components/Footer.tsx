import Link from "next/link";
import { FaInstagram, FaTelegram } from "react-icons/fa";
import Logo from "./logo";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-muted-foreground">
              Ta’limni barcha uchun qiziqarli va qulay qilamiz.{" "}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Foydali linklar</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-primary transition-colors"
                >
                  Xususiyatlar
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-primary transition-colors"
                >
                  Qanday ishlaydi
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="hover:text-primary transition-colors"
                >
                  Izohlar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Top o‘yinlar</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/resources/wheel-spin"
                  className="hover:text-primary transition-colors"
                >
                  Baraban metodi
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/word-search"
                  className="hover:text-primary transition-colors"
                >
                  So‘z topish o‘yini
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/millionaire-quiz"
                  className="hover:text-primary transition-colors"
                >
                  Millioner o‘yini
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Yangi o‘yinlar</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="/resources/krassword"
                  className="hover:text-primary transition-colors"
                >
                  Krassword
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/find-bigger"
                  className="hover:text-primary transition-colors"
                >
                  Kattasini top
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/find-english-word"
                  className="hover:text-primary transition-colors"
                >
                  Inglizcha so‘z o‘yini
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Interaktiv-ta&apos;lim. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              target="_blank"
              href="https://t.me/intertalim_uz"
              className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
              aria-label="Telegram"
              rel="noopener noreferrer"
            >
              <FaTelegram className="size-5 text-sky-600" />
              <span>Telegram kanalimiz</span>
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/interaktiv_talim"
              className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-medium text-pink-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2"
              aria-label="Instagram"
              rel="noopener noreferrer"
            >
              <FaInstagram className="size-5 text-pink-600" />
              <span>Instagram sahifamiz</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
