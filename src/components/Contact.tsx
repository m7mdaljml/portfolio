import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, ExternalLink } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { useLang } from "@/context/LanguageContext";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();
  const ct = t.contact;

  const contactMethods = [
    {
      icon: Mail,
      label: ct.email,
      value: "mohammadaljamal121@gmail.com",
      href: "mailto:mohammadaljamal121@gmail.com",
    },
    {
      icon: Phone,
      label: ct.phone,
      value: "+962 786 116 835",
      href: "tel:+962786116835",
    },
    {
      icon: FiGithub,
      label: "GitHub",
      value: "M7mdaljml",
      href: "https://github.com/M7mdaljml",
    },
    {
      icon: FiLinkedin,
      label: "LinkedIn",
      value: "Mohammad Aljamal",
      href: "https://linkedin.com/in/mohammad-aljamal",
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16 text-center">
            <span className="text-primary font-mono text-sm">
              &lt;{ct.tag}&gt;
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {ct.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {ct.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.label}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  method.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <method.icon className="text-primary" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground mb-1">
                      {method.label}
                    </div>
                    <div className="text-foreground font-medium flex items-center gap-2">
                      {method.value}
                      {method.href.startsWith("http") && (
                        <ExternalLink size={14} className="text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card border border-primary/50 rounded-lg p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">{ct.readyTitle}</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              {ct.readyDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="gap-2 text-base px-8 hover:glow-border"
                asChild
              >
                <a href="mailto:mohammadaljamal121@gmail.com">
                  <Mail size={20} />
                  {ct.sendEmail}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base px-8 border-primary/50 hover:border-primary"
                asChild
              >
                <a
                  href="https://linkedin.com/in/mohammad-aljamal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiLinkedin size={20} />
                  {ct.connectLinkedIn}
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <span className="text-primary font-mono text-sm">
              &lt;/{ct.tag}&gt;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
