import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center justify-center">
        {/* <BookOpen className="h-6 w-6 text-primary-foreground" /> */}
        <Image
          alt="Interaktiv talim"
          src={"/images/logo.png"}
          width={40}
          height={90}
        />
      </div>
      <span className="text-2xl font-bold text-foreground">
        Interaktiv-ta&apos;lim
      </span>
    </Link>
  );
};

export default Logo;
