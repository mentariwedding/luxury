export const metadata = {
    title: 'Tentang Kami | Mentari Wedding — Studio Pernikahan Eksklusif Sukabumi',
    description: 'Kenali lebih dalam filosofi dan perjalanan Mentari Wedding. Studio pernikahan eksklusif di Sukabumi yang percaya bahwa setiap pernikahan adalah karya seni yang layak dirawat dengan sepenuh hati.',
    openGraph: {
        title: 'Tentang Kami | Mentari Wedding',
        description: 'Filosofi, perjalanan, dan nilai-nilai yang membentuk Mentari Wedding — studio pernikahan eksklusif Sukabumi.',
        url: 'https://mentariwedding.id/tentang',
        images: [{ url: '/images/signature.JPG', width: 1200, height: 630, alt: 'Tentang Mentari Wedding' }],
    },
    alternates: {
        canonical: 'https://mentariwedding.id/tentang',
    },
};

export default function TentangLayout({ children }) {
    return children;
}
