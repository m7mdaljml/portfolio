import { TriangleAlert } from "lucide-react";
import MarkdownContent from "./markdown-content";

type Sender = "user" | "assistant";

interface MessageBubbleProps {
  sender: Sender;
  content: string;
  error?: boolean;
}

const MessageBubble = ({ sender, content, error = false }: MessageBubbleProps) => {
  const isUser = sender === "user";

  if (error) {
    return (
      <div className="flex justify-start">
        <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-destructive/10 border border-destructive/30 text-destructive flex items-start gap-2 max-w-[85%]">
          <TriangleAlert size={16} className="shrink-0 mt-0.5" />
          <span className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[80%] ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm whitespace-pre-wrap"
            : "bg-muted border border-border text-foreground rounded-bl-sm"
        }`}
      >
        {isUser ? content : <MarkdownContent content={content} />}
      </div>
    </div>
  );
};

export default MessageBubble;
