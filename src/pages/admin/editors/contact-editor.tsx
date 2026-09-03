import { TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

export default function ContactEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc } = useSectionEditor("contact", lang);
  const form = (merged.form as Record<string, unknown>) ?? {};

  const setForm = (field: string, value: string) => {
    setField("form", { ...form, [field]: value });
  };

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

      <SectionCard title={sc("formTitle")}>
        <TextField
          label={sc("formTitleLabel")}
          value={(form.title as string) ?? ""}
          onChange={(v) => setForm("title", v)}
        />
        <TextAreaField
          label={sc("formSubtitleLabel")}
          value={(form.subtitle as string) ?? ""}
          onChange={(v) => setForm("subtitle", v)}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField
            label={sc("nameLabel")}
            value={(form.name as string) ?? ""}
            onChange={(v) => setForm("name", v)}
          />
          <TextField
            label={sc("namePlaceholder")}
            value={(form.namePlaceholder as string) ?? ""}
            onChange={(v) => setForm("namePlaceholder", v)}
          />
          <TextField
            label={sc("emailLabel")}
            value={(form.email as string) ?? ""}
            onChange={(v) => setForm("email", v)}
          />
          <TextField
            label={sc("emailPlaceholder")}
            value={(form.emailPlaceholder as string) ?? ""}
            onChange={(v) => setForm("emailPlaceholder", v)}
          />
          <TextField
            label={sc("messageLabel")}
            value={(form.message as string) ?? ""}
            onChange={(v) => setForm("message", v)}
          />
          <TextField
            label={sc("messagePlaceholder")}
            value={(form.messagePlaceholder as string) ?? ""}
            onChange={(v) => setForm("messagePlaceholder", v)}
          />
          <TextField
            label={sc("sendLabel")}
            value={(form.send as string) ?? ""}
            onChange={(v) => setForm("send", v)}
          />
          <TextField
            label={sc("sendingLabel")}
            value={(form.sending as string) ?? ""}
            onChange={(v) => setForm("sending", v)}
          />
        </div>
      </SectionCard>

      <p className="text-sm text-muted-foreground">{sc("hint")}</p>
    </div>
  );
}
