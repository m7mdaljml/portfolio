import { useState } from "react";
import { Send } from "lucide-react";
import { useLang } from "@/context/language-context";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const ChatInput = ({ onSend, disabled }: Props) => {
  const { t } = useLang();
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        className="flex-1 resize-none bg-muted border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors min-h-[42px] max-h-32"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t.aiChat.inputPlaceholder}
        disabled={disabled}
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className="h-[42px] px-4 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:pointer-events-none"
        aria-label={t.aiChat.send}
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default ChatInput;
