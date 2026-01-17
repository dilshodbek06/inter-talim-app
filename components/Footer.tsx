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
            <h4 className="font-bold mb-4">Huquqiy</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2026 Interaktiv-ta&apos;lim. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex gap-4">
            <Link
              target="_blank"
              href="https://t.me/intertalim_uz"
              className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
              aria-label="Telegram"
            >
              <FaTelegram className="size-6 text-sky-500" />
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com/interaktiv_talim"
              className="text-muted-foreground hover:scale-110 transition-all duration-300 hover:text-primary "
              aria-label="Instagram"
            >
              <FaInstagram className="size-6  text-pink-500" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
