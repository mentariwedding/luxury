export const metadata = {
    title: 'Editorial | Mentari Wedding — Karya Visual Pernikahan Pilihan',
    description: 'Arsip visual pernikahan terpilih dari Mentari Wedding. Setiap foto adalah fragmen cerita nyata — dirancang dengan detail, dieksekusi dengan penuh rasa.',
    openGraph: {
        title: 'Editorial | Mentari Wedding',
        description: 'Karya visual pernikahan pilihan Mentari Wedding — tidak ada dua perayaan yang sama.',
        url: 'https://mentariwedding.id/portfolio',
        images: [{ url: '/images/estetik.JPG', width: 1200, height: 630, alt: 'Editorial Portfolio Mentari Wedding' }],
    },
    alternates: {
        canonical: 'https://mentariwedding.id/portfolio',
    },
};

export default function PortfolioLayout({ children }) {
    return children;
}
