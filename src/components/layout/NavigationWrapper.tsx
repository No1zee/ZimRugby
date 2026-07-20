"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function NavigationWrapper() {
  const pathname = usePathname();
  const isClubhouse = pathname.startsWith("/about/clubhouse");

  if (isClubhouse) return null;

  return <Navigation />;
}
