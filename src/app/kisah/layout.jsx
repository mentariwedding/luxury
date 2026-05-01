export const metadata = {
    title: 'Kisah | Mentari Wedding — Cerita Pernikahan yang Kami Rangkai',
    description: 'Setiap pernikahan memiliki ceritanya sendiri. Temukan kisah-kisah momen istimewa yang kami rangkai bersama pasangan terpilih Mentari Wedding di Sukabumi.',
    openGraph: {
        title: 'Kisah | Mentari Wedding',
        description: 'Cerita pernikahan yang dipercayakan kepada Mentari Wedding — tanpa nama, tanpa ekspos, hanya momen yang paling bermakna.',
        url: 'https://mentariwedding.id/kisah',
        images: [{ url: '/images/tawalepas.JPG', width: 1200, height: 630, alt: 'Kisah Pernikahan Mentari Wedding' }],
    },
    alternates: {
        canonical: 'https://mentariwedding.id/kisah',
    },
};

export default function KisahLayout({ children }) {
    return children;
}
