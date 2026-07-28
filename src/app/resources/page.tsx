import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Zimbabwe Rugby Union",
  description: "Rugby resources, guides, and reference materials from ZRU.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-rich-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center pt-12 md:pt-16 pb-12 md:pb-16 px-6 text-center">
        <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-zru-green mb-6">
          Work in Progress
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 italic">
          COMING <br /> <span className="text-white/40">SOON.</span>
        </h1>
        <p className="text-lg text-gray-400 font-normal max-w-lg">
          This digital experience is currently under construction. Please check back later as we continue to build the future of Zimbabwe Rugby.
        </p>
      </div>
    </main>
  );
}