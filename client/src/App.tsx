import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter, useHashLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import Saved from "./pages/Saved";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import SignIn from "./pages/SignIn";
import Apply from "./pages/Apply";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <WouterRouter hook={useHashLocation()}>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/discover"} component={Discover} />
      <Route path={"/saved"} component={Saved} />
      <Route path={"/applications"} component={Applications} />
      <Route path={"/apply/:id"} component={Apply} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/signin"} component={SignIn} />
      <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
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
        defaultTheme="dark"
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
