import { useParams, Link, Navigate } from "react-router-dom";
import CinematicHero, { type CinematicHeroLabels } from "../components/explore/CinematicHero";
import PostCard from "../components/explore/PostCard";
import { getFunnelVariant } from "../data/funnelVariants";

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

const ExpFunnel = () => {
  const { audience = "", mode = "" } = useParams<{ audience: string; mode: string }>();
  const variant = getFunnelVariant(audience, mode);

  if (!variant) return <Navigate to="/" replace />;

  return (
    <div className="relative flex min-h-svh w-full flex-col overflow-x-hidden bg-background-v2 font-onest text-foreground-v2">
      <main className="relative flex w-full flex-1 flex-col">
        {/* Cinematic hero (full-bleed) */}
        <div className="sfw">
          <CinematicHero slides={variant.heroSlides} labels={heroLabels} />
        </div>

        {/* Characters grid */}
        <section
          aria-label={variant.sectionTitle}
          className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-8 md:px-8"
        >
          <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground-v2 md:text-3xl">
            {variant.sectionTitle}
          </h1>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
            {variant.characters.map((c) => (
              <Link
                key={c.id}
                to={`/chat/${c.id}`}
                className="block w-full"
                aria-label={`Chat with ${c.name}`}
              >
                <div className="w-full [&>a]:!w-full">
                  <PostCard
                    name={c.name}
                    description={c.description}
                    imageUrl={c.imageUrl}
                    href={`/chat/${c.id}`}
                    messageCount={c.messageCount}
                    variant="stats"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExpFunnel;
