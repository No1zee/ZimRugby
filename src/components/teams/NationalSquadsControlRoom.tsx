"use client";

import { useMemo, useCallback } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import type { Team } from "@/types/team";
import TeamRailShell from "./TeamRailShell";
import TeamHero from "./TeamHero";
import HeroInfoDivider from "./HeroInfoDivider";
import TeamInfoGrid from "./TeamInfoGrid";

export default function NationalSquadsControlRoom({
  teams,
}: {
  teams: Team[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = !!useReducedMotion();

  const activeSlug = searchParams.get("team") ?? teams[0].slug;
  const activeTeam = useMemo(
    () => teams.find((t) => t.slug === activeSlug) ?? teams[0],
    [teams, activeSlug]
  );

  const setActiveTeam = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("team", slug);
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  return (
    <section
      aria-label="National Teams"
      className="relative bg-rich-black"
    >
      <div className="pt-40 sm:pt-44 lg:pt-48 pb-4">
        <div className="max-w-[1440px] mx-auto px-0 sm:px-6 lg:px-8">
          <TeamRailShell
            teams={teams}
            activeTeam={activeTeam}
            onSelect={setActiveTeam}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <TeamHero
          key={activeTeam.id}
          team={activeTeam}
          reduceMotion={reduceMotion}
        />
      </AnimatePresence>

      <HeroInfoDivider />

      <AnimatePresence mode="wait" initial={false}>
        <TeamInfoGrid
          key={activeTeam.id}
          team={activeTeam}
          reduceMotion={reduceMotion}
        />
      </AnimatePresence>
    </section>
  );
}
