"use client";

import { X, Type, Image, List, HelpCircle, ArrowRight, BarChart3, Users, Target, Eye, Mail, GraduationCap, MapPin, Search, Megaphone, Newspaper, Trophy, Sprout, Send, Handshake, Layers } from "lucide-react";

const SECTION_TEMPLATES = [
  {
    key: "overview",
    label: "Overview",
    description: "Title + body text block with optional stats",
    icon: Type,
    defaults: { title: "Overview", body: "Add your content here." },
  },
  {
    key: "hero_image",
    label: "Hero Image",
    description: "Full-width image with text overlay",
    icon: Image,
    defaults: { title: "Hero Section", body: "Describe this section.", image: "" },
  },
  {
    key: "stats",
    label: "Statistics",
    description: "Numbered stats or key figures",
    icon: BarChart3,
    defaults: {
      title: "Key Numbers",
      items: [
        { label: "Stat 1", value: "0" },
        { label: "Stat 2", value: "0" },
        { label: "Stat 3", value: "0" },
      ],
    },
  },
  {
    key: "benefits",
    label: "Benefits List",
    description: "List of benefits or features",
    icon: List,
    defaults: {
      title: "Benefits",
      items: [
        { title: "Benefit 1", description: "Description" },
        { title: "Benefit 2", description: "Description" },
      ],
    },
  },
  {
    key: "faq",
    label: "FAQ",
    description: "Frequently asked questions accordion",
    icon: HelpCircle,
    defaults: {
      title: "FAQ",
      items: [
        { question: "Question 1?", answer: "Answer here." },
        { question: "Question 2?", answer: "Answer here." },
      ],
    },
  },
  {
    key: "cta",
    label: "Call to Action",
    description: "Button with message",
    icon: ArrowRight,
    defaults: { title: "Ready to Get Started?", body: "Take the next step.", cta_label: "Learn More", cta_url: "/" },
  },
  {
    key: "team_list",
    label: "Team/Club List",
    description: "List of teams or clubs",
    icon: Users,
    defaults: {
      title: "Our Teams",
      items: [
        { name: "Team 1", location: "City", slug: "team-1", category: "Senior" },
        { name: "Team 2", location: "City", slug: "team-2", category: "Senior" },
      ],
    },
  },
  {
    key: "mission",
    label: "Mission Statement",
    description: "Organisation mission (pairs with Vision)",
    icon: Target,
    defaults: { title: "OUR MISSION", content: "Describe your mission here." },
  },
  {
    key: "vision",
    label: "Vision Statement",
    description: "Organisation vision (pairs with Mission)",
    icon: Eye,
    defaults: { title: "OUR VISION", content: "Describe your vision here." },
  },
  {
    key: "contact",
    label: "Contact Info",
    description: "Email, phone, address cards",
    icon: Mail,
    defaults: {
      title: "Contact & Enquiries",
      items: [
        { label: "Email", value: "info@zimbabwerugby.co.zw" },
        { label: "Phone", value: "+263 (24) 275 1234" },
        { label: "Address", value: "National Sports Stadium, Harare" },
      ],
    },
  },
  {
    key: "programmes",
    label: "Programmes Grid",
    description: "Grid of programmes with icons and links",
    icon: GraduationCap,
    defaults: {
      title: "Find Your Path",
      items: [
        { title: "Programme 1", description: "Description", link: "/clubs", icon: "MapPin" },
        { title: "Programme 2", description: "Description", link: "/schools", icon: "GraduationCap" },
      ],
    },
  },
  {
    key: "clubs",
    label: "Club Finder",
    description: "Searchable club list with locations",
    icon: Search,
    defaults: {
      title: "Find a Club",
      content: "Join one of our registered clubs near you.",
      items: [
        { name: "Club Name", location: "City", league: "Super League" },
      ],
    },
  },
  {
    key: "development_pathways",
    label: "Development Pathways",
    description: "Dark CTA banner for development pipeline",
    icon: GraduationCap,
    defaults: {
      eyebrow: "Development & Pathways",
      body: "From Schoolboy Leagues to National Caps",
      content: "From premier high school competitions to provincial leagues, follow the talent pipeline driving Zimbabwean players onto the international stage.",
    },
  },
  // ────── Homepage-Specific Section Types ──────
  {
    key: "hero_carousel",
    label: "Hero Carousel",
    description: "Multi-slide hero with auto-rotation (Home only)",
    icon: Layers,
    defaults: { title: "Hero Carousel" },
    homeOnly: true,
  },
  {
    key: "announcements",
    label: "Pinned Announcements",
    description: "Media-managed event/announcement strip",
    icon: Megaphone,
    defaults: { title: "Announcements" },
  },
  {
    key: "hub_grid",
    label: "Hub Grid",
    description: "4-column grid: Match + News + Shop + Tickets",
    icon: Newspaper,
    defaults: { title: "Hub Grid" },
    homeOnly: true,
  },
  {
    key: "campaign_highlight",
    label: "Campaign Highlight",
    description: "Road to World Cup — countdown + video + players",
    icon: Trophy,
    defaults: { title: "Road to World Cup" },
  },
  {
    key: "grassroots",
    label: "Grassroots Initiative",
    description: "Growing the sport — community & development",
    icon: Sprout,
    defaults: { title: "Grassroots & Growing the Sport" },
  },
  {
    key: "newsletter_cta",
    label: "Newsletter Banner",
    description: "Email signup call-to-action strip",
    icon: Send,
    defaults: { title: "Stay in the Loop", body: "Subscribe to the official ZRU newsletter." },
  },
  {
    key: "sponsors_grid",
    label: "Sponsors & Partners",
    description: "Logo grid of commercial partners",
    icon: Handshake,
    defaults: { title: "Our Partners" },
  },
  // ────── End Homepage-Specific ──────
  {
    key: "custom",
    label: "Custom Section",
    description: "Blank section for unique content",
    icon: Type,
    defaults: { title: "New Section", body: "" },
  },
];

export default function AddSectionModal({
  onAdd,
  onClose,
  pageSlug,
}: {
  onAdd: (data: any) => void;
  onClose: () => void;
  pageSlug: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#002D1A] border border-white/10 rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
        {/* Green accent at top */}
        <div className="h-1 bg-gradient-to-r from-[#006B3F] via-[#00A85A] to-[#006B3F]" />
        
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-white font-heading text-sm uppercase tracking-wider">Add Section</h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {SECTION_TEMPLATES.map((template) => (
            <button
              key={template.key}
              onClick={() => {
                onAdd({
                  section_key: template.key,
                  ...template.defaults,
                  status: "draft",
                });
                onClose();
              }}
              className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#006B3F]/50 hover:bg-[#006B3F]/10 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-[#006B3F]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#006B3F]/20 transition-colors">
                <template.icon className="w-5 h-5 text-[#00A85A]" />
              </div>
              <div>
                <div className="text-white text-sm font-bold group-hover:text-[#00A85A] transition-colors">{template.label}</div>
                <div className="text-white/30 text-[10px] font-subheading uppercase tracking-widest mt-0.5">{template.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
