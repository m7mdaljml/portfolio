import { TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

interface Item {
  title: string;
  organization: string;
  description: string;
  year: string;
}

export default function AchievementsEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc, st } = useSectionEditor("achievements", lang);

  const items = ((merged.items ?? []) as Item[]).map((i) => ({ ...i }));

  const setItem = (index: number, patch: Partial<Item>) => {
    const next = items.map((i, idx) =>
      idx === index ? { ...i, ...patch } : i,
    );
    setField("items", next);
  };

  const addItem = () => {
    setField("items", [
      ...items,
      { title: "", organization: "", description: "", year: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setField(
      "items",
      items.filter((_, i) => i !== index),
    );
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

      <SectionCard title={sc("itemsTitle")}>
        <p className="text-xs text-muted-foreground -mt-2">
          {sc("itemsHint")}
        </p>
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {sc("item", { n: index + 1 })}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-xs text-destructive hover:underline"
              >
                {st("remove")}
              </button>
            </div>
            <TextField
              label={sc("titleLabel")}
              value={item.title}
              onChange={(v) => setItem(index, { title: v })}
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField
                label={sc("organization")}
                value={item.organization}
                onChange={(v) => setItem(index, { organization: v })}
              />
              <TextField
                label={sc("year")}
                value={item.year}
                onChange={(v) => setItem(index, { year: v })}
              />
            </div>
            <TextAreaField
              label={sc("description")}
              value={item.description}
              onChange={(v) => setItem(index, { description: v })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="text-sm text-primary hover:underline"
        >
          {sc("addItem")}
        </button>
      </SectionCard>
    </div>
  );
}
