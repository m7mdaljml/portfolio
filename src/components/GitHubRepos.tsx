import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { useLang } from "@/context/LanguageContext";

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

export default function GitHubRepos() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLang();
  const gt = t.github;

  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const headers: Record<string, string> = {};
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(
      "https://api.github.com/users/M7mdaljml/repos?sort=updated&per_page=6&type=owner",
      { headers },
    )
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((data: Repo[]) => {
        setRepos(
          data.filter((r) => !r.fork && r.name !== "m7mdaljml").slice(0, 6),
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section
      id="github"
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
              &lt;{gt.tag}&gt;
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mt-4 mb-6">
              {gt.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {gt.subtitle}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20 text-muted-foreground gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              {gt.loading}
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-muted-foreground">
              {gt.error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {repos.map((repo, index) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                    className="group bg-card border border-border rounded-xl p-5 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FiGithub size={16} className="text-primary" />
                        <span className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {repo.name}
                        </span>
                      </div>
                      <ExternalLink
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {repo.description || gt.noDesc}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block"
                              style={{
                                backgroundColor:
                                  LANG_COLORS[repo.language] || "#8b949e",
                              }}
                            />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={12} />
                            {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1">
                            <GitFork size={12} />
                            {repo.forks_count}
                          </span>
                        )}
                      </div>
                      <span className="font-mono">
                        {formatDate(repo.updated_at)}
                      </span>
                    </div>
                  </motion.a>
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
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/50 text-primary hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all font-medium text-sm"
                >
                  <FiGithub size={18} />
                  {gt.viewAll}
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
              &lt;/{gt.tag}&gt;
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
