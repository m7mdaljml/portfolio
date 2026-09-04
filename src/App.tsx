import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "@/context/theme-context";
import { LanguageProvider } from "@/context/language-context";
import { ContentProvider } from "./context/content-context";
import { useVisitorTracking } from "./hooks/use-visitor-tracking";
import Portfolio from "./pages/portfolio";
import Admin from "./pages/admin/admin";

const queryClient = new QueryClient();

function Router() {
  useVisitorTracking();

  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ContentProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </ContentProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
