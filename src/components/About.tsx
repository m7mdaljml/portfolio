import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Trophy, Award } from 'lucide-react';
import ProfilePhoto from '@/components/ProfilePhoto';
import { useLang } from '@/context/LanguageContext';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useLang();
  const at = t.about;

  const stats = [
    { icon: Briefcase, label: at.yearsExp, value: '2+' },
    { icon: Award, label: at.companies, value: '2' },
    { icon: Trophy, label: at.competitions, value: '3' },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <span className="text-primary font-mono text-sm">&lt;{at.tag}&gt;</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {at.title}
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex justify-center"
            >
              <ProfilePhoto />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-5"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {at.bio1}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {at.bio2start}
                <span className="text-primary font-semibold">{at.bio2Chair}</span>
                {at.bio2mid}
                <span className="text-primary font-semibold">{at.bio2acpc}</span>
                {at.bio2end}
                <span className="text-primary font-semibold">{at.bio2gdsc}</span>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {at.bio3}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-5"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <stat.icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <span className="text-primary font-mono text-sm">&lt;/{at.tag}&gt;</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
