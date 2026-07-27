export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-[calc(100vh-80px)] animate-page-in"
      style={{
        animationDuration: "0.5s",
        animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  );
}
