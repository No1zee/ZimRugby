"use client";

import Link from "next/link";
import Image from "next/image";
import TeamLogo from "./TeamLogo";

export interface TeamInfo {
  slug: string;
  name: string;
  shortName: string;
  image: string;
  accent: string;
  jerseyColors: string[];
}

const TEAMS_DATA: TeamInfo[] = [
  {
    slug: "sables",
    name: "Zimbabwe Sables",
    shortName: "SABLES",
    image: "/images/gallery/zimbabwe-sables-battle-of-zambezi-gameday1-505.webp",
    accent: "#006747",
    jerseyColors: ["#006747", "#D4A843"],
  },
  {
    slug: "lady-sables",
    name: "Lady Sables",
    shortName: "LADY SABLES",
    image: "/images/hero/lady-sables.webp",
    accent: "#00C88C",
    jerseyColors: ["#006747", "#FFFFFF"],
  },
  {
    slug: "cheetahs",
    name: "Zimbabwe Cheetahs",
    shortName: "CHEETAHS",
    image: "/images/teams/cheetahs.jpg",
    accent: "#00704D",
    jerseyColors: ["#006747", "#D4A843"],
  },
  {
    slug: "junior-sables",
    name: "Junior Sables (U20)",
    shortName: "JR SABLES",
    image: "/images/hero/zim-u20s.webp",
    accent: "#00452A",
    jerseyColors: ["#006747", "#FFFFFF"],
  },
];

interface TeamCardBentoProps {
  teams?: TeamInfo[];
}

export default function TeamCardBento({ teams }: TeamCardBentoProps) {
  const displayTeams = teams && teams.length > 0 ? teams : TEAMS_DATA;

  return (
    <section className="py-20 bg-milk-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-rich-black not-italic">
              OUR NATIONAL TEAMS
            </h2>
            <p className="text-rich-black/70 text-base font-body leading-relaxed">
              From the Sables on the World Cup trail to the Cheetahs on the sevens circuit, meet the national squads wearing the shirt for Zimbabwe.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayTeams.map((team) => (
            <Link
              key={team.slug}
              href={`/teams/${team.slug}`}
              className="group relative rounded-3xl overflow-hidden h-[400px] sm:h-[480px] flex items-end shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              {/* Background Image */}
              <Image
                src={team.image}
                alt={team.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content — Logo + Name only */}
              <div className="relative z-10 w-full p-8 sm:p-10 flex items-center gap-5">
                <div className="shrink-0">
                  <TeamLogo
                    name={team.shortName}
                    accent={team.accent}
                    jerseyColors={team.jerseyColors}
                    size="lg"
                  />
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-wide leading-none not-italic text-white">
                  {team.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
