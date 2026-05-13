import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X, Clock, Calendar, Trophy, FileText, Sparkles, ChevronDown, ChevronUp, Flame } from "lucide-react";
import SideNav from "../components/SideNav";
import ExploreVideoCard from "../components/explore/ExploreVideoCard";
import { exploreVideoFeed } from "../data/exploreVideoFeed";

// Reuse the same event data shape as ExploreKling. Kept inline to avoid
// extracting a shared module just for this prototype.
const eventsData = [
  {
    id: "stadium-broadcast",
    title: "Kreate Contest #52: Stadium Broadcast Challenge",
    subtitle: "Recreate the big screen live moments with Kling AI!",
    duration: "2026/05/12 00:30:00 ~ 2026/05/26 23:59:59 (UTC-8)",
    deadline: "13 days and 19 hours before deadline",
    prize: "Credits",
    submissionCount: 4679,
    image: "https://picsum.photos/seed/event-1/1600/600",
  },
  {
    id: "nextgen-2026",
    title: "KlingAI NEXTGEN 2026 University Creator Challenge",
    subtitle: "Your creation lights up the future",
    duration: "2026/05/01 00:00:00 ~ 2026/06/10 23:59:59 (UTC-8)",
    deadline: "28 days and 7 hours before deadline",
    prize: "Prize Pool $10,000",
    submissionCount: 1284,
    image: "https://picsum.photos/seed/event-2/1600/600",
  },
  {
    id: "frames-of-her-love",
    title: "Holiday Sparks #9: Frames of Her Love",
    subtitle: "Reimagine your cherished memories with Kling AI!",
    duration: "2026/05/10 00:00:00 ~ 2026/06/06 23:59:59 (UTC-8)",
    deadline: "24 days and 22 hours before deadline",
    prize: "Credits",
    submissionCount: 312,
    image: "https://picsum.photos/seed/event-3/1600/600",
  },
  {
    id: "fashion-spotlight",
    title: "Kreate Contest #51: Fashion Spotlight Challenge",
    subtitle: "Redefining Fashion with Kling AI!",
    duration: "2026/04/22 00:00:00 ~ 2026/06/03 23:59:59 (UTC-8)",
    deadline: "21 days and 22 hours before deadline",
    prize: "Credits",
    submissionCount: 892,
    image: "https://picsum.photos/seed/event-4/1600/600",
  },
];

