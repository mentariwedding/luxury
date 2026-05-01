import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Portfolio from '../components/Portfolio';
import BehindTheMoment from '../components/BehindTheMoment';
import Approach from '../components/Approach';
import VideoReel from '../components/VideoReel';
import Signature from '../components/Signature';
import Atelier from '../components/Atelier';
import MoodBoard from '../components/MoodBoard';
import Venues from '../components/Venues';
import Testimonial from '../components/Testimonial';
import Whisper from '../components/Whisper';
import Philosophy from '../components/Philosophy';
import Manifesto from '../components/Manifesto';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <main className="scroll-smooth">
            <Hero />
            <Marquee />
            <Portfolio />
            <BehindTheMoment />
            <Approach />
            <VideoReel />
            <Signature />
            <Atelier />
            <MoodBoard />
            <Venues />
            <Testimonial />
            <Whisper />
            <Philosophy />
            <Manifesto />
            <Footer />
        </main>
    );
}
