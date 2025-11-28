import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Privacy = lazy(() => import("./pages/Privacy"));
const MyAccount = lazy(() => import("./pages/MyAccount"));
const Chart = lazy(() => import("./pages/Chart"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const Openchart = lazy(() => import("./pages/Openchart"));
const GreeksAnalysis = lazy(() => import("./pages/GreeksAnalysis"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/my-account" element={<MyAccount />} />
             {/*   <Route path="/chart" element={<Chart />} />
             <Route path="/openchart" element={<Openchart />} />
              <Route path="/greeks" element={<GreeksAnalysis />} />
              <Route path="/change-password" element={<ChangePassword />} />  */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