type SubmissionTab = "Submitted" | "Winners";
type SubmissionSort = "Latest" | "Hottest";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<SubmissionTab>("Submitted");
  const [sort, setSort] = useState<SubmissionSort>("Hottest");

  const event = useMemo(
    () => eventsData.find((e) => e.id === id) ?? eventsData[0],
    [id]
  );

  // Mock submissions — reuse the existing video feed.
  const submissions = exploreVideoFeed.slice(0, 18);

  return (
    <>
      <SideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative flex min-h-svh w-full bg-background-v2 font-onest text-foreground-v2">
        <main className="relative flex w-full flex-1 flex-col">
          {/* Close button */}
          <div className="fixed left-4 top-4 z-30">
            <button
              onClick={() => navigate("/explore")}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-background-v2/70 text-foreground-v2 backdrop-blur-md hover:bg-background-v2/90"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Hero banner */}
          <section className="relative w-full">
            <div className="relative h-[260px] w-full overflow-hidden md:h-[360px]">
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-v2 via-background-v2/40 to-background-v2/20" />
            </div>
          </section>

          <div className="mx-auto w-full max-w-5xl px-4 pb-24 md:px-8">
            {/* Header info */}
            <header className="-mt-10 flex flex-col gap-4">
              <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-grey-light-3-v2">
                <span className="font-medium text-foreground-v2/80">Event Duration</span>
                <span>{event.duration}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-grey-dark-2-v2 px-3 py-1.5 text-xs font-medium text-grey-light-2-v2">
                  <Clock className="h-3.5 w-3.5" />
                  {event.deadline}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-grey-dark-2-v2 px-3 py-1.5 text-xs font-medium text-grey-light-2-v2">
                  <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                  {event.prize}
                </span>
              </div>
            </header>

            {/* Description card */}
            <article
              className={`relative mt-6 overflow-hidden rounded-2xl border border-white/5 bg-grey-dark-1-v2 p-5 md:p-6 ${
                expanded ? "" : "max-h-[420px]"
              }`}
            >
              <Section
                icon={<Calendar className="h-4 w-4 text-primary-v2" />}
                title="Timeline (Pacific Time, UTC-8)"
              >
                <ul className="ml-5 list-disc space-y-1 marker:text-grey-light-3-v2">
                  <li>Submission: May 12, 2026 - May 26, 2026</li>
                  <li>
                    Winner Announcement: June 9, 2026
                    <ul className="ml-5 mt-1 list-[circle] space-y-1 marker:text-grey-light-3-v2">
                      <li>Credits Rewards: Issued shortly after the announcement</li>
                      <li>Cash Rewards: Distributed within two months after the announcement</li>
                    </ul>
                  </li>
                </ul>
              </Section>

              <Section
                icon={<FileText className="h-4 w-4 text-primary-v2" />}
                title="Requirements"
              >
                <ul className="ml-5 list-disc space-y-1.5 marker:text-grey-light-3-v2">
                  <li>
                    🎬 We're calling all fans to join the {event.title.split(":")[1]?.trim() ?? "Challenge"} and become the center of the spotlight! Show us your most creative, hilarious or passionate AI moments.
                  </li>
                  <li>
                    We recommend exploring the following directions to showcase the full creative potential:
                    <ul className="ml-5 mt-1 list-[circle] space-y-1 marker:text-grey-light-3-v2">
                      <li>Tutorials: Share your tips and tricks for using the effect.</li>
                      <li>Reactions: Generate moments featuring funny gestures and expressive facial reactions.</li>
                    </ul>
                  </li>
                  <li>The content must be primarily generated using our tools.</li>
                  <li>Showcase the full range of capabilities — eye-catching outcomes win.</li>
                  <li>📐 Short films: no aspect ratio restrictions, but 720p or higher resolution required.</li>
                </ul>
              </Section>

              <Section
                icon={<Sparkles className="h-4 w-4 text-primary-v2" />}
                title="How to Participate"
              >
                <ul className="ml-5 list-disc space-y-1 marker:text-grey-light-3-v2">
                  <li>Click "Submit" in the bottom-left corner of the event page.</li>
                  <li>Add a clear title and description for your submission.</li>
                  <li>Make sure your work was generated with our platform.</li>
                </ul>
              </Section>

              <Section
                icon={<Trophy className="h-4 w-4 text-primary-v2" />}
                title="Prizes"
              >
                <ul className="ml-5 list-disc space-y-1 marker:text-grey-light-3-v2">
                  <li>1st place: 10,000 credits + featured spotlight</li>
                  <li>2nd place: 5,000 credits</li>
                  <li>3rd place: 2,500 credits</li>
                  <li>Honorable mentions: 500 credits each</li>
                </ul>
              </Section>

              {!expanded && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-grey-dark-1-v2 to-transparent" />
              )}
            </article>

            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-grey-dark-2-v2 px-4 py-2 text-sm font-medium text-foreground-v2 hover:bg-grey-dark-1-v2"
              >
                {expanded ? "Less" : "More"}
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Submissions */}
            <section className="mt-12">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  All Submissions{" "}
                  <span className="text-grey-light-3-v2">
                    ({event.submissionCount.toLocaleString()})
                  </span>
                </h2>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                {/* Tabs */}
                <div className="inline-flex rounded-full border border-white/10 bg-grey-dark-2-v2 p-1">
                  {(["Submitted", "Winners"] as SubmissionTab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        activeTab === t
                          ? "bg-foreground-v2 text-background-v2"
                          : "text-grey-light-3-v2 hover:text-foreground-v2"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-4 text-sm">
                  {(["Latest", "Hottest"] as SubmissionSort[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={`inline-flex items-center gap-1.5 transition-colors ${
                        sort === s
                          ? "font-semibold text-foreground-v2"
                          : "text-grey-light-3-v2 hover:text-foreground-v2"
                      }`}
                    >
                      {s === "Hottest" && <Flame className="h-3.5 w-3.5 text-orange-400" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {submissions.map((v) => (
                  <ExploreVideoCard
                    key={v.id}
                    poster={v.poster}
                    video={v.video}
                    imageAlt={`Submission ${v.id}`}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-5 last:mb-0">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground-v2">
      {icon}
      {title}
    </div>
    <div className="text-sm leading-relaxed text-grey-light-2-v2">{children}</div>
  </div>
);

export default EventDetail;
