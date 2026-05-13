import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { Suspense, useEffect } from "react";
import { captureCampaignParams } from "@/lib/campaign";
import { resolveIp } from "@/lib/ip";
import IntroPage from "./pages/IntroPage";
import NotFound from "./pages/NotFound";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Funnel boot side effects:
//   - captureCampaignParams() runs on EVERY navigation because the URL is
//     the source of truth for prc_id / mdid. If the user navigates to a
//     page without those query params, session is cleared so they stop
//     seeing a stale discount.
//   - resolveIp() runs once on first mount; the API client lazily awaits
//     the resolution on its first request so the first call never goes
//     out with an empty ip_address header. A failed ipify lookup surfaces
//     here as a toast (advisory; the API client falls back to an empty
//     header rather than blocking).
const AppBoot = () => {
  const location = useLocation();

  useEffect(() => {
    captureCampaignParams();
  }, [location.pathname, location.search]);

  useEffect(() => {
    void resolveIp().then((res) => {
      if (!res.ok) {
        toast.error("Could not start the test. Please refresh.");
      }
    });
  }, []);

  return null;
};

const InstructionsPage = React.lazy(() => import("./pages/InstructionsPage"));
const QuizPage = React.lazy(() => import("./pages/QuizPage"));
const ResultsPage = React.lazy(() => import("./pages/PremiumReportPage"));
const CalculatingPage = React.lazy(() => import("./pages/CalculatingPage"));
const EmailCapturePage = React.lazy(() => import("./pages/EmailCapturePage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const CrossSellPage = React.lazy(() => import("./pages/CrossSellPage"));
const DetailsPage = React.lazy(() => import("./pages/DetailsPage"));
const AvatarGallery = React.lazy(() => import("./pages/AvatarGallery"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = React.lazy(() => import("./pages/TermsPage"));
const SubscriptionPolicyPage = React.lazy(() => import("./pages/SubscriptionPolicyPage"));
const PricingPage = React.lazy(() => import("./pages/PricingPage"));
const AboutIQBoosterPage = React.lazy(() => import("./pages/AboutIQBoosterPage"));
const SixteenTypesPage = React.lazy(() => import("./pages/SixteenTypesPage"));
const AboutUsPage = React.lazy(() => import("./pages/AboutUsPage"));
const FAQPage = React.lazy(() => import("./pages/FAQPage"));
const PremiumReportPage = React.lazy(() => import("./pages/PremiumReportPage"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <p className="text-muted-foreground text-sm">Loading…</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppBoot />
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/calculating" element={<CalculatingPage />} />
            <Route path="/email" element={<EmailCapturePage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/cross-sell" element={<CrossSellPage />} />
            <Route path="/details" element={<DetailsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/avatars" element={<AvatarGallery />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-conditions" element={<TermsPage />} />
            <Route path="/subscription-policy" element={<SubscriptionPolicyPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about-iq-booster" element={<AboutIQBoosterPage />} />
            <Route path="/16-types" element={<SixteenTypesPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/premium-report" element={<PremiumReportPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
