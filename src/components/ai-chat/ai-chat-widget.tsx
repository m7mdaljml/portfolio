import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, Trash2, X } from "lucide-react";
import { useLang } from "@/context/language-context";
import { useAIChat } from "@/domain/utilities/use-ai-chat";
import MessageBubble from "./message-bubble";
import ChatInput from "./chat-input";
import EmailPrompt from "./email-prompt";
import TypingIndicator from "./typing-indicator";

const AIChatWidget = () => {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const {
    messages,
    loading,
    awaitingEmail,
    pendingQuestion,
    sendMessage,
    handleEmailSent,
    handleEmailCancel,
    deleteConversation,
  } = useAIChat();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 end-5 z-[60] flex flex-col w-[calc(100vw-2.5rem)] max-w-sm h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm leading-tight truncate">
                {t.aiChat.assistant}
              </div>
              <div className="text-xs flex items-center gap-1.5 mt-0.5 opacity-90">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {t.aiChat.online}
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={deleteConversation}
                className="p-2 rounded-lg hover:bg-white/15 transition-colors"
                title={t.aiChat.delete}
                aria-label={t.aiChat.delete}
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-white/15 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto bg-muted/30 px-3 py-4 space-y-3"
          >
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground my-auto pt-6">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <p className="mb-1 font-medium text-foreground">
                  {t.aiChat.startConversation}
                </p>
                <p className="text-sm">{t.aiChat.typeBelow}</p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {t.aiChat.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="px-3 py-1.5 rounded-full text-xs bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                sender={msg.role}
                content={msg.content}
                error={msg.error}
              />
            ))}
            {loading && <TypingIndicator />}
            {awaitingEmail && (
              <EmailPrompt
                question={pendingQuestion}
                onSent={handleEmailSent}
                onCancel={handleEmailCancel}
              />
            )}
          </div>

          <div className="border-t border-border bg-card px-3 py-2.5 shrink-0">
            <ChatInput onSend={sendMessage} disabled={loading} />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 end-5 z-[60] h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all animate-[glow-pulse_3s_ease-in-out_infinite]"
        aria-label={t.aiChat.assistant}
      >
        <Bot size={26} />
      </button>
    </>
  );
};

export default AIChatWidget;
