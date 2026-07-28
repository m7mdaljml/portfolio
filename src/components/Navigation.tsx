import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLang } from "@/context/LanguageContext";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "skills", label: t.nav.skills },
    { id: "experience", label: t.nav.experience },
    { id: "achievements", label: t.nav.achievements },
    { id: "education", label: t.nav.education },
    { id: "github", label: t.nav.github },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              onClick={() => scrollToSection("hero")}
              className="text-xl font-bold font-mono text-primary hover:glow-text transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="nav-logo"
            >
              &lt;MA /&gt;
            </motion.button>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ y: -2 }}
                  data-testid={`nav-${item.id}`}
                >
                  {item.label}
                </motion.button>
              ))}

              <motion.button
                onClick={toggleLang}
                className="px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all text-xs font-bold font-mono"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle language"
                data-testid="nav-lang-toggle"
              >
                {lang === "en" ? "ع" : "EN"}
              </motion.button>

              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
                data-testid="nav-theme-toggle"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </motion.button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleLang}
                className="px-2.5 py-1 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all text-xs font-bold"
                aria-label="Toggle language"
              >
                {lang === "en" ? "ع" : "EN"}
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground"
                data-testid="nav-mobile-toggle"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-start text-muted-foreground hover:text-primary transition-colors py-2"
                  data-testid={`nav-mobile-${item.id}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
}
