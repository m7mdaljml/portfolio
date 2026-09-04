import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ExternalLink,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  TriangleAlert,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  LogOut,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useContent } from "@/context/content-context";
import { useLang } from "@/context/language-context";
import { useTheme } from "@/context/theme-context";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/domain/admin-auth";
import { getFirebaseConfigStatus } from "@/services/firebase";
import AdminLogin from "./admin-login";
import AdminNav from "./admin-nav";
import SectionToggles from "./section-toggles";
import ContentEditors from "./editors/content-editors";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminAuthenticated);
  const { saving, dirty, save, resetAll, isRemote, loaded, hasEdits } = useContent();
  const { lang, toggleLang, t } = useLang();
  const admin = t.admin;
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const [activeTab, setActiveTab] = useState<string>("sections");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSave = async () => {
    setSaveState("saving");
    setSaveError("");
    const result = await save();
    if (result.ok) {
      setSaveState("saved");
    } else {
      setSaveState("error");
      if (result.reason === "not-configured") {
        const status = getFirebaseConfigStatus();
        setSaveError(
          status.missing.length > 0
            ? admin.saveError.missingEnv.replace("{{vars}}", status.missing.join(", "))
            : admin.saveError.notConfigured,
        );
      } else {
        setSaveError(result.message || admin.saveError.unknown);
      }
    }
    setTimeout(() => {
      setSaveState((s) => (s === "saving" ? "idle" : s));
    }, 4000);
  };

  const handleReset = async () => {
    setSaveState("saving");
    setSaveError("");
    const result = await resetAll();
    setSaveState(result.ok ? "saved" : "error");
    if (!result.ok) {
      setSaveError(
        result.reason === "not-configured"
          ? admin.saveError.notConfigured
          : result.message || admin.saveError.unknown,
      );
    }
    setTimeout(() => setSaveState("idle"), 2500);
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="font-bold leading-tight">{admin.header.title}</h1>
              <p className="text-xs text-muted-foreground">
                {isRemote
                  ? admin.header.connected
                  : admin.header.notConfigured}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 text-xs"
            >
              <Link href="/" onClick={handleLogout}>
                <ExternalLink size={14} />
                {admin.header.viewSite}
              </Link>
            </Button>
            <AdminNav onLogout={handleLogout} showLogout />
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
                <Link
                  href="/"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <ExternalLink size={16} />
                  {admin.header.viewSite}
                </Link>
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
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <LogOut size={16} />
                  {admin.nav.logout}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div>
              <p className="font-semibold text-sm">
                {isRemote ? admin.status.stored : admin.status.notStored}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRemote ? admin.status.instant : admin.status.setupHint}
              </p>
            </div>
            <div className="ms-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className={`gap-1.5 ${!hasEdits ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                disabled={!hasEdits}
              >
                <RotateCcw size={15} />
                {admin.buttons.reset}
              </Button>
              <Button
                onClick={handleSave}
                className={`gap-1.5 ${!dirty || saving || saveState === "saving" ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                disabled={saving || saveState === "saving" || !dirty}
              >
                {saveState === "saving" || saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : saveState === "saved" ? (
                  <CheckCircle2 size={15} />
                ) : saveState === "error" ? (
                  <TriangleAlert size={15} />
                ) : (
                  <Save size={15} />
                )}
                {saveState === "saving" || saving
                  ? admin.buttons.saveLoading
                  : saveState === "saved"
                  ? admin.buttons.saveDone
                  : saveState === "error"
                  ? admin.buttons.saveFailed
                  : admin.buttons.save}
              </Button>
            </div>
          </CardContent>
          {saveState === "error" && saveError && (
            <div className="px-4 pb-4 -mt-2 text-sm text-destructive flex items-start gap-2">
              <TriangleAlert size={16} className="shrink-0 mt-0.5" />
              <div className="break-all">
                <p className="font-semibold">{admin.saveError.title}</p>
                <p>{saveError}</p>
              </div>
            </div>
          )}
        </Card>

        {!loaded && (
          <div className="flex items-center gap-3 justify-center py-12 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" />
            {admin.loading}
          </div>
        )}

        {loaded && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="sections">{admin.tabs.sectionsLabel}</TabsTrigger>
              <TabsTrigger value="content">{admin.tabs.content}</TabsTrigger>
            </TabsList>
            <TabsContent value="sections">
              <SectionToggles />
            </TabsContent>
            <TabsContent value="content">
              <ContentEditors />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
