import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
import AppPage from "./pages/AppPage";
import AdminPage from "./pages/AdminPage";
import CreatePoolPage from "./pages/CreatePoolPage";
import JoinPoolPage from "./pages/JoinPoolPage";
import PaywallPage from "./pages/PaywallPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/join/:code" element={<JoinPoolPage />} />
            <Route path="/app" element={<ProtectedRoute><AppPage /></ProtectedRoute>} />
            <Route path="/admin/:poolId" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/create-pool" element={<ProtectedRoute><CreatePoolPage /></ProtectedRoute>} />
            <Route path="/pay/:poolId" element={<ProtectedRoute><PaywallPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
