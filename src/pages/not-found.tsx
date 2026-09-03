import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, Terminal, Compass, Ghost } from "lucide-react";
import ParticleBackground from "@/components/particle-background";
import { useLang } from "@/context/language-context";

export default function NotFound() {
  const { t } = useLang();
  const c = t.notFound;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary font-mono text-sm mb-6"
        >
          &lt;{c.tag}&gt;
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-8xl sm:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/30 glow-text leading-none select-none"
          dir="ltr"
        >
          {c.code}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 max-w-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{c.title}</h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {c.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 w-full max-w-md font-mono text-sm bg-card border border-border rounded-xl p-4 text-start shadow-lg shadow-primary/5 overflow-hidden"
          dir="ltr"
        >
          <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
            <Terminal size={14} className="text-primary" />
            <span className="text-muted-foreground">{c.terminal}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ghost size={14} className="text-primary animate-bounce" />
            <span className="text-destructive">{c.terminalHint}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg border border-primary/50 text-primary hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all"
          >
            <Compass size={18} />
            {c.explore}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-primary font-mono text-sm"
        >
          &lt;/{c.tag}&gt;
        </motion.div>
      </div>
    </div>
  );
}
