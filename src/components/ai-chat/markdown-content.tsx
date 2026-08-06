import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
  onPrimary?: boolean;
}

const autoLink = (text: string): string =>
  text.replace(
    /(?<!\]\()(?<!\()(https?:\/\/[^\s<>"')\]]+[^\s<>"')\].])/g,
    "[$1]($1)",
  );

const MarkdownContent = ({ content, onPrimary = false }: Props) => {
  const linkClass = onPrimary
    ? "underline decoration-primary-foreground/50 text-primary-foreground hover:opacity-80 font-medium break-all"
    : "underline decoration-primary/50 text-primary hover:opacity-80 font-medium break-all";

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {children}
          </a>
        ),
        p: ({ children }) => (
          <p className="my-1 first:mt-0 last:mb-0">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside pl-4 my-1.5 space-y-0.5">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside pl-4 my-1.5 space-y-0.5">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em>{children}</em>,
        code: ({ children }) => (
          <code className="px-1 py-0.5 rounded bg-primary/10 font-mono text-[0.85em]">
            {children}
          </code>
        ),
        h1: ({ children }) => (
          <h1 className="text-base font-bold my-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold my-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold my-2">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-s-2 border-primary/40 ps-2 my-2 text-muted-foreground">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-2 border-border" />,
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border px-2 py-1 text-start">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-2 py-1">{children}</td>
        ),
      }}
    >
      {autoLink(content)}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
