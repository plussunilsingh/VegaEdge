import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

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
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Strategies = lazy(() => import("./pages/Strategies"));
const LiveData = lazy(() => import("./pages/LiveData"));
const AngleOneLiveData = lazy(() => import("./pages/AngleOneLiveData"));
const PricingDetails = lazy(() => import("./pages/PricingDetails"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

import Footer from "@/components/Footer";

import MainLayout from "@/components/MainLayout";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Suspense fallback={<LoadingFallback />}>
                <MainLayout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/pricing-details" element={<PricingDetails />} />
                    <Route path="/strategies" element={<Strategies />} />

                    {/* Protected Routes */}
                    <Route
                      path="/my-account"
                      element={
                        <ProtectedRoute>
                          <MyAccount />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chart"
                      element={
                        <ProtectedRoute>
                          <Chart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/openchart"
                      element={
                        <ProtectedRoute>
                          <Openchart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/change-password"
                      element={
                        <ProtectedRoute>
                          <ChangePassword />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/live-data"
                      element={
                        <ProtectedRoute>
                          <LiveData />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/angleone-live-data"
                      element={
                        <ProtectedRoute>
                          <AngleOneLiveData />
                        </ProtectedRoute>
                      }
                    />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </Suspense>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
