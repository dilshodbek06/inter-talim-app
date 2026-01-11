import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center">
        {/* <BookOpen className="h-6 w-6 text-primary-foreground" /> */}
        <Image
          alt="Interaktiv talim"
          src={"/images/logo.png"}
          width={80}
          height={90}
        />
        <h1 className="text-2xl font-bold text-foreground">
          Interaktiv-ta&apos;lim
        </h1>
      </div>
    </Link>
  );
};

export default Logo;
