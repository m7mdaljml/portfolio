import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder ?? label}
      />
    </div>
  );
}

export function FieldArray({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const update = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const add = () => onChange([...values, ""]);

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => update(index, e.target.value)}
              placeholder={placeholder ?? `${label} ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label={`Remove ${label} ${index + 1}`}
            >
              <Trash2 size={16} className="text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={add}
        className="gap-1.5"
      >
        <Plus size={14} />
        Add {label}
      </Button>
    </div>
  );
}

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}
