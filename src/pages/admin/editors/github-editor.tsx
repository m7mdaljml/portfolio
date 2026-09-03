import { TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

export default function GitHubEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc } = useSectionEditor("github", lang);

  return (
    <div className="space-y-4">
      <SectionCard title={sc("heading")}>
        <TextField
          label={sc("title")}
          value={(merged.title as string) ?? ""}
          onChange={(v) => setField("title", v)}
        />
        <TextAreaField
          label={sc("subtitle")}
          value={(merged.subtitle as string) ?? ""}
          onChange={(v) => setField("subtitle", v)}
        />
      </SectionCard>
      <p className="text-sm text-muted-foreground">{sc("hint")}</p>
    </div>
  );
}
