import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Details from "./pages/Details";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import PaymentPage from "./pages/PaymentPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import CookieConsent from "@/components/CookieConsent";
import AboutPage from "./pages/AboutPage";
import ProblemStatementsPage from "./pages/ProblemStatementsPage";
import PrizesPage from "./pages/PrizesPage";
import TimelinePage from "./pages/TimelinePage";
import SponsorsPage from "./pages/SponsorsPage";
import TeamPage from "./pages/TeamPage";
import CommunityPage from "./pages/CommunityPage";
import EventsPage from "./pages/EventsPage";
import FaqPage from "./pages/FaqPage";
import GuidelinesPage from "./pages/GuidelinesPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/details" element={<Details />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/problem-statements" element={<ProblemStatementsPage />} />
        <Route path="/prizes" element={<PrizesPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/guidelines" element={<GuidelinesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
      <Toaster />
    </Router>
  );
}

export default App;