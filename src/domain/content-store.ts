import type { Lang } from "@/i18n/translations";

export type SectionKey =
  | "hero"
  | "about"
  | "skills"
  | "experience"
  | "achievements"
  | "education"
  | "github"
  | "contact";

export interface Flags {
  hero: boolean;
  about: boolean;
  skills: boolean;
  experience: boolean;
  achievements: boolean;
  education: boolean;
  github: boolean;
  contact: boolean;
  aiChat: boolean;
  contactForm: boolean;
}

export const DEFAULT_FLAGS: Flags = {
  hero: true,
  about: true,
  skills: true,
  experience: true,
  achievements: true,
  education: true,
  github: true,
  contact: true,
  aiChat: true,
  contactForm: true,
};

/**
 * Editable content per section. Each value is keyed by language.
 * Omitted keys fall back to the default translations in `translations.ts`.
 */
export interface SectionContent {
  hero: {
    firstname: string;
    lastname: string;
    role: string;
    tagline: string;
  };
  about: {
    bio1: string;
    bio2start: string;
    bio2Chair: string;
    bio2mid: string;
    bio2acpc: string;
    bio2end: string;
    bio2gdsc: string;
    bio3: string;
    yearsExp: string;
    yearsExpValue: string;
    companies: string;
    companiesValue: string;
    competitions: string;
    competitionsValue: string;
  };
  skills: {
    title: string;
    subtitle: string;
    categories: string[];
    blocks: string[][];
  };
  experience: {
    title: string;
    jobs: {
      company: string;
      role: string;
      period: string;
      location: string;
      description: string[];
    }[];
  };
  achievements: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      organization: string;
      description: string;
      year: string;
    }[];
  };
  education: {
    title: string;
    degree: string;
    university: string;
    years: string;
    gpa: string;
    desc1: string;
    desc2: string;
  };
  github: {
    title: string;
    subtitle: string;
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      title: string;
      subtitle: string;
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      send: string;
      sending: string;
    };
  };
}

export type LangContent = {
  [K in Lang]: Partial<SectionContent>;
};

export interface SiteContentState {
  flags: Flags;
  content: LangContent;
  knowledgeBase?: string;
}

export const EMPTY_CONTENT: LangContent = {
  en: {},
  ar: {},
};

export const DEFAULT_STATE: SiteContentState = {
  flags: DEFAULT_FLAGS,
  content: EMPTY_CONTENT,
};

const LOCAL_CACHE_KEY = "portfolio-admin-cache";

export function loadLocalCache(): SiteContentState | null {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    return raw ? (JSON.parse(raw) as SiteContentState) : null;
  } catch {
    return null;
  }
}

export function saveLocalCache(state: SiteContentState): void {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures.
  }
}

export function clearLocalCache(): void {
  try {
    localStorage.removeItem(LOCAL_CACHE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
