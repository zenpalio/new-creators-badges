import { useState } from "react";
import { Bell, Sparkles, Camera, Video, ImageIcon } from "lucide-react";
import Sidebar from "../components/Sidebar";
import CharacterCard from "../components/CharacterCard";
import ContentCard from "../components/ContentCard";
import ModelCard from "../components/ModelCard";
import SectionHeader from "../components/SectionHeader";
import HorizontalScroll from "../components/HorizontalScroll";
import TagRow from "../components/TagRow";
import CreateToolCard from "../components/CreateToolCard";
import CreatorCard from "../components/CreatorCard";
import StoryCard from "../components/StoryCard";

import char1 from "../assets/char1.jpg";
import char2 from "../assets/char2.jpg";
import char3 from "../assets/char3.jpg";
import char4 from "../assets/char4.jpg";
import char5 from "../assets/char5.jpg";
import char6 from "../assets/char6.jpg";
import model1 from "../assets/model1.jpg";
import model2 from "../assets/model2.jpg";
import model3 from "../assets/model3.jpg";
import model4 from "../assets/model4.jpg";
import creator1 from "../assets/creator1.jpg";

const topCreators = [
  { name: "Big Daddy", avatarUrl: creator1, verified: true },
  { name: "Big Daddy", avatarUrl: creator1, verified: false },
  { name: "Big Daddy", avatarUrl: creator1, verified: false },
  { name: "Big Daddy", avatarUrl: creator1, verified: false },
  { name: "Big Daddy", avatarUrl: creator1, verified: false },
];

const characters = [
  { name: "Lumi", description: "Hi there, I'm your pocket fairy", messageCount: 0, imageUrl: char1 },
  { name: "Catalina", description: "She's your smug college bully who's always tormented you as a total...", messageCount: 2, imageUrl: char2 },
  { name: "Zahra", description: "Step into the shoes of a cunning stepson facing your broken step-...", messageCount: 0, imageUrl: char3 },
  { name: "Sakura", description: "Your flirty roommate just busted you red-handed with her panties, her...", messageCount: 0, imageUrl: char4 },
  { name: "Jhanvi", description: "Your busty step-mom walks in, you mid-stroke, her eyes wide...", messageCount: 0, imageUrl: char5 },
  { name: "Elena", description: "A mysterious woman from the old city, with secrets untold...", messageCount: 5, imageUrl: char6 },
];

const trendingContent = [
  { imageUrl: char1, likeCount: 83 },
  { imageUrl: char3, likeCount: 137 },
  { imageUrl: char5, likeCount: 54 },
  { imageUrl: char6, likeCount: 46 },
  { imageUrl: char2, likeCount: 21 },
  { imageUrl: char4, likeCount: 92 },
];

const blackBeauties = [
  { name: "Tessa", description: "Tessa approaches her role as a nurse with warmth and...", messageCount: "1.1K", likeCount: "720", imageUrl: model1 },
  { name: "Mel", description: "Mel pours passion into her role as a model, bringing de...", messageCount: "1K", likeCount: "596", imageUrl: model2 },
  { name: "Zuri", description: "Hey, I'm Zuri—22, unapologetically curvy, with...", messageCount: "0", likeCount: "1", imageUrl: model1 },
  { name: "Nia", description: "In the warm glow of the living room after a quiet family...", messageCount: "0", likeCount: "0", imageUrl: model2 },
  { name: "Zora", description: "Hey, I'm Zora—27, black, with icy blue eyes and short...", messageCount: "32", likeCount: "0", imageUrl: model1 },
];

const dreammixModels = [
  { name: "Anka", description: "Hello there... I'm Anka. I grew up feeding goats and pickin...", messageCount: "2.3K", likeCount: "1K", imageUrl: model3 },
  { name: "Sylva", description: "I was just an NPC once. now I'm a thirst trap with glowing...", messageCount: "412", likeCount: "968", imageUrl: model4 },
  { name: "Nyxx", description: "Nyxx here 🖤 certified disaster, horror speedrunner...", messageCount: "1.8K", likeCount: "904", imageUrl: model3 },
  { name: "Sierra", description: "Apache blood. Activist tongue. Survival hips. I'm not...", messageCount: "2.8K", likeCount: "877", imageUrl: model4 },
  { name: "Flora", description: "Flora is a calm, alluring therapist in her early 30s...", messageCount: "21.8K", likeCount: "830", imageUrl: model3 },
];

