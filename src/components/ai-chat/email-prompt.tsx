import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { sendContactEmail } from "@/services/contact-email";
import { useLang } from "@/context/language-context";

type Props = {
  question: string;
  onSent: (email: string) => void;
  onCancel: () => void;
};

const EmailPrompt = ({ question, onSent, onCancel }: Props) => {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      setError(t.aiChat.emailInvalid);
      return;
    }

    setError("");
    setSending(true);
    try {
      await sendContactEmail(trimmed, question);
      onSent(trimmed);
    } catch {
      setError(t.aiChat.emailSendError);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] px-4 py-3 rounded-2xl rounded-bl-sm bg-muted border border-border text-sm">
        <p className="mb-2 text-xs text-muted-foreground">
          {t.aiChat.leaveEmail}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="email"
            className="flex-1 min-w-0 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.aiChat.emailPlaceholder}
            disabled={sending}
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={sending || !email.trim()}
            className="shrink-0 h-9 px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-medium disabled:opacity-50 disabled:pointer-events-none"
          >
            {sending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {sending ? t.aiChat.sending : t.aiChat.send}
          </button>
          <button
            onClick={onCancel}
            disabled={sending}
            className="shrink-0 h-9 px-2.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive/60 transition-colors flex items-center"
            aria-label={t.aiChat.cancel}
          >
            <X size={14} />
          </button>
        </div>
        {error && (
          <div className="text-destructive text-xs mt-1.5">{error}</div>
        )}
      </div>
    </div>
  );
};

export default EmailPrompt;
