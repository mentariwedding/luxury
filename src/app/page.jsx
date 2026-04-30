import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Portfolio from '../components/Portfolio';
import Approach from '../components/Approach';
import VideoReel from '../components/VideoReel';
import Signature from '../components/Signature';
import Atelier from '../components/Atelier';
import MoodBoard from '../components/MoodBoard';
import Venues from '../components/Venues';
import Testimonial from '../components/Testimonial';
import Philosophy from '../components/Philosophy';
import Manifesto from '../components/Manifesto';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <main className="scroll-smooth">
            <Navbar />
            <Hero />
            <Marquee />
            <Portfolio />
            <Approach />
            <VideoReel />
            <Signature />
            <Atelier />
            <MoodBoard />
            <Venues />
            <Testimonial />
            <Philosophy />
            <Manifesto />
            <Footer />
        </main>
    );
}
