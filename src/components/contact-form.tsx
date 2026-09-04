import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  TriangleAlert,
  Mail,
  Briefcase,
  Handshake,
  Rocket,
  Coffee,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sendContactForm } from "@/services/contact-email";
import { useLang } from "@/context/language-context";
import { useContent } from "@/context/content-context";
import {
  formatTimer,
  getRemainingCooldown,
  recordEmailSent,
  useEmailCooldown,
} from "@/domain/utilities/email-rate-limit";

type Status = "idle" | "sending" | "success" | "error";

type ContactTopic =
  | "job"
  | "collaboration"
  | "project"
  | "hello"
  | "somethingElse";

const ContactForm = () => {
  const { lang } = useLang();
  const { getMergedTranslations } = useContent();
  const ct = getMergedTranslations(lang).contact;
  const ft = ct.form;
  const [topic, setTopic] = useState<ContactTopic>("job");

  const topics: { key: ContactTopic; icon: LucideIcon; label: string }[] = [
    { key: "job", icon: Briefcase, label: ct.topics.job },
    { key: "collaboration", icon: Handshake, label: ct.topics.collaboration },
    { key: "project", icon: Rocket, label: ct.topics.project },
    { key: "hello", icon: Coffee, label: ct.topics.hello },
    {
      key: "somethingElse",
      icon: MessageCircle,
      label: ct.topics.somethingElse,
    },
  ];

  const topicLabel = ct.topics[topic];
  const messagePlaceholder = ft.placeholders[topic] ?? ft.messagePlaceholder;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [status, setStatus] = useState<Status>("idle");
  const remaining = useEmailCooldown();

  const validate = () => {
    const nextErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) nextErrors.name = ft.nameRequired;
    if (!email.trim()) {
      nextErrors.email = ft.emailInvalid;
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = ft.emailInvalid;
    }
    if (!message.trim()) nextErrors.message = ft.messageRequired;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (getRemainingCooldown() > 0) {
      setStatus("idle");
      return;
    }

    setStatus("sending");
    try {
      await sendContactForm(
        name.trim(),
        email.trim(),
        message.trim(),
        topicLabel,
      );
      recordEmailSent();
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (hasError?: string) =>
    `bg-background ${
      hasError ? "border-destructive focus-visible:ring-destructive/50" : ""
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="bg-card border border-primary/50 rounded-lg p-8 mb-11"
    >
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <Mail size={20} className="text-primary" />
        </div>
        <h3 className="text-xl font-bold">{ft.title}</h3>
      </div>
      <p className="text-muted-foreground text-sm mb-6">{ft.subtitle}</p>

      <div className="mb-8">
        <h4 className="font-semibold mb-3">{ct.talkTitle}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
          {topics.map((item) => {
            const selected = topic === item.key;
            return (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => setTopic(item.key)}
                whileTap={{ scale: 0.98 }}
                aria-pressed={selected}
                className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm transition-all cursor-pointer ${
                  selected
                    ? "border-primary bg-primary/10 text-foreground shadow-lg shadow-primary/10"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
                data-testid={`contact-topic-${item.key}`}
              >
                <item.icon
                  size={16}
                  className={selected ? "text-primary" : ""}
                />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="contact-name">{ft.name}</Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={ft.namePlaceholder}
            className={inputClass(errors.name)}
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">{ft.email}</Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={ft.emailPlaceholder}
            className={inputClass(errors.email)}
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message">{ft.message}</Label>
          <Textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
            className={inputClass(errors.message)}
            rows={5}
          />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button
            type="submit"
            size="lg"
            className="gap-2 px-8 hover:glow-border min-w-[160px]"
            disabled={status === "sending" || remaining > 0}
          >
            {remaining > 0 ? (
              <span className="font-mono tabular-nums">
                {formatTimer(remaining)}
              </span>
            ) : status === "sending" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {ft.sending}
              </>
            ) : (
              <>
                <Send size={18} />
                {ft.send}
              </>
            )}
          </Button>

          {status === "success" && remaining > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-500">
              <CheckCircle2 size={16} />
              {ft.success}
            </span>
          )}
          {status === "error" && remaining === 0 && (
            <span className="flex items-center gap-1.5 text-sm text-destructive">
              <TriangleAlert size={16} />
              {ft.error}
            </span>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
