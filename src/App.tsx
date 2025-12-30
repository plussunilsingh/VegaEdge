import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "@/components/ProtectedRoute";

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
// const GreeksAnalysis = lazy(() => import("./pages/GreeksAnalysis")); // DELETED
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const LiveData = lazy(() => import("./pages/LiveData"));
const AngleOneLiveData = lazy(() => import("./pages/AngleOneLiveData"));
// const UpstoxToken = lazy(() => import("./pages/UpstoxToken")); // Keeping for now but features moved to Admin

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

import Footer from "@/components/Footer";

// ... (lazy imports)

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/privacy" element={<Privacy />} />
                    
                    {/* Protected Routes */}
                    <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
                    <Route path="/chart" element={<ProtectedRoute><Chart /></ProtectedRoute>} />
                    <Route path="/openchart" element={<ProtectedRoute><Openchart /></ProtectedRoute>} />
                    <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/live-data" element={<ProtectedRoute><LiveData /></ProtectedRoute>} />
                    <Route path="/angleone-live-data" element={<ProtectedRoute><AngleOneLiveData /></ProtectedRoute>} />
                    
                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
