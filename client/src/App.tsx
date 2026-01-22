import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Clients from "./pages/Clients";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import Motorcycles from "./pages/Motorcycles";
import ClientDetails from "./pages/ClientDetails";
import DashboardWithCharts from "./pages/DashboardWithCharts";
import WhatsAppSetupGuide from "./pages/WhatsAppSetupGuide";
import ResponseTemplates from "./pages/ResponseTemplates";
import Reports from "./pages/Reports";

function Router() {
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/clients"} component={Clients} />
      <Route path={"/appointments"} component={Appointments} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/motorcycles"} component={Motorcycles} />
      <Route path="/clients/:id" component={ClientDetails} />
      <Route path="/dashboard-charts" component={DashboardWithCharts} />
      <Route path="/whatsapp-setup" component={WhatsAppSetupGuide} />
      <Route path="/templates" component={ResponseTemplates} />
      <Route path="/reports" component={Reports} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
