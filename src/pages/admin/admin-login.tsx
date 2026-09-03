import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogIn, ShieldAlert, Menu, X, Sun, Moon, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AdminNav from "./admin-nav";
import { useLang } from "@/context/language-context";
import { useTheme } from "@/context/theme-context";
import { checkAdminPassword, setAdminAuthenticated } from "@/domain/admin-auth";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const { lang, toggleLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const login = t.admin.login;
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Small delay so the UI feels responsive.
    setTimeout(() => {
      if (checkAdminPassword(password)) {
        setAdminAuthenticated(true);
        onSuccess();
      } else {
        setError(true);
        setSubmitting(false);
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lock className="text-primary" size={18} />
            </div>
            <span className="font-bold">{login.brand}</span>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
              <a href="/">
                {t.visitSite}
                <ArrowRight size={14} />
              </a>
            </Button>
            <AdminNav />
          </div>
          <div className="lg:hidden">
            <motion.button
              onClick={() => setMobileOpen((o) => !o)}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
              aria-label="Open admin menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden border-t border-border"
            >
              <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
                <a
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <ArrowRight size={16} />
                  {t.visitSite}
                </a>
                <button
                  onClick={() => {
                    toggleLang();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <Globe size={16} />
                  {lang === "en" ? "العربية" : "English"}
                </button>
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="text-primary" size={26} />
            </div>
            <CardTitle className="text-2xl">{login.title}</CardTitle>
            <CardDescription>{login.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">{login.password}</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2">
                  <ShieldAlert size={16} />
                  {login.error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={!password || submitting}
              >
                <LogIn size={16} />
                {submitting ? login.checking : login.signIn}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
