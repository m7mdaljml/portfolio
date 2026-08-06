import { useLang } from "@/context/language-context";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-muted border border-border flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
};

export default TypingIndicator;
