import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Star, GitFork, ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { useLang } from "@/context/language-context";
import { useContent } from "@/context/content-context";
import { recordProjectClick } from "@/services/site-analytics";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  homepage: string | null;
}

interface Project extends Repo {
  demoUrl: string;
  host: string;
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Vue: "#42b883",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  "C++": "#f34b7d",
  PHP: "#4F5D95",
  Shell: "#89e051",
};

const MAX_PROJECTS = 6;
const PREVIEW_TIMEOUT = 7000;
const DESKTOP_WIDTH = 1280;
const DESKTOP_HEIGHT = 720;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function toDemoUrl(homepage: string | null): string | null {
  if (!homepage) return null;
  const trimmed = homepage.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol.startsWith("http") ? url.toString() : null;
  } catch {
    return null;
  }
}

function toProject(repo: Repo): Project | null {
  const demoUrl = toDemoUrl(repo.homepage);
  if (!demoUrl) return null;
  return {
    ...repo,
    demoUrl,
    host: new URL(demoUrl).host.replace(/^www\./, ""),
  };
}

function ProjectPreview({
  project,
  labels,
  onOpen,
}: {
  project: Project;
  labels: {
    loadingPreview: string;
    previewUnavailable: string;
    liveDemo: string;
  };
  onOpen: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const shouldMount = useInView(frameRef, { once: true, margin: "300px" });
  const [scale, setScale] = useState(0.25);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">(
    "idle",
  );

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;
    const update = () =>
      setScale(
        Math.max(0.1, Math.round((element.clientWidth / DESKTOP_WIDTH) * 1000) / 1000),
      );
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldMount || status !== "idle") return;
    setStatus("loading");
    const timer = window.setTimeout(() => {
      setStatus((current) => (current === "loading" ? "failed" : current));
    }, PREVIEW_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [shouldMount, status]);

  return (
    <div
      ref={frameRef}
      className="relative w-full aspect-video overflow-hidden bg-muted"
    >
      {shouldMount && status !== "failed" && (
        <iframe
          src={project.demoUrl}
          title={project.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setStatus("ready")}
          className="absolute left-0 top-0 border-0 origin-top-left"
          style={{
            width: DESKTOP_WIDTH,
            height: DESKTOP_HEIGHT,
            transform: `scale(${scale})`,
          }}
        />
      )}

      {status !== "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-muted-foreground text-sm px-4 text-center pointer-events-none">
          {status === "failed" ? (
            <>
              <span>{labels.previewUnavailable}</span>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onOpen}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {labels.liveDemo}
                <ArrowUpRight size={13} />
              </a>
            </>
          ) : (
            <>
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">{labels.loadingPreview}</span>
            </>
          )}
        </div>
      )}

      {status === "ready" && (
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-3 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-0 transition-opacity group-hover/preview:opacity-100">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onOpen}
            title={labels.liveDemo}
            className="pointer-events-none group-hover/preview:pointer-events-auto focus-visible:pointer-events-auto flex items-center gap-1.5 rounded-full bg-background/95 border border-border px-3 py-1.5 text-[11px] font-medium text-foreground shadow-lg"
          >
            {labels.liveDemo}
            <ArrowUpRight size={12} className="text-primary" />
          </a>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { lang } = useLang();
  const { getMergedTranslations } = useContent();
  const pt = getMergedTranslations(lang).projects;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const headers: Record<string, string> = {};
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(
      "https://api.github.com/users/M7mdaljml/repos?sort=updated&per_page=30&type=owner",
      { headers },
    )
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((data: Repo[]) => {
        setProjects(
          data
            .filter((r) => !r.fork && r.name.toLowerCase() !== "m7mdaljml")
            .map(toProject)
            .filter((p): p is Project => p !== null)
            .slice(0, MAX_PROJECTS),
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const previewLabels = {
    loadingPreview: pt.loadingPreview,
    previewUnavailable: pt.previewUnavailable,
    liveDemo: pt.liveDemo,
  };

  return (
    <section
      id="projects"
      ref={ref}
      className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-16">
            <span className="text-primary font-mono text-sm">
              &lt;{pt.tag}&gt;
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {pt.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {pt.subtitle}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {pt.loading}
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-muted-foreground">
              {pt.error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              {pt.empty}
            </div>
          )}

          {!loading && !error && projects.length > 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, index) => (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="group/preview bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 flex flex-col"
                  >
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/50">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground truncate">
                        {project.host}
                      </span>
                    </div>

                    <ProjectPreview
                      project={project}
                      labels={previewLabels}
                      onOpen={() => recordProjectClick(project.name)}
                    />

                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => recordProjectClick(project.name)}
                        className="font-semibold text-foreground hover:text-primary transition-colors truncate"
                      >
                        {project.name}
                      </a>

                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        {project.description || pt.noDesc}
                      </p>

                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
                        <div className="flex items-center gap-3 min-w-0">
                          {project.language && (
                            <span className="flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{
                                  backgroundColor:
                                    LANG_COLORS[project.language] || "#8b949e",
                                }}
                              />
                              {project.language}
                            </span>
                          )}
                          {project.stargazers_count > 0 && (
                            <span className="flex items-center gap-1">
                              <Star size={12} />
                              {project.stargazers_count}
                            </span>
                          )}
                          {project.forks_count > 0 && (
                            <span className="flex items-center gap-1">
                              <GitFork size={12} />
                              {project.forks_count}
                            </span>
                          )}
                        </div>
                        <span className="font-mono shrink-0">
                          {formatDate(project.updated_at)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => recordProjectClick(project.name)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                          {pt.liveDemo}
                          <ArrowUpRight size={13} />
                        </a>
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <FiGithub size={13} />
                          {pt.source}
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="mt-10 flex justify-center"
              >
                <a
                  href="https://github.com/M7mdaljml"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordProjectClick("__all_repos__")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/50 text-primary hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all font-medium text-sm"
                >
                  <FiGithub size={18} />
                  {pt.viewAll}
                </a>
              </motion.div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <span className="text-primary font-mono text-sm">
              &lt;/{pt.tag}&gt;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
