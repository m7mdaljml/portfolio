import { useContent } from "@/context/content-context";
import { useLang } from "@/context/language-context";
import type { SectionKey } from "@/domain/content-store";

type Lang = "en" | "ar";

export function useSectionEditor(section: SectionKey, lang: Lang) {
  const { getMergedTranslations, setSectionContentRaw, setFlag, flags } =
    useContent();
  const { t } = useLang();

  const merged = getMergedTranslations(lang)[section] as Record<
    string,
    unknown
  >;

  const setField = (field: string, value: unknown) => {
    setSectionContentRaw(lang, section, { [field]: value });
  };

  const setMany = (data: Record<string, unknown>) => {
    setSectionContentRaw(lang, section, data);
  };

  return {
    lang,
    merged,
    setField,
    setMany,
    visible: flags[section],
    setVisible: (v: boolean) => setFlag(section, v),
    sc: (key: string, vars?: Record<string, string | number>) => {
      const sec = t.admin.editors[section];
      const template = (sec as Record<string, unknown>)[key] as
        | string
        | undefined;
      let out = template ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.replace(new RegExp(`{{\\s*${k}\\s*}}`), String(v));
        }
      }
      return out;
    },
    st: (key: string) =>
      (t.admin.editors.common as Record<string, unknown>)[key] as
        | string
        | undefined,
  };
}
