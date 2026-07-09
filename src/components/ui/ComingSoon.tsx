/**
 * Shared placeholder page for routes that are still under construction.
 * Carries the brand language (crest watermark, green slant accent, Bebas
 * headline) so unfinished routes still feel on-brand.
 */
export default function ComingSoon() {
  return (
    <main className="min-h-screen bg-rich-black flex flex-col relative overflow-hidden">
      {/* Ambient brand layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(3,105,54,0.14),transparent_55%)] pointer-events-none" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/zru logo monotone.svg"
        alt=""
        aria-hidden
        className="absolute -right-16 top-1/2 -translate-y-1/2 h-[110%] w-auto opacity-[0.05] pointer-events-none select-none"
      />

      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-24 px-6 text-center relative z-10">
        <div className="h-1.5 w-24 bg-zru-green clip-slanted-sm mb-8" />
        <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-zru-green mb-6">
          Work in Progress
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 italic">
          COMING <br /> <span className="text-white/40">SOON.</span>
        </h1>
        <p className="text-lg text-gray-400 font-medium max-w-lg">
          This digital experience is currently under construction. Please check
          back later as we continue to build the future of Zimbabwe Rugby.
        </p>
      </div>
    </main>
  );
}
