import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/context/language-context";
import { useContent } from "@/context/content-context";

const COLORS = [
  "from-primary to-primary/70",
  "from-blue-500 to-blue-500/70",
  "from-sky-500 to-sky-500/70",
  "from-emerald-500 to-emerald-500/70",
  "from-amber-500 to-amber-500/70",
];

const DEFAULT_SKILL_BLOCKS: string[][] = [
  ["Vue.js", "Pinia", "React.js", "TypeScript", "JavaScript", "HTML / CSS", "Bootstrap", "Tailwind CSS"],
  ["REST APIs", "Axios", "Swagger / OpenAPI", "Apache"],
  ["C++", "PHP", "MySQL", "Apache"],
  ["Git / GitHub", "Node.js", "Vite", "Microsoft Office"],
  ["Problem Solving", "Time Management", "Fast & Self Learning", "Presentation"],
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLang();
  const { getMergedTranslations } = useContent();
  const st = getMergedTranslations(lang).skills as unknown as {
    tag: string;
    title: string;
    subtitle: string;
    categories: string[];
    blocks?: string[][];
  };

  const blocks =
    st.blocks && st.blocks.length ? st.blocks : DEFAULT_SKILL_BLOCKS;

  const categories = blocks.map((skillBlock, i) => ({
    color: COLORS[i % COLORS.length],
    title: st.categories[i] ?? `Category ${i + 1}`,
    skills: skillBlock,
  }));

  return (
    <section
      id="skills"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16">
            <span className="text-primary font-mono text-sm">
              &lt;{st.tag}&gt;
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {st.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {st.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-colors"
              >
                <h3 className="text-base font-bold mb-5 text-primary font-mono">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        duration: 0.4,
                      }}
                      className={`px-3.5 py-1.5 text-sm font-medium text-foreground bg-gradient-to-r ${category.color} rounded-full border border-border`}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <span className="text-primary font-mono text-sm">
              &lt;/{st.tag}&gt;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
