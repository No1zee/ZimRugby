import { Metadata } from "next";
import { getPageBySlug } from "@/lib/api/pages";
import FanZoneClient from "./FanZoneClient";

export const metadata: Metadata = {
  title: "Fan Zone | Zimbabwe Rugby Union",
  description: "Join the official Zimbabwe Rugby supporters network. Get exclusive content, priority access, and connect with fans worldwide.",
};

export default async function FanZonePage() {
  const cmsPage = await getPageBySlug("fan-zone");
  return <FanZoneClient cmsPage={cmsPage} />;
}
