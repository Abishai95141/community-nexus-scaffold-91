
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import IdeasPage from "./pages/IdeasPage";
import ProjectsPage from "./pages/ProjectsPage";
import DocsPage from "./pages/DocsPage";
import TechTalksPage from "./pages/TechTalksPage";
import CommunityPage from "./pages/CommunityPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { useAuthUser } from "./hooks/useAuthUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { role, loading, profileStatus } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect users based on authentication status and profile status
  useEffect(() => {
    console.log("Auth state changed:", { role, loading, profileStatus, location: location.pathname });
    
    // Still loading, don't redirect yet
    if (loading) {
      return;
    }

    // Not logged in and not on auth page, redirect to auth
    if (!role && location.pathname !== "/auth") {
      navigate("/auth", { replace: true });
      return;
    }
    
    // Has pending/rejected profile status - stay on auth page
    if (profileStatus === "pending" || profileStatus === "rejected") {
      if (location.pathname !== "/auth") {
        navigate("/auth", { replace: true });
      }
      return;
    }
    
    // If logged in with approved status and on /auth, redirect to Home
    if (role && profileStatus === "approved" && location.pathname === "/auth") {
      navigate("/", { replace: true });
      return;
    }
    
    // If not admin and trying to access /admin, redirect to Home
    if (location.pathname.startsWith("/admin") && role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
  }, [role, loading, profileStatus, location, navigate]);

  return (
    <Routes>
      {/* Only render AuthPage without MainLayout */}
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={role ? <HomePage /> : <Navigate to="/auth" replace />} />
        <Route path="/ideas" element={role ? <IdeasPage /> : <Navigate to="/auth" replace />} />
        <Route path="/projects" element={role ? <ProjectsPage /> : <Navigate to="/auth" replace />} />
        <Route path="/docs" element={role ? <DocsPage /> : <Navigate to="/auth" replace />} />
        <Route path="/talks" element={role ? <TechTalksPage /> : <Navigate to="/auth" replace />} />
        <Route path="/community" element={role ? <CommunityPage /> : <Navigate to="/auth" replace />} />
        {role === "admin" && (
          <Route path="/admin" element={<AdminPage />} />
        )}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
