import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignBySlug, getActiveCampaigns } from "@/lib/api/campaigns";
import { heroAssetUrl, photoAssetUrl, assetUrl } from "@/lib/directus/assets";
import { getPlayers } from "@/lib/api/players";
import { getDirectusMatches } from "@/lib/match-centre/api";
import type { Match } from "@/types";
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Users, Trophy, ImageOff } from "lucide-react";

// Next.js 15: params is a Promise — must be awaited
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const campaigns = await getActiveCampaigns();
  return campaigns.map((c) => ({ slug: c.slug }));
}

function CountdownDisplay({ target }: { target: string }) {
  const now = new Date();
  const end = new Date(target);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return (
    <div className="flex items-center gap-6 mt-4">
      {[{ value: days, label: "Days" }, { value: hours, label: "Hrs" }, { value: minutes, label: "Min" }].map(
        ({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-heading font-black text-4xl md:text-5xl text-white leading-none">{value}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mt-1">{label}</div>
          </div>
        )
      )}
    </div>
  );
}

const getCampaignImage = (slug: string, rawImage?: string) => {
  if (rawImage) {
    const url = assetUrl(rawImage, { width: 1200, quality: 85 }, '');
    if (url) return url;
  }
  switch (slug) {
    case 'road-to-australia-2027':
      return '/images/campaign/hero.png';
    case 'africa-cup-tour-2026':
      return '/images/campaign/huddle.png';
    case 'schools-festival-2026':
      return '/images/campaign/youth.png';
    default:
      return '/images/campaign/jersey.png';
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: "Campaign Not Found" };
  return {
    title: `${campaign.name} | Zimbabwe Rugby Union`,
    description: campaign.subtitle || campaign.description || "",
  };
}

export const revalidate = 60;

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const [players, allMatches] = await Promise.all([
    getPlayers().catch(() => []),
    getDirectusMatches().catch(() => []),
  ]);

  const rawRoster = (campaign.players || []).map((cp) => {
    const player = players.find((p) => String(p.id) === String(cp.player_id));
    return { ...cp, player };
  }).sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));

  // Fallback: If campaign has no dedicated roster specified, populate with Sables national squad players
  const roster = rawRoster.length > 0 
    ? rawRoster 
    : players.map((p) => ({
        id: String(p.id),
        player_id: p.id,
        role: p.position || "player",
        is_featured: p.featured || false,
        player: p,
      }));

  const campaignMatchIds = new Set((campaign.matches || []).map((m) => m.match_id));
  const campaignMatches: Match[] = allMatches
    .filter((m) => campaignMatchIds.has(m.id))
    .map((m) => ({
      id: m.id,
      competition: m.competition,
      round: m.round || "Sables",
      date: new Date(m.dateIso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      time: m.time,
      venue: m.venue,
      homeTeam: { name: m.homeTeam.name, score: m.homeTeam.score },
      awayTeam: { name: m.awayTeam.name, score: m.awayTeam.score },
      status: m.status,
      teamCategory: m.teamCategory,
    }));

  const mediaItems = (campaign.media || []).sort((a, b) => a.sort_order - b.sort_order);
  const featuredMedia = mediaItems.filter((m) => m.featured);
  const galleryMedia = mediaItems.filter((m) => m.type === "image" && !m.featured);
  const videoMedia = mediaItems.filter((m) => m.type === "video" || m.type === "reel");

  const isArchived =
    campaign.status === "archived" ||
    (campaign.auto_archive && campaign.end_date && new Date(campaign.end_date) < new Date());

  const hasSquad = roster.length > 0;
  const hasMatches = campaignMatches.length > 0;
  const hasMedia = mediaItems.length > 0;

  return (
    <main className="min-h-screen bg-milk-white">
      {isArchived && (
        <div className="bg-amber-900/90 text-white text-center py-2 text-xs font-black uppercase tracking-wider">
          This campaign has ended.
        </div>
      )}

      <section className="relative bg-rich-black overflow-hidden">
        {campaign.hero_image ? (
          <div className="absolute inset-0">
            <Image
              src={heroAssetUrl(campaign.hero_image) || campaign.hero_image}
              alt={campaign.name}
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rich-black via-rich-black/60 to-rich-black/40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zru-green/80 to-rich-black" />
        )}

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 md:pt-48 pb-12 sm:pb-16">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Campaigns
          </Link>

          <div className="max-w-3xl space-y-4">
            {campaign.subtitle && (
              <span className="inline-block text-zru-green text-xs font-black uppercase tracking-widest">
                {campaign.subtitle}
              </span>
            )}
            <h1 className="text-white font-heading text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="text-white/80 text-base md:text-lg font-body leading-relaxed max-w-2xl">
                {campaign.description}
              </p>
            )}
            {(campaign.start_date || campaign.end_date) && (
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <Calendar className="w-4 h-4" />
                {campaign.start_date && (
                  <span>{new Date(campaign.start_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                )}
                {campaign.end_date && (
                  <>
                    <span className="text-white/30">→</span>
                    <Clock className="w-4 h-4" />
                    <span>{new Date(campaign.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </>
                )}
              </div>
            )}
            {campaign.countdown_target && !isArchived && (
              <CountdownDisplay target={campaign.countdown_target} />
            )}
            {campaign.cta_label && campaign.cta_url && (
              <div className="pt-4">
                <Link
                  href={campaign.cta_url}
                  className="inline-flex items-center gap-2 bg-zru-green text-white font-heading font-black text-sm uppercase tracking-widest px-8 py-4 hover:bg-zru-green/90 transition-colors"
                >
                  {campaign.cta_label}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <section>
          <h2 className="font-heading text-2xl font-black text-rich-black uppercase tracking-wider mb-8 flex items-center gap-3">
            <span className="w-8 h-px bg-zru-green" />
            Squad
          </h2>
          {hasSquad ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {roster.map((entry) => (
                <div key={entry.id} className="relative bg-white rounded-xl border overflow-hidden transition-all duration-300 group">
                  <div className="aspect-[3/4] relative bg-zru-green/10">
                    {entry.player?.photo ? (
                      <Image
                        src={photoAssetUrl(entry.player.photo) || entry.player.photo}
                        alt={entry.player.name || "Player"}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/30 font-heading font-black text-4xl">{entry.player?.name?.charAt(0) || "?"}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-rich-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {entry.is_featured && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-zru-green text-white text-[7px] font-black uppercase tracking-widest rounded">Featured</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-heading font-bold text-rich-black truncate">{entry.player?.name || `Player #${entry.player_id}`}</p>
                    {entry.role && entry.role !== "player" && (
                      <span className="text-[9px] font-black uppercase tracking-wider text-zru-green">{entry.role}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 border border-dashed border-black/10 rounded-xl bg-white text-center gap-3">
              <Users className="w-8 h-8 text-black/20" />
              <p className="text-sm font-heading font-bold text-black/30 uppercase tracking-wider">Squad to be announced</p>
            </div>
          )}
        </section>

        {/* Fixtures */}
        {true && (
          <section>
            <h2 className="font-heading text-2xl font-black text-rich-black uppercase tracking-wider mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-zru-green" />
              Fixtures &amp; Results
            </h2>
            {hasMatches ? (
            <div className="space-y-3">
              {campaignMatches.map((match) => (
                <div key={match.id} className="bg-white border border-black/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zru-green/30 transition-colors">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-zru-green">
                      <span>{match.competition}</span>
                      {match.round && <span>&bull; {match.round}</span>}
                    </div>
                    <div className="font-heading font-bold text-base text-rich-black">{match.homeTeam?.name} vs {match.awayTeam?.name}</div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-black/50 font-bold uppercase tracking-wider">
                      {match.venue && (
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{match.venue}</span>
                      )}
                      {match.date && (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{match.date}</span>
                      )}
                      {match.time && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{match.time}</span>
                      )}
                    </div>
                  </div>
                  {match.status === "completed" && match.homeTeam?.score !== undefined && (
                    <div className="text-right shrink-0">
                      <div className="font-heading font-black text-2xl text-rich-black">{match.homeTeam.score} - {match.awayTeam?.score}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-black/10 rounded-xl bg-white text-center gap-3">
                <Trophy className="w-8 h-8 text-black/20" />
                <p className="text-sm font-heading font-bold text-black/30 uppercase tracking-wider">Fixtures to be announced</p>
                <Link href="/match-centre" className="text-xs font-black uppercase tracking-wider text-zru-green hover:underline">View all fixtures →</Link>
              </div>
            )}
          </section>
        )}

        {/* Gallery */}
        {true && (
          <section>
            <h2 className="font-heading text-2xl font-black text-rich-black uppercase tracking-wider mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-zru-green" />
              Gallery
            </h2>
            {hasMedia ? (
              <>
                {featuredMedia.length > 0 && featuredMedia.map((item) => (
                  <div key={item.id} className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-zru-green/10 mb-6">
                    {item.media_asset_id && (
                      <Image src={heroAssetUrl(item.media_asset_id) || item.media_asset_id} alt={item.label || "Campaign media"} fill className="object-cover" />
                    )}
                    {item.label && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rich-black/80 to-transparent p-6">
                        <p className="text-white font-heading font-bold text-lg">{item.label}</p>
                      </div>
                    )}
                  </div>
                ))}
                {galleryMedia.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryMedia.map((item) => (
                      <div key={item.id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zru-green/10 group">
                        {item.media_asset_id && (
                          <Image src={photoAssetUrl(item.media_asset_id) || item.media_asset_id} alt={item.label || "Gallery image"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        {item.label && (
                          <div className="absolute inset-0 bg-rich-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-white text-xs font-bold">{item.label}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {videoMedia.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoMedia.map((item) => (
                      <div key={item.id} className="aspect-video rounded-xl overflow-hidden bg-rich-black flex items-center justify-center">
                        <div className="text-center text-white/40">
                          <p className="font-heading font-bold">{item.label || "Video"}</p>
                          <span className="text-[10px] uppercase tracking-wider">{item.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-black/10 rounded-xl bg-white text-center gap-3">
                <ImageOff className="w-8 h-8 text-black/20" />
                <p className="text-sm font-heading font-bold text-black/30 uppercase tracking-wider">No media uploaded yet</p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
