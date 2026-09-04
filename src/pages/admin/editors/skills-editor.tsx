import { FieldArray, TextField, TextAreaField, SectionCard } from "./fields";
import { useSectionEditor } from "./use-section-editor";

const DEFAULT_BLOCKS: string[][] = [
  [
    "Vue.js",
    "Pinia",
    "React.js",
    "TypeScript",
    "JavaScript",
    "HTML / CSS",
    "Bootstrap",
    "Tailwind CSS",
  ],
  ["REST APIs", "Axios", "Swagger / OpenAPI", "Apache"],
  ["C++", "PHP", "MySQL", "Apache"],
  ["Git / GitHub", "Node.js", "Vite", "Microsoft Office"],
  [
    "Problem Solving",
    "Time Management",
    "Fast & Self Learning",
    "Presentation",
  ],
];

export default function SkillsEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc, st } = useSectionEditor("skills", lang);

  const categories = (merged.categories as string[]) ?? [];
  const rawBlocks = merged.blocks;
  const blocks: string[][] =
    rawBlocks && (Array.isArray(rawBlocks)
      ? rawBlocks.length
      : Object.keys(rawBlocks as Record<string, string[]>).length)
      ? Array.isArray(rawBlocks)
        ? (rawBlocks as string[][])
        : Object.keys(rawBlocks as Record<string, string[]>)
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => (rawBlocks as Record<string, string[]>)[k])
      : DEFAULT_BLOCKS;

  const count = Math.max(categories.length, blocks.length, 1);
  const categoryList = Array.from(
    { length: count },
    (_, i) => categories[i] ?? "",
  );

  const setCategory = (index: number, value: string) => {
    const next = [...categoryList];
    next[index] = value;
    setField("categories", next);
  };

  const setBlock = (index: number, values: string[]) => {
    const next = blocks.map((b) => [...b]);
    next[index] = values;
    setField("blocks", next);
  };

  const addCategory = () => {
    setField("categories", [...categoryList, ""]);
    setField("blocks", [...blocks, []]);
  };

  const removeCategory = (index: number) => {
    setField(
      "categories",
      categoryList.filter((_, i) => i !== index),
    );
    setField(
      "blocks",
      blocks.filter((_, i) => i !== index),
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

      <SectionCard title={sc("categoriesTitle")}>
        <p className="text-xs text-muted-foreground -mt-2">
          {sc("categoriesHint")}
        </p>
        {categoryList.map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {sc("category", { n: index + 1 })}
              </span>
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="text-xs text-destructive hover:underline"
              >
                {st("remove")}
              </button>
            </div>
            <TextField
              label={sc("categoryTitle", { n: index + 1 })}
              value={categoryList[index]}
              onChange={(v) => setCategory(index, v)}
            />
            <FieldArray
              label={sc("skillsInCategory", { n: index + 1 })}
              values={blocks[index] ?? []}
              onChange={(v) => setBlock(index, v)}
              placeholder={sc("addSkillPlaceholder")}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addCategory}
          className="text-sm text-primary hover:underline"
        >
          {sc("addCategory")}
        </button>
      </SectionCard>
    </div>
  );
}
