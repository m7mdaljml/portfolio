import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/context/language-context";

const skillData = [
  {
    color: "from-primary to-primary/70",
    skills: [
      { name: "Vue.js", level: 95 },
      { name: "React.js", level: 80 },
      { name: "TypeScript", level: 95 },
      { name: "JavaScript", level: 95 },
      { name: "HTML / CSS", level: 95 },
      { name: "Bootstrap", level: 95 },
      { name: "Tailwind CSS", level: 80 },
    ],
  },
  {
    color: "from-violet-500 to-violet-500/70",
    skills: [
      { name: "REST APIs", level: 90 },
      { name: "Axios", level: 90 },
      { name: "Swagger / OpenAPI", level: 75 },
      { name: "Apache", level: 75 },
    ],
  },
  {
    color: "from-sky-500 to-sky-500/70",
    skills: [
      { name: "C++", level: 80 },
      { name: "PHP", level: 70 },
      { name: "MySQL", level: 75 },
      { name: "Apache", level: 65 },
    ],
  },
  {
    color: "from-emerald-500 to-emerald-500/70",
    skills: [
      { name: "Git / GitHub", level: 90 },
      { name: "Node.js", level: 80 },
      { name: "Vite", level: 85 },
      { name: "Microsoft Office", level: 85 },
    ],
  },
  {
    color: "from-amber-500 to-amber-500/70",
    skills: [
      { name: "Problem Solving", level: 95 },
      { name: "Time Management", level: 90 },
      { name: "Fast & Self Learning", level: 95 },
      { name: "Presentation", level: 85 },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();
  const st = t.skills;

  const categories = skillData.map((cat, i) => ({
    ...cat,
    title: st.categories[i],
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
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        duration: 0.4,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            delay:
                              categoryIndex * 0.1 + skillIndex * 0.05 + 0.2,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
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
