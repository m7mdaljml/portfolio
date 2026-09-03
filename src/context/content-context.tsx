import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  clearLocalCache,
  DEFAULT_STATE,
  loadLocalCache,
  saveLocalCache,
  type Flags,
  type LangContent,
  type SectionContent,
  type SectionKey,
  type SiteContentState,
} from "@/domain/content-store";
import translations, { type Lang } from "@/i18n/translations";
import {
  isFirebaseConfigured,
  loadContentFromFirebase,
  saveContentToFirebase,
  subscribeToFirebase,
  type SaveResult,
} from "@/services/firebase";

interface ContentContextValue {
  flags: Flags;
  content: LangContent;
  loaded: boolean;
  saving: boolean;
  dirty: boolean;
  isRemote: boolean;
  setFlag: (key: keyof Flags, value: boolean) => void;
  setSectionContent: (
    lang: "en" | "ar",
    section: SectionKey,
    data: Partial<SectionContent[SectionKey]>,
  ) => void;
  setSectionContentRaw: (
    lang: "en" | "ar",
    section: SectionKey,
    data: Record<string, unknown>,
  ) => void;
  save: () => Promise<SaveResult>;
  resetAll: () => Promise<SaveResult>;
  hasOverrides: (lang: "en" | "ar", section: SectionKey) => boolean;
  hasEdits: boolean;
  getSection: (
    lang: "en" | "ar",
    section: SectionKey,
  ) => Partial<SectionContent[SectionKey]> | undefined;
  getMergedTranslations: (lang: Lang) => typeof translations[Lang];
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

function mergeFlags(base: Flags, incoming?: Partial<Flags>): Flags {
  return { ...base, ...(incoming ?? {}) };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override)) {
    return (override ?? base) as T;
  }
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override)) {
    const baseValue = (base as Record<string, unknown>)?.[key];
    const overrideValue = override[key];
    result[key] = deepMerge(baseValue, overrideValue);
  }
  return result as T;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteContentState>(() => {
    const cached = loadLocalCache();
    return {
      flags: mergeFlags(DEFAULT_STATE.flags, cached?.flags),
      content: cached?.content ?? DEFAULT_STATE.content,
    };
  });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [isRemote, setIsRemote] = useState(isFirebaseConfigured());
  const hasHydrated = useRef(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let active = true;

    loadContentFromFirebase().then((remoteState) => {
      if (!active) return;
      if (remoteState) {
        setState((prev) => ({
          flags: mergeFlags(prev.flags, remoteState.flags),
          content: {
            en: { ...prev.content.en, ...remoteState.content?.en },
            ar: { ...prev.content.ar, ...remoteState.content?.ar },
          },
        }));
        saveLocalCache({
          flags: remoteState.flags,
          content: remoteState.content,
        });
      }
      setLoaded(true);
      hasHydrated.current = true;
    });

    unsubscribe = subscribeToFirebase((remoteState) => {
      setState((prev) => ({
        flags: mergeFlags(prev.flags, remoteState.flags),
        content: {
          en: { ...prev.content.en, ...remoteState.content?.en },
          ar: { ...prev.content.ar, ...remoteState.content?.ar },
        },
      }));
      saveLocalCache(remoteState);
    });

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const updateState = useCallback(
    (updater: (prev: SiteContentState) => SiteContentState) => {
      setState((prev) => {
        const next = updater(prev);
        saveLocalCache(next);
        return next;
      });
      setDirty(true);
    },
    [],
  );

  const setFlag = useCallback(
    (key: keyof Flags, value: boolean) => {
      updateState((prev) => ({
        ...prev,
        flags: { ...prev.flags, [key]: value },
      }));
    },
    [updateState],
  );

  const setSectionContent = useCallback(
    (
      lang: "en" | "ar",
      section: SectionKey,
      data: Partial<SectionContent[SectionKey]>,
    ) => {
      updateState((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [lang]: {
            ...prev.content[lang],
            [section]: {
              ...(prev.content[lang][section] as Record<string, unknown>),
              ...(data as Record<string, unknown>),
            },
          },
        },
      }));
    },
    [updateState],
  );

  const setSectionContentRaw = useCallback(
    (
      lang: "en" | "ar",
      section: SectionKey,
      data: Record<string, unknown>,
    ) => {
      updateState((prev) => ({
        ...prev,
        content: {
          ...prev.content,
          [lang]: {
            ...prev.content[lang],
            [section]: { ...(prev.content[lang][section] as Record<string, unknown>), ...data },
          },
        },
      }));
    },
    [updateState],
  );

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const result = await saveContentToFirebase(state);
      if (result.ok) {
        setDirty(false);
        setIsRemote(true);
      }
      return result;
    } finally {
      setSaving(false);
    }
  }, [state]);

  const resetAll = useCallback(async () => {
    clearLocalCache();
    const defaultState: SiteContentState = {
      ...DEFAULT_STATE,
      content: { en: {}, ar: {} },
    };
    setState(defaultState);
    setSaving(true);
    try {
      const result = await saveContentToFirebase(defaultState);
      if (result.ok) {
        setDirty(false);
        setIsRemote(true);
      } else {
        setDirty(true);
      }
      return result;
    } finally {
      setSaving(false);
    }
  }, []);

  const hasOverrides = useCallback(
    (lang: "en" | "ar", section: SectionKey) =>
      Boolean(state.content[lang][section]),
    [state.content],
  );

  const hasEdits = useMemo(() => {
    const contentHasOverrides = (["en", "ar"] as const).some(
      (lang) => Object.keys(state.content[lang] ?? {}).length > 0,
    );
    const flagsDifferFromDefault = (Object.keys(state.flags) as Array<
      keyof Flags
    >).some((key) => state.flags[key] !== DEFAULT_STATE.flags[key]);
    return contentHasOverrides || flagsDifferFromDefault;
  }, [state.content, state.flags]);

  const getSection = useCallback(
    (lang: "en" | "ar", section: SectionKey) => state.content[lang][section],
    [state.content],
  );

  const getMergedTranslations = useCallback(
    (lang: Lang) => deepMerge(translations[lang], state.content[lang]),
    [state.content],
  );

  return (
    <ContentContext.Provider
      value={{
        flags: state.flags,
        content: state.content,
        loaded,
        saving,
        dirty,
        isRemote,
        setFlag,
        setSectionContent,
        setSectionContentRaw,
        save,
        resetAll,
        hasOverrides,
        hasEdits,
        getSection,
        getMergedTranslations,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}
