import { motion } from "framer-motion";
import { LogOut, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";
import { useLang } from "@/context/language-context";

interface AdminNavProps {
  onLogout?: () => void;
  showLogout?: boolean;
}

export default function AdminNav({
  onLogout,
  showLogout = false,
}: AdminNavProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const nav = t.admin.nav;

  return (
    <div className="hidden lg:flex items-center gap-2">
      <button
        onClick={toggleLang}
        className="px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all text-xs font-bold font-mono inline-flex items-center gap-2 cursor-pointer"
        aria-label="Toggle language"
        data-testid="admin-lang-toggle"
      >
        {lang === "en" ? "ع" : "EN"}
        <Globe size={16} />
      </button>

      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all cursor-pointer"
        aria-label="Toggle theme"
        data-testid="admin-theme-toggle"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </motion.button>

      {showLogout && onLogout && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="gap-1.5 text-xs text-muted-foreground cursor-pointer"
        >
          <LogOut size={14} />
          {nav.logout}
        </Button>
      )}
    </div>
  );
}
