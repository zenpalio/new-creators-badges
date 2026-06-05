import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Profile from "./pages/Profile.tsx";
import Creators from "./pages/Creators.tsx";
import Explore from "./pages/Explore.tsx";
import ExploreKling from "./pages/ExploreKling.tsx";
import Verification from "./pages/Verification.tsx";
import Gallery from "./pages/Gallery.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import YotiVerificationDemo from "./pages/YotiVerificationDemo.tsx";
import Popunder from "./pages/Popunder.tsx";
import PopNsfwHer from "./pages/PopNsfwHer.tsx";
import PopNsfwGay from "./pages/PopNsfwGay.tsx";
import PopSfwHim from "./pages/PopSfwHim.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/explore" element={<ExploreKling />} />
          <Route path="/explore/event/:id" element={<EventDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/badges" element={<Profile />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/yoti-verification" element={<YotiVerificationDemo />} />
          <Route path="/p/:variant" element={<Popunder />} />
          <Route path="/pop/nsfw-her" element={<PopNsfwHer />} />
          <Route path="/pop/nsfw-gay" element={<PopNsfwGay />} />
          <Route path="/pop/sfw-him" element={<PopSfwHim />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
