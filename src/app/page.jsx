import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Partners from '../components/Partners';
import Portfolio from '../components/Portfolio';
import Approach from '../components/Approach';
import Signature from '../components/Signature';
import Atelier from '../components/Atelier';
import Philosophy from '../components/Philosophy';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <main className="scroll-smooth">
            <Navbar />
            <Hero />
            <Partners />
            <Portfolio />
            <Approach />
            <Signature />
            <Atelier />
            <Philosophy />
            <Footer />
        </main>
    );
}
