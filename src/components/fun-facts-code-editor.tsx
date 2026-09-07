import CodeEditorWindow, {
  c,
  k,
  p,
  s,
  x,
  type Tok,
} from "@/components/code-editor-window";
import translations from "@/i18n/translations";
import { useContent } from "@/context/content-context";

export default function FunFactsCodeEditor() {
  const { getMergedTranslations } = useContent();
  const en = translations.en.about;
  const am = getMergedTranslations("en") as typeof translations.en;
  const facts = am.about.funFacts ?? [];

  const lines: Tok[][] = [
    [c("// fun-facts.ts")],
    [c(`// ${en.funFactsSubtitle}`)],
    [],
    [k("export"), x(" "), k("const"), x(" "), p("FunFacts"), x(" = [")],
    ...facts.map((fact) => [x("  "), s(`"${fact}"`), x(",")]),
    [x("] as string[];")],
  ];

  return <CodeEditorWindow fileName="fun-facts.ts" lines={lines} />;
}