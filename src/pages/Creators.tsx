import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import SideNav from "../components/SideNav";
import { type BadgeTier } from "../components/BadgeCard";
import {
  CreatorsView,
  type CreatorsViewCreator,
  type CreatorsViewLabels,
} from "../components/CreatorsView";
import CreateFloatingButton from "../components/CreateFloatingButton";
import creator1 from "../assets/creator1_new.jpg";
import creator2 from "../assets/creators/creator2.jpg";
import creator3 from "../assets/creators/creator3.jpg";
import creator4 from "../assets/creators/creator4.jpg";
import creator5 from "../assets/creators/creator5.jpg";
import creator6 from "../assets/creators/creator6.jpg";
import creator7 from "../assets/creators/creator7.jpg";
import creator8 from "../assets/creators/creator8.jpg";
import creator9 from "../assets/creators/creator9.jpg";
import creator10 from "../assets/creators/creator10.jpg";

export const creatorsPageLabels: CreatorsViewLabels = {
  title: "Creators",
  searchPlaceholder: "Search creators...",
  sortBy: {
    aura: "Most Aura",
    likes: "Most Liked",
    followers: "Most Followers",
  },
  timeFilter: {
    all: "All time",
    year: "Year",
    month: "Month",
    week: "Week",
  },
  creationType: {
    all: "All Creations",
    characters: "Characters",
    images: "Images",
    videos: "Videos",
    stories: "Stories",
  },
  emptyMessage: "No creators found",
  hotBadge: "HOT",
  searchResultsSummary: (count, query) =>
    `${count} result${count !== 1 ? "s" : ""} for "${query}"`,
  followersCount: (n) => `${n.toLocaleString()} followers`,
  creationCountFragment: (count, typeLabel) => `${count} ${typeLabel}`,
  searchResultMeta: (followers, aura) =>
    `${followers.toLocaleString()} followers · ${aura.toLocaleString()} aura`,
};

export const mockCreators: CreatorsViewCreator[] = Array.from({ length: 30 }, (_, i) => {
  const tiers: BadgeTier[] = ["immortal", "mythic", "grandmaster", "elite", "legend", "master", "newbie"];
  const tier = tiers[Math.min(Math.floor(i / 4), tiers.length - 1)];
  const names = [
    "Big Daddy", "Luna Eclipse", "Nyx Shadow", "Zara Nova", "Kai Storm",
    "Mira Blaze", "Rex Vortex", "Ivy Frost", "Axel Drift", "Suki Dream",
    "Jett Phoenix", "Aria Moon", "Blaze King", "Nova Star", "Raven Dark",
    "Sage Ember", "Titan Fury", "Cleo Mystic", "Drake Wolf", "Faye Spark",
    "Orion Blaze", "Pearl Dusk", "Quinn Fire", "Roxy Night", "Storm Vale",
    "Uma Glow", "Vera Light", "Wren Sky", "Xena Rise", "Yuki Dawn",
  ];
  const avatars = [creator1, creator2, creator3, creator4, creator5, creator6, creator7, creator8, creator9, creator10];
  return {
    id: i + 1,
    name: names[i],
    avatarUrl: avatars[i % avatars.length],
    tier,
    followers: Math.floor(50000 / (i + 1)) + Math.floor(Math.random() * 500),
    likes: Math.floor(80000 / (i + 1)) + Math.floor(Math.random() * 2000),
    aura: Math.floor(100000 / (i + 1)) + Math.floor(Math.random() * 1000),
    creations: {
      characters: Math.floor(Math.random() * 50) + 1,
      images: Math.floor(Math.random() * 200) + 5,
      videos: Math.floor(Math.random() * 30),
      stories: Math.floor(Math.random() * 40) + 2,
    },
  };
});

const Creators = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <SideNav open={navOpen} onClose={() => setNavOpen(false)} />
      <CreatorsView
        creators={mockCreators}
        labels={creatorsPageLabels}
        onBack={() => navigate(-1)}
        onMenu={() => setNavOpen(true)}
      />
      <CreateFloatingButton />
    </>
  );
};

export default Creators;
