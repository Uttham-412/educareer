import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Student from "./pages/Student";
import Timetable from "./pages/Timetable";
import Resume from "./pages/Resume";
import Opportunities from "./pages/Opportunities";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import { ConnectionTest } from "./components/debug/ConnectionTest";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthRedirect } from "./components/auth/AuthRedirect";
import { StudentProfileOnboarding } from "./components/profile/StudentProfileOnboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/debug" element={<ConnectionTest />} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <StudentProfileOnboarding
                    onComplete={() => (window.location.href = "/dashboard")}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<AuthRedirect />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/student" element={<Student />} />
                      <Route path="/timetable" element={<Timetable />} />
                      <Route path="/resume" element={<Resume />} />
                      <Route
                        path="/opportunities"
                        element={<Opportunities />}
                      />
                      <Route
                        path="/notifications"
                        element={<Notifications />}
                      />

                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
