import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import Profile from "./pages/Profile.tsx";
import Creators from "./pages/Creators.tsx";
import Explore from "./pages/Explore.tsx";
import ExploreKling from "./pages/ExploreKling.tsx";
import Gallery from "./pages/Gallery.tsx";
import EventDetail from "./pages/EventDetail.tsx";
import ExpHerAnime from "./pages/ExpHerAnime.tsx";
import ExpHerReal from "./pages/ExpHerReal.tsx";
import ExpHimAnime from "./pages/ExpHimAnime.tsx";
import ExpHimReal from "./pages/ExpHimReal.tsx";
import ExpGayAnime from "./pages/ExpGayAnime.tsx";
import ExpGayReal from "./pages/ExpGayReal.tsx";
import ExpHerAnimeNsfw from "./pages/ExpHerAnimeNsfw.tsx";
import ExpHerRealNsfw from "./pages/ExpHerRealNsfw.tsx";
import ExpHimAnimeNsfw from "./pages/ExpHimAnimeNsfw.tsx";
import ExpHimRealNsfw from "./pages/ExpHimRealNsfw.tsx";
import ExpGayAnimeNsfw from "./pages/ExpGayAnimeNsfw.tsx";
import ExpGayRealNsfw from "./pages/ExpGayRealNsfw.tsx";
import Pricing from "./pages/Pricing.tsx";
import Mina from "./pages/Mina.tsx";
import Saga from "./pages/Saga.tsx";
import MinaAuth from "./pages/MinaAuth.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdsStudio from "./pages/AdsStudio.tsx";
import Match from "./pages/Match.tsx";
import DramaStudio from "./pages/DramaStudio.tsx";
import DramaEditor from "./pages/DramaEditor.tsx";
import DramaShowrunner from "./pages/DramaShowrunner.tsx";
import Builder from "./pages/Builder.tsx";



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
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/mina" element={<Mina />} />
          <Route path="/saga" element={<Saga />} />
          <Route path="/mina/auth" element={<MinaAuth />} />
          <Route path="/admin/ads-studio" element={<AdsStudio />} />
          <Route path="/match" element={<Match />} />
          <Route path="/studio" element={<DramaStudio />} />
          <Route path="/studio/drama/:id" element={<DramaShowrunner />} />
          <Route path="/studio/drama/:id/legacy" element={<DramaEditor />} />


          {/* SFW funnels */}
          <Route path="/exp/her/anime/sfw" element={<ExpHerAnime />} />
          <Route path="/exp/her/real/sfw" element={<ExpHerReal />} />
          <Route path="/exp/him/anime/sfw" element={<ExpHimAnime />} />
          <Route path="/exp/him/real/sfw" element={<ExpHimReal />} />
          <Route path="/exp/gay/anime/sfw" element={<ExpGayAnime />} />
          <Route path="/exp/gay/real/sfw" element={<ExpGayReal />} />


          {/* NSFW funnels */}
          <Route path="/exp/her/anime/nsfw" element={<ExpHerAnimeNsfw />} />
          <Route path="/exp/her/real/nsfw" element={<ExpHerRealNsfw />} />
          <Route path="/exp/him/anime/nsfw" element={<ExpHimAnimeNsfw />} />
          <Route path="/exp/him/real/nsfw" element={<ExpHimRealNsfw />} />
          <Route path="/exp/gay/anime/nsfw" element={<ExpGayAnimeNsfw />} />
          <Route path="/exp/gay/real/nsfw" element={<ExpGayRealNsfw />} />


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
