import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/context/content-context";
import { useLang } from "@/context/language-context";
import type { SectionKey } from "@/domain/content-store";
import HeroEditor from "./hero-editor";
import AboutEditor from "./about-editor";
import SkillsEditor from "./skills-editor";
import ExperienceEditor from "./experience-editor";
import AchievementsEditor from "./achievements-editor";
import EducationEditor from "./education-editor";
import GitHubEditor from "./github-editor";
import ContactEditor from "./contact-editor";

const SECTIONS: {
  key: SectionKey;
  labelKey: keyof typeof import("@/i18n/translations").default["en"]["admin"]["editors"]["sections"];
  Component: React.ElementType;
}[] = [
  { key: "hero", labelKey: "hero", Component: HeroEditor },
  { key: "about", labelKey: "about", Component: AboutEditor },
  { key: "skills", labelKey: "skills", Component: SkillsEditor },
  { key: "experience", labelKey: "experience", Component: ExperienceEditor },
  { key: "achievements", labelKey: "achievements", Component: AchievementsEditor },
  { key: "education", labelKey: "education", Component: EducationEditor },
  { key: "github", labelKey: "github", Component: GitHubEditor },
  { key: "contact", labelKey: "contact", Component: ContactEditor },
];

export default function ContentEditors() {
  const { lang: siteLang, t } = useLang();
  const [lang, setLang] = useState<"en" | "ar">(siteLang);
  const { hasOverrides } = useContent();
  const [activeSection, setActiveSection] = useState<string>("hero");

  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));
  const editorText = t.admin.editors;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {editorText.editingPrefix}{" "}
          <Badge variant="default">
            {lang === "en" ? editorText.english : editorText.arabic}
          </Badge>
          <span className="text-xs font-normal">{editorText.switchHint}</span>
        </button>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="flex-wrap h-auto gap-1">
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.key} value={s.key} className="relative">
              {(editorText.sections as Record<string, string>)[s.labelKey]}
              {hasOverrides(lang, s.key) && (
                <span className="absolute -top-1 -end-1 h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeSection}>
          {SECTIONS.map((s) => (
            <div
              key={s.key}
              className={s.key === activeSection ? "" : "hidden"}
            >
              <s.Component lang={lang} />
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
