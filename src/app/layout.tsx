import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import { SITE_CONFIG } from "@/lib/config";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: "Rich Inn Palace | Luxury Hotel & Sanctuary Chennai",
    template: "%s | Rich Inn Palace Chennai",
  },
  description: "Experience unhurried luxury at Rich Inn Palace Chennai. A quiet retreat of twenty-eight keys and dedicated butler care in T.Nagar.",
  keywords: ["Luxury Hotel Chennai", "Boutique Resort Tamil Nadu", "Rich Inn Palace Hotel Chennai", "Chennai Luxury Stay", "T.Nagar Resort", "Heritage Sanctuary Chennai"],
  authors: [{ name: "Rich Inn Palace Hospitality Group" }],
  creator: "Rich Inn Palace Hospitality Group",
  publisher: "Rich Inn Palace Hospitality Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Rich Inn Palace | Luxury Hotel & Sanctuary Chennai",
    description: "Experience unhurried luxury at Rich Inn Palace Chennai. A quiet retreat of twenty-eight keys and dedicated butler care.",
    url: SITE_CONFIG.domain,
    siteName: "Rich Inn Palace Hotel",
    images: [
      {
        url: "/images/rangon_street/1.jpeg",
        width: 1200,
        height: 630,
        alt: "Rich Inn Palace Chennai Luxury Sanctuary Suite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rich Inn Palace | Luxury Hotel & Sanctuary Chennai",
    description: "Experience unhurried luxury at Rich Inn Palace Chennai. A quiet retreat of twenty-eight keys and dedicated butler care.",
    images: ["/images/rangon_street/1.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  // Structured data for SEO (Hotel, Organization, LocalBusiness, WebSite)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Hotel",
        "@id": `${SITE_CONFIG.domain}/#hotel`,
        "name": "Rich Inn Palace",
        "description": "Experience unhurried luxury at Rich Inn Palace Chennai. A quiet retreat of twenty-eight keys and dedicated butler care in T.Nagar.",
        "image": `${SITE_CONFIG.domain}/images/photo1.avif`,
        "telephone": SITE_CONFIG.contact.phone,
        "email": SITE_CONFIG.contact.email,
        "url": SITE_CONFIG.domain,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Usman Road, T.Nagar",
          "addressLocality": "Chennai",
          "addressRegion": "Tamil Nadu",
          "postalCode": "600017",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "13.0418",
          "longitude": "80.2341"
        },
        "hasMap": SITE_CONFIG.contact.googleMapsUrl,
        "sameAs": [
          "https://instagram.com/richinnpalace"
        ],
        "priceRange": "₹₹₹₹",
        "numberOfRooms": 28,
        "checkinTime": "14:00",
        "checkoutTime": "12:00",
        "amenityFeature": [
          { "@type": "LocationFeatureSpecification", "name": "Private Butler Care", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Free High-Speed Wi-Fi", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Swimming Pool", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Fine Dining Restaurant", "value": true }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.domain}/#organization`,
        "name": "Rich Inn Palace",
        "url": SITE_CONFIG.domain,
        "logo": `${SITE_CONFIG.domain}/images/rangon_street/1.jpeg`,
        "sameAs": [
          "https://instagram.com/richinnpalace"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.domain}/#website`,
        "url": SITE_CONFIG.domain,
        "name": "Rich Inn Palace Chennai",
        "publisher": {
          "@id": `${SITE_CONFIG.domain}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_CONFIG.domain}/rooms?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-dark text-text-offwhite overflow-x-hidden selection:bg-gold selection:text-bg-dark font-sans">
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
        <Navbar />
        <main className="flex-grow flex flex-col pt-0 pb-20 md:pb-0">
          {children}
          {modal}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
