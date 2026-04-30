import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Whisper from '../components/Whisper';
import Portfolio from '../components/Portfolio';
import Approach from '../components/Approach';
import VideoReel from '../components/VideoReel';
import Signature from '../components/Signature';
import Atelier from '../components/Atelier';
import Venues from '../components/Venues';
import Philosophy from '../components/Philosophy';
import SocialProof from '../components/SocialProof';
import Manifesto from '../components/Manifesto';
import Footer from '../components/Footer';
import FloatingInquiry from '../components/FloatingInquiry';

export default function Home() {
    return (
        <main className="scroll-smooth">
            <Navbar />
            <Hero />
            <Marquee />
            <Whisper />
            <Portfolio />
            <Approach />
            <VideoReel />
            <Signature />
            <Atelier />
            <Venues />
            <Philosophy />
            <SocialProof />
            <Manifesto />
            <Footer />
            <FloatingInquiry />
        </main>
    );
}
