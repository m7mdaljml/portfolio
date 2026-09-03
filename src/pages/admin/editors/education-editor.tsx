import { TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

export default function EducationEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc } = useSectionEditor("education", lang);

  return (
    <div className="space-y-4">
      <SectionCard title={sc("heading")}>
        <TextField
          label={sc("title")}
          value={(merged.title as string) ?? ""}
          onChange={(v) => setField("title", v)}
        />
      </SectionCard>

      <SectionCard title={sc("degreeTitle")}>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label={sc("degree")}
            value={(merged.degree as string) ?? ""}
            onChange={(v) => setField("degree", v)}
          />
          <TextField
            label={sc("university")}
            value={(merged.university as string) ?? ""}
            onChange={(v) => setField("university", v)}
          />
          <TextField
            label={sc("years")}
            value={(merged.years as string) ?? ""}
            onChange={(v) => setField("years", v)}
          />
          <TextField
            label={sc("gpa")}
            value={(merged.gpa as string) ?? ""}
            onChange={(v) => setField("gpa", v)}
          />
        </div>
        <TextAreaField
          label={sc("desc1")}
          value={(merged.desc1 as string) ?? ""}
          onChange={(v) => setField("desc1", v)}
        />
        <TextAreaField
          label={sc("desc2")}
          value={(merged.desc2 as string) ?? ""}
          onChange={(v) => setField("desc2", v)}
        />
      </SectionCard>
    </div>
  );
}
