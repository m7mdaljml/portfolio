import CodeEditorWindow, {
  c,
  k,
  n,
  p,
  s,
  ty,
  x,
  type Tok,
} from "@/components/code-editor-window";
import { useLang } from "@/context/language-context";

export default function AboutCodeEditor() {
  const { t: lang } = useLang();
  const at = lang.about;
  const ht = lang.hero;

  const name = `${ht.firstname} ${ht.lastname}`;
  const role = ht.role;
  const bio = at.bio1;
  const leadership = `${at.bio2start}${at.bio2Chair}${at.bio2mid}${at.bio2acpc}${at.bio2end}${at.bio2gdsc}.`;
  const philosophy = at.bio3;

  const lines: Tok[][] = [
    [c("// about.ts")],
    [c(`// ${name} - ${role}`)],
    [],

    [k("export"), x(" "), k("interface"), x(" ProfileStats {")],
    [x("  "), p("yearsExperience"), x(": "), k("number"), x(";")],
    [x("  "), p("companies"), x(": "), k("number"), x(";")],
    [x("  "), p("competitions"), x(": "), k("number"), x(";")],
    [x("}")],

    [],

    [k("export"), x(" "), k("interface"), x(" Developer {")],
    [x("  "), p("name"), x(": "), k("string"), x(";")],
    [x("  "), p("role"), x(": "), k("string"), x(";")],
    [x("  "), p("experience"), x(": "), k("string"), x(";")],
    [x("  "), p("focus"), x(": "), k("string"), x("[];")],
    [x("  "), p("bio"), x(": "), k("string"), x(";")],
    [x("  "), p("leadership"), x(": "), k("string"), x(";")],
    [x("  "), p("philosophy"), x(": "), k("string"), x(";")],
    [x("  "), p("stats"), x(": "), ty("ProfileStats"), x(";")],
    [x("}")],

    [],

    [
      k("export"),
      x(" "),
      k("class"),
      x(" "),
      ty("DeveloperProfile"),
      x(" "),
      k("implements"),
      x(" "),
      ty("Developer"),
      x(" {"),
    ],

    [
      x("  "),
      k("constructor"),
      x("("),
      k("public"),
      x(" "),
      p("name"),
      x(": "),
      k("string"),
      x(", "),
      k("public"),
      x(" "),
      p("role"),
      x(": "),
      k("string"),
      x(", "),
      k("public"),
      x(" "),
      p("experience"),
      x(": "),
      k("string"),
      x(", "),
      k("public"),
      x(" "),
      p("focus"),
      x(": "),
      k("string"),
      x("[], "),
      k("public"),
      x(" "),
      p("bio"),
      x(": "),
      k("string"),
      x(", "),
      k("public"),
      x(" "),
      p("leadership"),
      x(": "),
      k("string"),
      x(", "),
      k("public"),
      x(" "),
      p("philosophy"),
      x(": "),
      k("string"),
      x(", "),
      k("public"),
      x(" "),
      p("stats"),
      x(": "),
      ty("ProfileStats"),
      x(") {}"),
    ],

    [x("}")],

    [],

    [
      k("export"),
      x(" "),
      k("const"),
      x(" "),
      p("developer"),
      x(" = "),
      k("new"),
      x(" "),
      ty("DeveloperProfile"),
      x("("),
    ],

    [x("  "), s(`"${name}"`), x(",")],
    [x("  "), s(`"${role}"`), x(",")],
    [x("  "), s('"2+ years"'), x(",")],
    [x("  "), x("["), s('"Vue.js"'), x(", "), s('"TypeScript"'), x("],")],
    [x("  "), s(`"${bio}"`), x(",")],
    [x("  "), s(`"${leadership}"`), x(",")],
    [x("  "), s(`"${philosophy}"`), x(",")],
    [x("  "), x("{")],
    [x("    "), p("yearsExperience"), x(": "), n("2"), x(",")],
    [x("    "), p("companies"), x(": "), n("2"), x(",")],
    [x("    "), p("competitions"), x(": "), n("3"), x(",")],
    [x("  }, ")],
    [x(");")],

    [],
    [c(`// ${ht.tagline}`)],
  ];

  return <CodeEditorWindow fileName="about.ts" lines={lines} />;
}
