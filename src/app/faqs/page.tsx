import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Zimbabwe Rugby Union",
  description: "Answers to common questions about Zimbabwe Rugby Union, tickets, memberships, and more.",
};

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-rich-black flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center pt-36 pb-24 px-6 text-center">
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