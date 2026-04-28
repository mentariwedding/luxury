import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Whisper from '../components/Whisper';
import Portfolio from '../components/Portfolio';
import Approach from '../components/Approach';
import Signature from '../components/Signature';
import Atelier from '../components/Atelier';
import Venues from '../components/Venues';
import Philosophy from '../components/Philosophy';
import Manifesto from '../components/Manifesto';
import Footer from '../components/Footer';
import FloatingInquiry from '../components/FloatingInquiry';

export default function Home() {
    return (
        <main className="scroll-smooth">
            <Navbar />
            <Hero />
            <Whisper />
            <Portfolio />
            <Approach />
            <Signature />
            <Atelier />
            <Venues />
            <Philosophy />
            <Manifesto />
            <Footer />
            <FloatingInquiry />
        </main>
    );
}
