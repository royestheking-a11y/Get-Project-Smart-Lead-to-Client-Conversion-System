import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import WatchDemo from "./pages/WatchDemo";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import ImportLeads from "./pages/ImportLeads";
import Leads from "./pages/Leads";
import Templates from "./pages/Templates";
import EmailLogs from "./pages/EmailLogs";
import Followups from "./pages/Followups";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

import ScrollToTop from "@/components/ScrollToTop";

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/watch-demo" element={<WatchDemo />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />

      {/* Protected routes with sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/leads/import" element={<ImportLeads />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/logs" element={<EmailLogs />} />
        <Route path="/followups" element={<Followups />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
