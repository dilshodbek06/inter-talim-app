import type { Metadata, Viewport } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const siteConfig = {
  name: "Interaktiv-ta'lim",
  shortName: "Interaktiv",
  description:
    "Interaktiv-ta'lim — o'qituvchilar va o'quvchilar uchun o'yinlar, viktorinalar va kreativ metodlar to'plami.",
  url: siteUrl,
  locale: "uz_UZ",
  keywords: [
    "interaktiv ta'lim",
    "o'qitish o'yinlari",
    "dars metodlari",
    "viktorina",
    "o'quvchilar uchun o'yin",
    "darsni qiziqarli qilish",
    "o'qituvchi platformasi",
  ],
  ogImage: "/images/hero-bg.png",
};

const defaultOpenGraph = {
  type: "website" as const,
  locale: siteConfig.locale,
  url: siteConfig.url,
  title: siteConfig.name,
  description: siteConfig.description,
  siteName: siteConfig.name,
  images: [
    {
      url: siteConfig.ogImage,
      width: 1200,
      height: 630,
      alt: `${siteConfig.name} cover`,
    },
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Ta'lim jarayonini qiziqarli va interaktiv qiling",
    template: "%s | Interaktiv-ta'lim",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  generator: "Next.js",
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: true,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: defaultOpenGraph,
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  category: "education",
};

export const defaultViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  colorScheme: "light dark",
};

type BuildMetadataProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
};

export const buildMetadata = ({
  title,
  description,
  path = "/",
  image,
  keywords,
}: BuildMetadataProps): Metadata => {
  const pageDescription = description ?? siteConfig.description;
  const ogImage = image ?? siteConfig.ogImage;

  const mergedKeywords = keywords?.length
    ? Array.from(new Set([...(siteConfig.keywords ?? []), ...keywords]))
    : siteConfig.keywords;

  return {
    title,
    description: pageDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...defaultOpenGraph,
      title,
      description: pageDescription,
      url: path,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: `${title} | ${siteConfig.name}`,
            },
          ]
        : defaultOpenGraph.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description: pageDescription,
      images: ogImage ? [ogImage] : defaultMetadata.twitter?.images,
    },
    keywords: mergedKeywords,
  };
};

export const getAbsoluteUrl = (path = "/") =>
  new URL(path, siteConfig.url).toString();
