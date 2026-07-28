import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Trophy, Users, Code, Globe } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';

const icons = [Users, Code, Trophy, Globe, Code];
const highlights = [true, false, false, true, false];

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLang();
  const at = t.achievements;

  return (
    <section
      id="achievements"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16">
            <span className="text-primary font-mono text-sm">&lt;{at.tag}&gt;</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {at.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">{at.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {at.items.map((achievement, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`bg-card border rounded-lg p-6 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 ${
                    highlights[index] ? 'border-primary/50 md:col-span-2' : 'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-foreground">{achievement.title}</h3>
                        <span className="text-xs font-mono text-muted-foreground flex-shrink-0 ms-2">
                          {achievement.year}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-semibold mb-3">{achievement.organization}</p>
                      <p className="text-muted-foreground leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <span className="text-primary font-mono text-sm">&lt;/{at.tag}&gt;</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
