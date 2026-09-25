import ParticleBackground from "@/components/particle-background";

import AIChatWidget from "@/components/ai-chat/ai-chat-widget";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Achievements from "@/components/Achievements";
import Projects from "@/components/projects";
import Contact from "@/components/Contact";
import Footer from "@/components/footer";
import { useContent } from "@/context/content-context";

export default function Portfolio() {
  const { flags } = useContent();

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navigation />
      <main>
        {flags.hero && <Hero />}
        {flags.about && <About />}
        {flags.skills && <Skills />}
        {flags.experience && <Experience />}
        {flags.achievements && <Achievements />}
        {flags.education && <Education />}
        {flags.projects && <Projects />}
        {flags.contact && <Contact />}
      </main>
      <Footer />
      {flags.aiChat && <AIChatWidget />}
    </div>
  );
}
