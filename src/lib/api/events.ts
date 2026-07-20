import { directusFetch } from "@/lib/directus/fetch";

export interface EventItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  location: string;
  description: string;
  tags: string[];
  image: string;
  content?: string;
  ticketUrl?: string;
}

const mockEvents: EventItem[] = [
  {
    id: "1",
    title: "SUPER SIX RUGBY LEAGUE",
    subtitle: "PREMIER CLUB COMPETITION",
    date: "May – Sep 2026",
    location: "Harare Sports Club & Hartsfield Bulawayo",
    description: "Zimbabwe's top clubs including Old Hararians, Old Georgians, and Old Miltonians battle for supremacy.",
    tags: ["Premier League", "Club Rugby"],
    image: "/images/events/super-league.jpg",
    content: "The Super Six Rugby League represents the absolute pinnacle of domestic club rugby in Zimbabwe. Spanning over five months, six elite clubs compete home-and-away for the ultimate crown and a direct slot in regional cross-border qualifiers.\n\nFans can expect intense matches every Saturday, showcasing the best local talent and seasoned Sables veterans alike. Gates open at 11:00 AM CAT, with supporting matches from women's and junior sections kickoff at 12:00 PM.",
    ticketUrl: "/tickets"
  },
  {
    id: "2",
    title: "SABLE LAGER GRID CUP",
    subtitle: "FRANCHISE RUGBY",
    date: "Oct – Nov 2026",
    location: "Harare Sports Club",
    description: "The new franchise-style format boosting excitement and participation in the local scene.",
    tags: ["Franchise", "Sable Lager"],
    image: "/images/media/vid1.jpg",
    content: "The Sable Lager Grid Cup introduces an explosive franchise-model tournament designed to bridge club and international rugby. Four newly-formed provincial franchises draft the best talent from across the country, matching them with elite coaching staffs in a high-octane 4-week tournament.\n\nSponsored by Sable Lager, this cup delivers unmatched fan activations, high-scoring matches, and a direct selection pathway for Sables coaching staff.",
    ticketUrl: "/tickets"
  },
  {
    id: "3",
    title: "NEDBANK CHALLENGE CUP",
    subtitle: "KNOCKOUT TOURNAMENT",
    date: "Mar 2027",
    location: "Old Hararians Sports Club",
    description: "The 5th edition of the prominent knockout tournament highlighting provincial and club talent.",
    tags: ["Knockout", "Nedbank"],
    image: "/images/events/schools-fest.jpg",
    content: "The Nedbank Challenge Cup returns for its highly anticipated 5th edition, presenting an all-or-nothing knockout tournament. Featuring a mix of club giants, provincial selections, and rising development teams, it's the ultimate cup of upsets and breakthrough stories.\n\nThrough Nedbank's generous sponsorship, prize pools have been doubled, and live broadcast options are available for fans worldwide.",
    ticketUrl: "/tickets"
  },
  {
    id: "4",
    title: "HARARE UNDER-20 LEAGUE",
    subtitle: "YOUTH DEVELOPMENT",
    date: "Jan 2027",
    location: "Old Hararians Sports Club",
    description: "Future stars in action at the Harare Under-20 League, kicking off in January.",
    tags: ["Youth", "U20 League"],
    image: "/images/events/schools-fest.jpg",
    content: "The Harare Under-20 League is the premier proving ground for young talent aiming for the Junior Sables. Featuring clubs and academy selections, this high-tempo league highlights raw athletic pace and creative playmaking.\n\nCome down to OH on Saturday mornings to watch the future champions of Zimbabwean rugby make their mark.",
    ticketUrl: "/tickets"
  }
];

export async function getEvents(): Promise<EventItem[]> {
  try {
    if (process.env.NEXT_PUBLIC_DIRECTUS_URL) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await directusFetch<any[]>('events', {
        sort: ['date']
      });
      if (response && response.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return response.map((item: any) => {
          let parsedTags: string[] = [];
          if (Array.isArray(item.tags)) {
            parsedTags = item.tags;
          } else if (typeof item.tags === "string") {
            try {
              if (item.tags.startsWith("[")) {
                parsedTags = JSON.parse(item.tags);
              } else {
                parsedTags = item.tags.split(",").map((s: string) => s.trim());
              }
            } catch {
              parsedTags = [item.tags];
            }
          }

          return {
            id: String(item.id),
            title: item.title || "",
            subtitle: item.subtitle || "",
            date: item.date_label || (item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : ""),
            location: item.location || "",
            description: item.description || "",
            tags: parsedTags,
            image: item.image ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.image}` : (item.image_url || "/images/events/super-league.jpg"),
            content: item.content || "",
            ticketUrl: item.ticket_url || "/tickets"
          };
        });
      }
    }
  } catch (error) {
    console.warn("Directus fetch failed for events list, falling back to mock data:", error);
  }

  return mockEvents;
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const allEvents = await getEvents();
  return allEvents.find(e => e.id === id) || null;
}
