import { notFound } from "next/navigation";
import { branches } from "@/lib/data";
import { SITE_CONFIG } from "@/lib/config";
import BranchDetailsClient from "./BranchDetailsClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return branches.map((branch) => ({
    slug: branch.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug || b.id === slug);

  if (!branch) return {};

  return {
    title: `${branch.title} | Rich Inn Palace Chennai`,
    description: `${branch.title}. Executive and Suite stays with South Indian buffet breakfast, WiFi, 24/7 room service, and in-room mini bar.`,
    keywords: [
      branch.name,
      branch.title,
      "Rich Inn Palace Chennai",
      "T. Nagar Hotel Tariffs",
      "Vadapalani Hotel Tariffs",
      "Executive Room Chennai",
      "Suite Room Chennai",
    ],
    alternates: {
      canonical: `${SITE_CONFIG.domain}/branches/${branch.slug}`,
    },
    openGraph: {
      title: `${branch.title} | Rich Inn Palace Chennai`,
      description: branch.description,
      url: `${SITE_CONFIG.domain}/branches/${branch.slug}`,
      siteName: "Rich Inn Palace Hotel",
      images: [
        {
          url: branch.image,
          width: 1200,
          height: 630,
          alt: branch.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function BranchPage({ params }: Props) {
  const { slug } = await params;
  const branch = branches.find((b) => b.slug === slug || b.id === slug);

  if (!branch) {
    notFound();
  }

  return <BranchDetailsClient branch={branch} allBranches={branches} />;
}
