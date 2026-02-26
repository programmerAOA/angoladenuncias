import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import ArticleDetail from "./pages/ArticleDetail";
import OpinionDetail from "./pages/OpinionDetail";
import AdvertisingPage from "./pages/AdvertisingPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import VideosPage from "./pages/VideosPage";
import { ThemeProvider } from "@/components/ThemeProvider";
import SecurityLayer from "@/components/SecurityLayer";
import CookieConsent from "@/components/CookieConsent";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme" attribute="class">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SecurityLayer>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
                <Route path="/opinion/:id" element={<OpinionDetail />} />
                <Route path="/publicidade" element={<AdvertisingPage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/termos" element={<TermsPage />} />
                <Route path="/privacidade" element={<PrivacyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieConsent />
              <AnalyticsTracker />
            </SecurityLayer>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
