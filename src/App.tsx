
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";

// Pages
import Index from "./pages/Index";
import DebtCalculator from "./pages/DebtCalculator";
import GroceryEstimator from "./pages/GroceryEstimator";
import SavingsPlanner from "./pages/SavingsPlanner";
import ElectricityTracker from "./pages/ElectricityTracker";
import WaterUsage from "./pages/WaterUsage";
import BudgetPlanner from "./pages/BudgetPlanner";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import FinancialAdvisors from "./pages/FinancialAdvisors";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/debt" element={<DebtCalculator />} />
            <Route path="/grocery" element={<GroceryEstimator />} />
            <Route path="/savings" element={<SavingsPlanner />} />
            <Route path="/electricity" element={<ElectricityTracker />} />
            <Route path="/water" element={<WaterUsage />} />
            <Route path="/budget" element={<BudgetPlanner />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/advisors" element={<FinancialAdvisors />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
