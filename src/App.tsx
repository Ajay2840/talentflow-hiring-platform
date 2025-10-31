import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import ViewJob from "./pages/ViewJob";
import EditJob from "./pages/EditJob";
import Candidates from "./pages/Candidates";
import CandidateProfile from "./pages/CandidateProfile";
import CandidatesKanban from "./pages/CandidatesKanban";
import Assessments from "./pages/Assessments";
import NewAssessment from "./pages/NewAssessment";
import ViewAssessment from "./pages/ViewAssessment";
import NotFound from "./pages/NotFound";
import { worker } from './lib/msw-browser';
import { seedDatabase } from './lib/seed-data';
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
// Documentation route removed
import Help from "./pages/Help";

const queryClient = new QueryClient();

// Start MSW and seed database
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass',
  });
  seedDatabase();
}

const App = () => {
  useEffect(() => {
    seedDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/jobs" element={<AppLayout><Jobs /></AppLayout>} />
            <Route path="/jobs/:id" element={<AppLayout><ViewJob /></AppLayout>} />
            <Route path="/jobs/:id/edit" element={<AppLayout><EditJob /></AppLayout>} />
            <Route path="/candidates" element={<AppLayout><Candidates /></AppLayout>} />
            <Route path="/candidates/kanban" element={<AppLayout><CandidatesKanban /></AppLayout>} />
            <Route path="/candidates/:id" element={<AppLayout><CandidateProfile /></AppLayout>} />
            <Route path="/assessments" element={<AppLayout><Assessments /></AppLayout>} />
            <Route path="/assessments/new" element={<AppLayout><NewAssessment /></AppLayout>} />
            <Route path="/assessments/:id" element={<AppLayout><ViewAssessment /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
            {/* Documentation route removed */}
            <Route path="/help" element={<AppLayout><Help /></AppLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
