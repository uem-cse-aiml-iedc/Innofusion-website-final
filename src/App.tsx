import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load ClanLeaders page for better initial load
const ClanLeaders = lazy(() => import("./pages/ClanLeaders"));
const HacknestTeamPortal = lazy(() => import("./pages/HacknestTeamPortal"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

/*
 * Night-theme art is no longer prefetched here.
 *
 * ThemeContext already preloads the full night set on mount via new Image(),
 * so this duplicated six of those requests. More importantly it fired for
 * every visitor, including the majority who never switch themes, competing
 * with the hero image for bandwidth during the initial load. The theme
 * provider's own preload is enough, and the images are cheap now that they
 * are all WebP.
 */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      {/*
        reducedMotion="user" makes every framer-motion animation on the site
        honour the OS "reduce motion" setting. The CSS media query in
        index.css cannot reach these, because framer-motion drives transforms
        from JavaScript rather than through CSS transitions.
      */}
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/clan-leaders" element={<ClanLeaders />} />
                <Route path="/hacknest-team-portal" element={<HacknestTeamPortal />} />
                <Route path="/hacknest-team-portal/:urlToken" element={<HacknestTeamPortal />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
