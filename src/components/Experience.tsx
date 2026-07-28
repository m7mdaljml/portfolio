import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

const highlights = [true, false];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLang();
  const et = t.experience;

  return (
    <section
      id="experience"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16">
            <span className="text-primary font-mono text-sm">&lt;{et.tag}&gt;</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {et.title}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute start-0 md:start-8 top-0 bottom-0 w-0.5 bg-primary/30" />

            <div className="space-y-12">
              {et.jobs.map((exp, index) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="relative ps-8 md:ps-20"
                >
                  <div className="absolute start-[-6px] md:start-[26px] top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                  <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                          <Briefcase className="text-primary" size={24} />
                          {exp.role}
                        </h3>
                        <p className="text-lg text-primary font-semibold mt-1">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mt-2 md:mt-0">
                        <Calendar size={16} />
                        <span className="text-sm font-mono">{exp.period}</span>
                        {index === 0 && (
                          <span className="ms-2 px-2 py-1 bg-primary/20 text-primary text-xs font-semibold rounded">
                            {et.current}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2 mt-4">
                      {exp.description.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: index * 0.2 + idx * 0.1, duration: 0.4 }}
                          className="flex items-start gap-3 text-muted-foreground"
                        >
                          <span className="text-primary mt-1.5 flex-shrink-0">▹</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <span className="text-primary font-mono text-sm">&lt;/{et.tag}&gt;</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
