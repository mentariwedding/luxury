import Preloader from "../components/Preloader";
import CustomCursor from "../components/CustomCursor";
import SmoothScroll from "../components/SmoothScroll";
import AmbientMusic from "../components/AmbientMusic";
import BackToTop from "../components/BackToTop";
import PageTransition from "../components/PageTransition";
import FloatingInquiry from "../components/FloatingInquiry";
import Navbar from "../components/Navbar";
import AmbientBackground from "../components/AmbientBackground";
import SectionCounter from "../components/SectionCounter";

import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://mentariwedding.biz.id"),
  title: "Mentari Wedding | Wedding Organizer Sukabumi - Planned to Perfection",
  description:
    "Mentari Wedding - Wedding Organizer profesional di Sukabumi. Merangkai pernikahan impian dengan estetika timeless, dekorasi elegant, dan pelayanan penuh ketulusan. Konsultasi gratis via WhatsApp.",
  keywords: [
    "wedding organizer",
    "wedding organizer sukabumi",
    "wedding organizer cibadak",
    "jasa wedding cibadak",
    "pernikahan sukabumi",
    "dekorasi pernikahan cibadak",
    "wedding sukabumi",
    "WO sukabumi",
    "WO cibadak",
    "wedding planner",
    "mentari wedding",
  ],
  authors: [{ name: "Mentari Wedding" }],
  creator: "Mentari Wedding",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mentariwedding.biz.id",
    siteName: "Mentari Wedding",
    title:
      "Mentari Wedding | Wedding Organizer Sukabumi - Planned to Perfection",
    description:
      "Mentari Wedding - Wedding Organizer profesional di Sukabumi. Merangkai pernikahan impian dengan estetika timeless dan pelayanan penuh ketulusan.",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Mentari Wedding - Planned to Perfection",
      },
    ],
  },
  icons: {
    icon: "/images/logo.ico",
    shortcut: "/images/logo.ico",
    apple: "/images/logo.ico",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mentari Wedding | Wedding Organizer Sukabumi",
    description:
      "Merangkai pernikahan impian dengan estetika timeless dan pelayanan penuh ketulusan.",
    images: ["/images/logo.jpg"],
    creator: "@mentariwedding",
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
  verification: {
    google: 'toD2_lSjU_P9YBmwx90sG8x2xfaMe3qzgLBOIcp60sA',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "WeddingPlanning"],
        "@id": "https://mentariwedding.biz.id/#business",
        name: "Mentari Wedding",
        alternateName: "Mentari Wedding Organizer",
        description:
          "Wedding Organizer profesional di Sukabumi. Merangkai pernikahan impian dengan estetika timeless, dekorasi elegant, dan pelayanan penuh ketulusan.",
        url: "https://mentariwedding.biz.id",
        logo: "https://mentariwedding.biz.id/images/logo.jpg",
        image: "https://mentariwedding.biz.id/images/hero.JPG",
        telephone: "+628123456789",
        priceRange: "$$$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cibadak, Sukabumi",
          addressRegion: "Jawa Barat",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.9277,
          longitude: 106.93,
        },
        areaServed: [
          { "@type": "City", name: "Cibadak" },
          { "@type": "City", name: "Sukabumi" },
          { "@type": "State", name: "Jawa Barat" },
        ],
        serviceType: [
          "Wedding Organizer",
          "Wedding Planner",
          "Wedding Decoration",
          "Event Organizer",
        ],
        slogan: "Planned to Perfection",
        knowsAbout: [
          "wedding planning",
          "wedding decoration",
          "event management",
          "wedding photography coordination",
        ],
        sameAs: ["https://instagram.com/mentariwedding"],
      },
      {
        "@type": "WebSite",
        "@id": "https://mentariwedding.biz.id/#website",
        url: "https://mentariwedding.biz.id",
        name: "Mentari Wedding",
        description: "Wedding Organizer Sukabumi - Planned to Perfection",
        publisher: { "@id": "https://mentariwedding.biz.id/#business" },
        inLanguage: "id-ID",
      },
      {
        "@type": "WebPage",
        "@id": "https://mentariwedding.biz.id/#webpage",
        url: "https://mentariwedding.biz.id",
        name: "Mentari Wedding | Wedding Organizer Sukabumi",
        isPartOf: { "@id": "https://mentariwedding.biz.id/#website" },
        about: { "@id": "https://mentariwedding.biz.id/#business" },
        description:
          "Merangkai pernikahan impian dengan estetika timeless dan pelayanan penuh ketulusan.",
        inLanguage: "id-ID",
      },
      {
        "@type": "FAQPage",
        "@id": "https://mentariwedding.biz.id/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Berapa biaya wedding organizer Mentari Wedding?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mentari Wedding beroperasi dengan sistem By Inquiry Only. Kami tidak memiliki paket harga standar — setiap perayaan dirancang khusus sesuai visi dan kebutuhan unik pasangan. Hubungi kami melalui WhatsApp untuk konsultasi awal yang sepenuhnya gratis.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah Mentari Wedding melayani area luar Sukabumi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ya, Mentari Wedding melayani seluruh area Jawa Barat dan sekitarnya, termasuk Bogor, Bandung, dan Cianjur. Untuk venue di luar Jawa Barat, silakan hubungi kami untuk diskusi lebih lanjut.",
            },
          },
          {
            "@type": "Question",
            name: "Berapa bulan sebelumnya saya harus menghubungi Mentari Wedding?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Kami menyarankan untuk menghubungi kami minimal 6 bulan sebelum hari pernikahan. Karena Mentari Wedding hanya melayani klien terpilih setiap tahunnya, slot kami terbatas dan sering kali penuh jauh hari sebelumnya.",
            },
          },
          {
            "@type": "Question",
            name: "Apa yang membedakan Mentari Wedding dari wedding organizer lainnya di Sukabumi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Mentari Wedding mengutamakan pendekatan personal dan eksklusif. Kami membatasi jumlah klien per tahun untuk memastikan setiap pasangan mendapatkan perhatian penuh. Setiap detail — dari konsep dekorasi hingga alur acara — dirancang khusus, bukan dari template.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah Mentari Wedding menyediakan dekorasi pernikahan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ya, Mentari Wedding menyediakan layanan dekorasi pernikahan sebagai bagian dari paket wedding organizer kami. Kami bekerja dengan vendor dekorasi terpilih untuk menghadirkan estetika yang selaras dengan visi Anda.",
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen relative grain-overlay">
        <Preloader />
        <CustomCursor />
        <AmbientBackground />
        <SectionCounter />
        <SmoothScroll />
        <PageTransition />
        <BackToTop />
        <AmbientMusic />
        <FloatingInquiry />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
