import { Navigate } from "react-router-dom";
import CinematicHero, { type CinematicHeroLabels } from "../explore/CinematicHero";
import PostCard from "../explore/PostCard";
import { getFunnelVariant, type FunnelAudience, type FunnelMode } from "../../data/funnelVariants";

const heroLabels: CinematicHeroLabels = {
  defaultFeaturedBadge: "Featured",
  storyBadgeLabel: "Story",
  episodeSingular: "episode",
  episodePlural: "episodes",
  chapterSingular: "chapter",
  chapterPlural: "chapters",
  chatsSuffix: "chats",
  featureEyebrowFallback: "New",
  featureChipImage: "Image",
  featureChipVideo: "Video",
  featureChipVoice: "Voice",
  featureChipMusic: "Music",
  defaultPremiumPlanName: "Premium",
};

interface FunnelPageProps {
  audience: FunnelAudience;
  mode: FunnelMode;
}

export default function FunnelPage({ audience, mode }: FunnelPageProps) {
  const variant = getFunnelVariant(audience, mode);
  if (!variant) return <Navigate to="/" replace />;

  return (
    <div className="relative flex min-h-svh w-full flex-col overflow-x-hidden bg-background-v2 font-onest text-foreground-v2">
      <main className="relative flex w-full flex-1 flex-col">
        <div className="sfw">
          <CinematicHero slides={variant.heroSlides} labels={heroLabels} />
        </div>

        <section
          aria-label={variant.sectionTitle}
          className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:px-8"
        >
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground-v2 md:text-3xl">
            {variant.sectionTitle}
          </h1>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
            {variant.characters.map((c) => (
              <div key={c.id} className="[&>a]:!w-full">
                <PostCard
                  name={c.name}
                  description={c.description}
                  imageUrl={c.imageUrl}
                  href={`/chat/${c.id}`}
                  messageCount={c.messageCount}
                  variant="stats"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
