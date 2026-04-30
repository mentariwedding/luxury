import Preloader from '../components/Preloader';
import SmoothScroll from '../components/SmoothScroll';
import AmbientMusic from '../components/AmbientMusic';
import FloatingGoldThread from '../components/FloatingGoldThread';
import BackToTop from '../components/BackToTop';

import './globals.css';

export const metadata = {
  metadataBase: new URL('https://mentariwedding.id'),
  title: 'Mentari Wedding | Wedding Organizer Sukabumi - Planned to Perfection',
  description: 'Mentari Wedding - Wedding Organizer profesional di Sukabumi. Merangkai pernikahan impian dengan estetika timeless, dekorasi elegant, dan pelayanan penuh ketulusan. Konsultasi gratis via WhatsApp.',
  keywords: ['wedding organizer', 'wedding organizer sukabumi', 'pernikahan sukabumi', 'dekorasi pernikahan', 'wedding sukabumi', 'WO sukabumi', 'wedding planner', 'mentari wedding'],
  authors: [{ name: 'Mentari Wedding' }],
  creator: 'Mentari Wedding',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://mentariwedding.id',
    siteName: 'Mentari Wedding',
    title: 'Mentari Wedding | Wedding Organizer Sukabumi - Planned to Perfection',
    description: 'Mentari Wedding - Wedding Organizer profesional di Sukabumi. Merangkai pernikahan impian dengan estetika timeless dan pelayanan penuh ketulusan.',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Mentari Wedding - Planned to Perfection',
      },
    ],
  },
  icons: {
    icon: '/images/logo.ico',
    shortcut: '/images/logo.ico',
    apple: '/images/logo.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mentari Wedding | Wedding Organizer Sukabumi',
    description: 'Merangkai pernikahan impian dengan estetika timeless dan pelayanan penuh ketulusan.',
    images: ['/images/logo.jpg'],
    creator: '@mentariwedding',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // verification: {
  //   google: 'isi-kode-dari-google-search-console',
  // },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LocalBusiness', 'WeddingPlanning'],
        '@id': 'https://mentariwedding.id/#business',
        name: 'Mentari Wedding',
        alternateName: 'Mentari Wedding Organizer',
        description: 'Wedding Organizer profesional di Sukabumi. Merangkai pernikahan impian dengan estetika timeless, dekorasi elegant, dan pelayanan penuh ketulusan.',
        url: 'https://mentariwedding.id',
        logo: 'https://mentariwedding.id/images/logo.jpg',
        image: 'https://mentariwedding.id/images/hero.JPG',
        telephone: '+628123456789',
        priceRange: '$$$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sukabumi',
          addressRegion: 'Jawa Barat',
          addressCountry: 'ID',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -6.9277,
          longitude: 106.9300,
        },
        areaServed: [
          { '@type': 'City', name: 'Sukabumi' },
          { '@type': 'State', name: 'Jawa Barat' },
        ],
        serviceType: ['Wedding Organizer', 'Wedding Planner', 'Wedding Decoration', 'Event Organizer'],
        slogan: 'Planned to Perfection',
        knowsAbout: ['wedding planning', 'wedding decoration', 'event management', 'wedding photography coordination'],
        sameAs: [
          'https://instagram.com/mentariwedding',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://mentariwedding.id/#website',
        url: 'https://mentariwedding.id',
        name: 'Mentari Wedding',
        description: 'Wedding Organizer Sukabumi - Planned to Perfection',
        publisher: { '@id': 'https://mentariwedding.id/#business' },
        inLanguage: 'id-ID',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://mentariwedding.id/#webpage',
        url: 'https://mentariwedding.id',
        name: 'Mentari Wedding | Wedding Organizer Sukabumi',
        isPartOf: { '@id': 'https://mentariwedding.id/#website' },
        about: { '@id': 'https://mentariwedding.id/#business' },
        description: 'Merangkai pernikahan impian dengan estetika timeless dan pelayanan penuh ketulusan.',
        inLanguage: 'id-ID',
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
        <SmoothScroll />
        <AmbientMusic />
        <FloatingGoldThread />
        <BackToTop />
        {children}
      </body>
    </html>
  );
}
