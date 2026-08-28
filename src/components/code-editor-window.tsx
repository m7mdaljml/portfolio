import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Coffee, FileCode2, GitBranch } from "lucide-react";
import { useLang } from "@/context/language-context";

export type TokenType =
  | "keyword"
  | "string"
  | "property"
  | "comment"
  | "number"
  | "type"
  | "plain";

export interface Tok {
  t: TokenType;
  text: string;
}

export const tokenClass: Record<TokenType, string> = {
  keyword: "text-blue-600 dark:text-blue-400 font-medium",
  string: "text-emerald-600 dark:text-emerald-400",
  property: "text-sky-600 dark:text-sky-400",
  comment: "text-muted-foreground italic",
  number: "text-orange-500 dark:text-orange-400",
  type: "text-teal-600 dark:text-teal-400",
  plain: "text-foreground",
};

export const k = (text: string): Tok => ({ t: "keyword", text });
export const s = (text: string): Tok => ({ t: "string", text });
export const p = (text: string): Tok => ({ t: "property", text });
export const c = (text: string): Tok => ({ t: "comment", text });
export const n = (text: string): Tok => ({ t: "number", text });
export const ty = (text: string): Tok => ({ t: "type", text });
export const x = (text: string): Tok => ({ t: "plain", text });

interface CodeEditorWindowProps {
  fileName: string;
  lines: Tok[][];
  language?: string;
}

export default function CodeEditorWindow({
  fileName,
  lines,
  language = "TypeScript",
}: CodeEditorWindowProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLang();
  const name = `${t.hero.firstname} ${t.hero.lastname}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative"
      dir="ltr"
    >
      <div
        aria-hidden
        className="absolute -inset-px rounded-xl from-primary/20 via-primary/10 to-primary/20 blur-xl"
      />

      <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-2" aria-hidden>
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono truncate px-2">
            <FileCode2 size={14} className="text-primary shrink-0" />
            <span className="truncate">
              {name} — {fileName}
            </span>
          </div>
          <div className="w-12" aria-hidden />
        </div>

        <div className="flex items-end gap-1 px-3 pt-2 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-t-md bg-card border border-border border-b-0 text-xs font-mono text-primary">
            <FileCode2 size={13} className="text-primary" />
            <span>{fileName}</span>
          </div>
        </div>

        <div className="relative flex text-sm font-mono leading-6 overflow-x-auto bg-card py-3">
          <div className="sticky left-0 z-10 select-none pr-4 pl-4 text-right text-muted-foreground/60 bg-card">
            {lines.map((_, i) => (
              <div key={i} className="leading-6 min-w-[2ch]">
                {i + 1}
              </div>
            ))}
          </div>
          <div className="pr-6">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.25 + i * 0.045, duration: 0.3 }}
                className="whitespace-pre leading-6"
              >
                {line.length === 0
                  ? "\u00A0"
                  : line.map((tok, j) => (
                      <span key={j} className={tokenClass[tok.t]}>
                        {tok.text}
                      </span>
                    ))}
                {i === lines.length - 1 && (
                  <span className="inline-block h-[1.05em] ml-0.5 bg-primary animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-1.5 text-[11px] font-mono text-muted-foreground bg-muted/50 border-t border-border">
          <div className="flex items-center gap-3">
            <GitBranch size={12} />
          </div>
          <div className="flex items-center gap-3">
            <Coffee size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
