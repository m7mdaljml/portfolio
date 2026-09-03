import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Award } from "lucide-react";
import { useLang } from "@/context/language-context";
import { useContent } from "@/context/content-context";

export default function Education() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLang();
  const { getMergedTranslations } = useContent();
  const ed = getMergedTranslations(lang).education;

  return (
    <section
      id="education"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16">
            <span className="text-primary font-mono text-sm">
              &lt;{ed.tag}&gt;
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {ed.title}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-card border border-primary/50 rounded-lg p-8 hover:shadow-lg hover:shadow-primary/10 transition-all"
            data-testid="education-degree"
          >
            <div className="flex items-start gap-6">
              <div className="p-4 bg-primary/10 rounded-lg flex-shrink-0">
                <GraduationCap className="text-primary" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {ed.degree}
                </h3>
                <p className="text-lg text-primary font-semibold mb-4">
                  {ed.university}
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-sm text-muted-foreground font-mono">
                    {ed.years}
                  </span>
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded">
                    <Award className="text-primary" size={16} />
                    <span className="text-sm font-semibold text-primary">
                      {ed.gpa}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {ed.desc1}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {ed.desc2}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <span className="text-primary font-mono text-sm">
              &lt;/{ed.tag}&gt;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
