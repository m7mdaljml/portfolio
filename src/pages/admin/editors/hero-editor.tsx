import { TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

export default function HeroEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc } = useSectionEditor("hero", lang);

  return (
    <div className="space-y-4">
      <SectionCard title={sc("identity")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label={sc("firstName")}
            value={(merged.firstname as string) ?? ""}
            onChange={(v) => setField("firstname", v)}
          />
          <TextField
            label={sc("lastName")}
            value={(merged.lastname as string) ?? ""}
            onChange={(v) => setField("lastname", v)}
          />
        </div>
        <TextField
          label={sc("role")}
          value={(merged.role as string) ?? ""}
          onChange={(v) => setField("role", v)}
        />
        <TextAreaField
          label={sc("tagline")}
          value={(merged.tagline as string) ?? ""}
          onChange={(v) => setField("tagline", v)}
        />
      </SectionCard>
    </div>
  );
}
