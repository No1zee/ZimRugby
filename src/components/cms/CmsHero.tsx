"use client";

import PageHero, { PageHeroProps } from "@/components/ui/PageHero";

export type CmsHeroProps = PageHeroProps;

export default function CmsHero(props: CmsHeroProps) {
  return <PageHero {...props} />;
}

