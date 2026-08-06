import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import PlayRugbyClient from "./PlayRugbyClient";

export const metadata: Metadata = {
  title: "Play Rugby | Zimbabwe Rugby Union",
  description: "Find a club, join a programme, or start playing rugby in Zimbabwe.",
};

export const dynamic = "force-dynamic";

export default async function PlayRugbyPage() {
  const cmsPage = await getPageBySlug("play-rugby");

  return <PlayRugbyClient cmsPage={cmsPage} />;
}
