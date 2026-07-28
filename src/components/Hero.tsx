import { motion } from "framer-motion";
import { Download, Eye, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLang } from "@/context/LanguageContext";

const skills = [
  "Vue.js",
  "TypeScript",
  "React",
  "JavaScript",
  "Tailwind CSS",
  "REST APIs",
  "Git",
  "Problem Solving",
];

export default function Hero() {
  const [currentSkill, setCurrentSkill] = useState(0);
  const { lang, t } = useLang();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [skills.length]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16"
    >
      <div className="max-w-5xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-primary font-mono text-sm sm:text-base">
              &lt;developer&gt;
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight"
          >
            {t.hero.firstname}
            <br />
            <span className="glow-text">{t.hero.lastname}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-6 font-medium"
          >
            {t.hero.role}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="h-8 mb-8"
          >
            <motion.span
              key={currentSkill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-mono text-lg"
            >
              {skills[currentSkill]}
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {t.hero.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="gap-2 text-base px-8 py-6 hover:glow-border"
              onClick={() => scrollToSection("contact")}
              data-testid="hero-cta-contact"
            >
              <Mail size={20} />
              {t.hero.contactMe}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 py-6 border-primary/50 hover:border-primary"
              onClick={() => scrollToSection("experience")}
              data-testid="hero-cta-work"
            >
              <Eye size={20} />
              {t.hero.viewWork}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base px-8 py-6 border-muted hover:border-primary"
              asChild
              data-testid="hero-cta-cv"
            >
              <a
                href="/Mohammad-Aljamal-CV.pdf"
                download="Mohammad-Aljamal-CV.pdf"
              >
                <Download size={20} />
                {t.hero.downloadCV}
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-16"
          >
            <span className="text-primary font-mono text-sm">
              &lt;/developer&gt;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