const createTools = [
  { title: "Create Custom Babe", color: "bg-gradient-to-br from-purple-500 to-purple-700", icon: <Sparkles className="w-6 h-6 text-primary-v2-foreground" /> },
  { title: "Video Generator", color: "bg-gradient-to-br from-red-400 to-red-600", icon: <Video className="w-6 h-6 text-primary-v2-foreground" /> },
  { title: "Image Generator", color: "bg-gradient-to-br from-blue-500 to-blue-700", icon: <ImageIcon className="w-6 h-6 text-primary-v2-foreground" /> },
  { title: "Create Template Babe", color: "bg-gradient-to-br from-green-500 to-green-700", icon: <Camera className="w-6 h-6 text-primary-v2-foreground" /> },
];

const stories = [
  { title: "Summer Adventures", description: "The rating logic is working correctly. The story on this creator's profile simply has no ratings yet, so the rating badge doesn't appear", imageUrl: char1, episodes: 1, scenes: 6 },
  { title: "Dark Desires", description: "A thrilling journey through the shadows of the city where nothing is as it seems...", imageUrl: char3, episodes: 3, scenes: 12 },
  { title: "Campus Life", description: "Follow the wild adventures of college students navigating love, drama and late-night study sessions...", imageUrl: char5, episodes: 2, scenes: 8 },
  { title: "Midnight Whispers", description: "Secrets unfold under the moonlight as two strangers meet at a mysterious masquerade ball...", imageUrl: char2, episodes: 1, scenes: 4 },
  { title: "Island Escape", description: "Stranded on a tropical paradise with a beautiful stranger, every day brings new temptation...", imageUrl: char6, episodes: 4, scenes: 18 },
];

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background-v2">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-[68px]" : "ml-[240px]"
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5">
          <h1 className="text-2xl font-bold text-foreground-v2">
            Welcome back, Arthur <span className="text-primary-v2">💜</span>
          </h1>
          <button className="p-2 rounded-full hover:bg-muted-v2 transition-colors">
            <Bell className="w-5 h-5 text-muted-v2-foreground" />
          </button>
        </header>

        <div className="px-8 pb-12 space-y-10">
          {/* Your Babes */}
          <section>
            <SectionHeader title="Your Babes Are Waiting" />
            <HorizontalScroll>
              {characters.map((c) => (
                <CharacterCard key={c.name} {...c} />
              ))}
            </HorizontalScroll>
          </section>

          {/* Top Trending Videos */}
          <section>
            <SectionHeader title="Top Trending Videos" />
            <TagRow />
            <div className="mt-4">
              <HorizontalScroll>
                {trendingContent.map((c, i) => (
                  <ContentCard key={i} {...c} />
                ))}
              </HorizontalScroll>
            </div>
          </section>

          {/* Stories */}
          <section>
            <SectionHeader title="Featured Stories" />
            <HorizontalScroll>
              {stories.map((s) => (
                <StoryCard key={s.title} {...s} />
              ))}
            </HorizontalScroll>
          </section>

          {/* Start Creating */}
          <section>
            <SectionHeader title="Start Creating" />
            <HorizontalScroll>
              {createTools.map((t) => (
                <CreateToolCard key={t.title} {...t} />
              ))}
            </HorizontalScroll>
          </section>

          {/* Black Beauties */}
          <section>
            <SectionHeader title="Black Beauties" />
            <HorizontalScroll>
              {blackBeauties.map((m) => (
                <ModelCard key={m.name} {...m} />
              ))}
            </HorizontalScroll>
          </section>

          {/* TOP Creators */}
          <section>
            <SectionHeader title="TOP Creators" />
            <HorizontalScroll>
              {topCreators.map((c, i) => (
                <CreatorCard key={i} {...c} rank={i + 1} />
              ))}
            </HorizontalScroll>
          </section>

          {/* Dreammix Models */}
          <section>
            <SectionHeader title="Dreammix Models" />
            <HorizontalScroll>
              {dreammixModels.map((m) => (
                <ModelCard key={m.name} {...m} />
              ))}
            </HorizontalScroll>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
