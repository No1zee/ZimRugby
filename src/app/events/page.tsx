import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const EventsClient = dynamic(() => import("./EventsClient"), {
  loading: () => (
    <div className="min-h-screen bg-milk-white flex items-center justify-center text-rich-black">
      <div className="animate-pulse space-y-4 text-center">
        <div className="h-6 w-48 bg-black/5 rounded mx-auto" />
        <div className="h-4 w-80 bg-black/5 rounded mx-auto" />
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Competitions & Events | Zimbabwe Rugby Union",
  description: "Browse domestic rugby competitions, tournaments, and official Zimbabwe Rugby Union events.",
};

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-milk-white flex items-center justify-center text-rich-black">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-6 w-48 bg-black/5 rounded mx-auto" />
          <div className="h-4 w-80 bg-black/5 rounded mx-auto" />
        </div>
      </div>
    }>
      <EventsClient />
    </Suspense>
  );
}
