import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { SectionCard } from "./fields";
import { useContent } from "@/context/content-context";
import { useLang } from "@/context/language-context";
import { KNOWLEDGE_BASE } from "@/services/knowledge-base";

export default function KnowledgeBaseEditor() {
  const { knowledgeBase, setKnowledgeBase } = useContent();
  const { t } = useLang();
  const kbText = t.admin.knowledgeBase;
  const [localValue, setLocalValue] = useState(knowledgeBase);

  useEffect(() => {
    if (!localValue && knowledgeBase) {
      setLocalValue(knowledgeBase);
    }
  }, [knowledgeBase, localValue]);

  const handleChange = (value: string) => {
    setLocalValue(value);
    setKnowledgeBase(value);
  };

  const handleReset = () => {
    setLocalValue(KNOWLEDGE_BASE);
    setKnowledgeBase(KNOWLEDGE_BASE);
  };

  return (
    <div className="space-y-4">
      <SectionCard title={kbText.title}>
        <p className="text-sm text-muted-foreground">{kbText.description}</p>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{kbText.contentLabel}</Label>
          <Textarea
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            rows={20}
            placeholder={kbText.placeholder}
            className="font-mono text-sm"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {kbText.fallbackHint}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5"
          >
            <RotateCcw size={14} />
            {kbText.resetToDefault}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
