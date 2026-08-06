import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, TriangleAlert, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { sendContactForm } from "@/services/contact-email";
import { useLang } from "@/context/language-context";
import {
  formatTimer,
  getRemainingCooldown,
  recordEmailSent,
  useEmailCooldown,
} from "@/domain/utilities/email-rate-limit";

type Status = "idle" | "sending" | "success" | "error";

const ContactForm = () => {
  const { t } = useLang();
  const ft = t.contact.form;

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
      await sendContactForm(name.trim(), email.trim(), message.trim());
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
            placeholder={ft.messagePlaceholder}
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
