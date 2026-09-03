import { TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

export default function AboutEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc, st } = useSectionEditor("about", lang);

  return (
    <div className="space-y-4">
      <SectionCard title={sc("bio")}>
        <TextAreaField
          label={sc("bio1")}
          value={(merged.bio1 as string) ?? ""}
          onChange={(v) => setField("bio1", v)}
        />
        <TextAreaField
          label={sc("bio2start")}
          value={(merged.bio2start as string) ?? ""}
          onChange={(v) => setField("bio2start", v)}
        />
        <TextField
          label={sc("bio2Chair")}
          value={(merged.bio2Chair as string) ?? ""}
          onChange={(v) => setField("bio2Chair", v)}
        />
        <TextAreaField
          label={sc("bio2mid")}
          value={(merged.bio2mid as string) ?? ""}
          onChange={(v) => setField("bio2mid", v)}
        />
        <TextField
          label={sc("bio2acpc")}
          value={(merged.bio2acpc as string) ?? ""}
          onChange={(v) => setField("bio2acpc", v)}
        />
        <TextAreaField
          label={sc("bio2end")}
          value={(merged.bio2end as string) ?? ""}
          onChange={(v) => setField("bio2end", v)}
        />
        <TextField
          label={sc("bio2gdsc")}
          value={(merged.bio2gdsc as string) ?? ""}
          onChange={(v) => setField("bio2gdsc", v)}
        />
        <TextAreaField
          label={sc("bio3")}
          value={(merged.bio3 as string) ?? ""}
          onChange={(v) => setField("bio3", v)}
        />
      </SectionCard>

      <SectionCard title={sc("statsTitle")}>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-3">
            <TextField
              label={sc("yearsExpLabel")}
              value={(merged.yearsExp as string) ?? ""}
              onChange={(v) => setField("yearsExp", v)}
            />
            <TextField
              label={sc("yearsExpValue")}
              value={(merged.yearsExpValue as string) ?? ""}
              onChange={(v) => setField("yearsExpValue", v)}
            />
          </div>
          <div className="space-y-3">
            <TextField
              label={sc("companiesLabel")}
              value={(merged.companies as string) ?? ""}
              onChange={(v) => setField("companies", v)}
            />
            <TextField
              label={sc("companiesValue")}
              value={(merged.companiesValue as string) ?? ""}
              onChange={(v) => setField("companiesValue", v)}
            />
          </div>
          <div className="space-y-3">
            <TextField
              label={sc("competitionsLabel")}
              value={(merged.competitions as string) ?? ""}
              onChange={(v) => setField("competitions", v)}
            />
            <TextField
              label={sc("competitionsValue")}
              value={(merged.competitionsValue as string) ?? ""}
              onChange={(v) => setField("competitionsValue", v)}
            />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
