import { Bot, Mail, LayoutGrid } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContent } from "@/context/content-context";
import { useLang } from "@/context/language-context";
import type { Flags, SectionKey } from "@/domain/content-store";

interface ToggleRow {
  key: keyof Flags;
  label: string;
  description: string;
  icon: React.ElementType;
  section?: SectionKey;
}

export default function SectionToggles() {
  const { flags, setFlag, hasOverrides } = useContent();
  const { t } = useLang();
  const toggles = t.admin.toggles;

  const sectionRows: ToggleRow[] = [
    { key: "hero", label: toggles.sections.hero.label, description: toggles.sections.hero.desc, icon: LayoutGrid, section: "hero" },
    { key: "about", label: toggles.sections.about.label, description: toggles.sections.about.desc, icon: LayoutGrid, section: "about" },
    { key: "skills", label: toggles.sections.skills.label, description: toggles.sections.skills.desc, icon: LayoutGrid, section: "skills" },
    { key: "experience", label: toggles.sections.experience.label, description: toggles.sections.experience.desc, icon: LayoutGrid, section: "experience" },
    { key: "achievements", label: toggles.sections.achievements.label, description: toggles.sections.achievements.desc, icon: LayoutGrid, section: "achievements" },
    { key: "education", label: toggles.sections.education.label, description: toggles.sections.education.desc, icon: LayoutGrid, section: "education" },
    { key: "github", label: toggles.sections.github.label, description: toggles.sections.github.desc, icon: LayoutGrid, section: "github" },
    { key: "contact", label: toggles.sections.contact.label, description: toggles.sections.contact.desc, icon: LayoutGrid, section: "contact" },
  ];

  const featureRows: ToggleRow[] = [
    { key: "aiChat", label: toggles.features.aiChat.label, description: toggles.features.aiChat.desc, icon: Bot },
    { key: "contactForm", label: toggles.features.contactForm.label, description: toggles.features.contactForm.desc, icon: Mail, section: "contact" },
  ];

  const renderRow = (row: ToggleRow) => (
    <div
      key={row.key}
      className="flex items-center justify-between gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
          <row.icon className="text-primary" size={20} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{row.label}</span>
            {row.section && hasOverrides("en", row.section) && (
              <Badge variant="secondary" className="text-[10px]">
                {toggles.edited}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{row.description}</p>
        </div>
      </div>
      <Switch
        checked={flags[row.key]}
        onCheckedChange={(checked) => setFlag(row.key, checked)}
        aria-label={`Toggle ${row.label}`}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid size={18} />
            {toggles.contentSectionsTitle}
          </CardTitle>
          <CardDescription>{toggles.contentSectionsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sectionRows.map(renderRow)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot size={18} />
            {toggles.featuresTitle}
          </CardTitle>
          <CardDescription>{toggles.featuresDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {featureRows.map(renderRow)}
        </CardContent>
      </Card>
    </div>
  );
}
