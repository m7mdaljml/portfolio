import CodeEditorWindow, {
  c,
  k,
  p,
  s,
  x,
  type Tok,
} from "@/components/code-editor-window";
import { funFacts } from "@/data/fun-facts";
import { useLang } from "@/context/language-context";

export default function FunFactsCodeEditor() {
  const { t: lang } = useLang();
  const at = lang.about;
  const facts = funFacts;

  const lines: Tok[][] = [
    [c("// fun-facts.ts")],
    [c(`// ${at.funFactsSubtitle}`)],
    [],
    [k("export"), x(" "), k("const"), x(" "), p("FunFacts"), x(" = [")],
    ...facts.map((fact) => [x("  "), s(`"${fact}"`), x(",")]),
    [x("] as string[];")],
  ];

  return <CodeEditorWindow fileName="fun-facts.ts" lines={lines} />;
}
