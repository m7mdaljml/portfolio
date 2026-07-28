import ParticleBackground from '@/components/ParticleBackground';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Achievements from '@/components/Achievements';
import Education from '@/components/Education';
import GitHubRepos from '@/components/GitHubRepos';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Portfolio() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Achievements />
        <Education />
        <GitHubRepos />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
