import Preloader from '../components/Preloader';
import SmoothScroll from '../components/SmoothScroll';
import AmbientMusic from '../components/AmbientMusic';
import FloatingGoldThread from '../components/FloatingGoldThread';
import CustomCursor from '../components/CustomCursor';
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
  return (
    <html lang="id">
      <body className="min-h-screen relative grain-overlay">
        <Preloader />
        <SmoothScroll />
        <AmbientMusic />
        <FloatingGoldThread />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
