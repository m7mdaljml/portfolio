import ParticleBackground from "@/components/particle-background";

import AIChatWidget from "@/components/ai-chat/ai-chat-widget";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Skills from "@/components/skills";
import About from "@/components/about";
import Experience from "@/components/experience";
import Education from "@/components/education";
import Achievements from "@/components/achievements";
import GitHubRepos from "@/components/github-repos";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

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
      <AIChatWidget />
    </div>
  );
}
