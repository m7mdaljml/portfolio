import { Mail } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-start">
            <p className="text-muted-foreground text-sm">
              <span className="font-mono text-primary">&copy;</span>{" "}
              {new Date().getFullYear()} Mohammad Aljamal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/M7mdaljml"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href="https://linkedin.com/in/mohammad-aljamal"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a
              href="mailto:mohammadaljamal121@gmail.com"
              className="p-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
