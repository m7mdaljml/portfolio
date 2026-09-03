import { TextField, TextAreaField, SectionCard, FieldArray } from "./fields";
import { useSectionEditor } from "./use-section-editor";

interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
}

export default function ExperienceEditor({ lang }: { lang: "en" | "ar" }) {
  const { merged, setField, sc, st } = useSectionEditor("experience", lang);

  const jobs = ((merged.jobs ?? []) as Job[]).map((j) => ({
    ...j,
    description: [...(j.description ?? [])],
  }));

  const setJob = (index: number, patch: Partial<Job>) => {
    const next = jobs.map((j, i) => (i === index ? { ...j, ...patch } : j));
    setField("jobs", next);
  };

  const addJob = () => {
    setField("jobs", [
      ...jobs,
      {
        company: "",
        role: "",
        period: "",
        location: "",
        description: [],
      },
    ]);
  };

  const removeJob = (index: number) => {
    setField(
      "jobs",
      jobs.filter((_, i) => i !== index),
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
      </SectionCard>

      <SectionCard title={sc("jobsTitle")}>
        <p className="text-xs text-muted-foreground -mt-2">
          {sc("jobsHint")}
        </p>
        {jobs.map((job, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {sc("job", { n: index + 1 })}
              </span>
              <button
                type="button"
                onClick={() => removeJob(index)}
                className="text-xs text-destructive hover:underline"
              >
                {st("remove")}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <TextField
                label={sc("company")}
                value={job.company}
                onChange={(v) => setJob(index, { company: v })}
              />
              <TextField
                label={sc("role")}
                value={job.role}
                onChange={(v) => setJob(index, { role: v })}
              />
              <TextField
                label={sc("period")}
                value={job.period}
                onChange={(v) => setJob(index, { period: v })}
              />
              <TextField
                label={sc("location")}
                value={job.location}
                onChange={(v) => setJob(index, { location: v })}
              />
            </div>
            <FieldArray
              label={sc("descriptionPoints")}
              values={job.description ?? []}
              onChange={(v) => setJob(index, { description: v })}
              placeholder={sc("describePlaceholder")}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addJob}
          className="text-sm text-primary hover:underline"
        >
          {sc("addJob")}
        </button>
      </SectionCard>
    </div>
  );
}
