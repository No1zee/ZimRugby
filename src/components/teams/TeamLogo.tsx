import { cn } from "@/lib/utils";

interface TeamLogoProps {
  name: string;
  accent: string;
  jerseyColors: string[];
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { container: 56, font: 14, ring: 2 },
  md: { container: 72, font: 18, ring: 3 },
  lg: { container: 96, font: 24, ring: 3 },
};

function getInitials(name: string): string {
  const words = name.replace(/^ZIMBABWE\s+/i, "").split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function TeamLogo({
  name,
  accent,
  jerseyColors,
  isActive = false,
  size = "md",
}: TeamLogoProps) {
  const s = SIZES[size];
  const initials = getInitials(name);
  const secondary = jerseyColors[1] || "#FFFFFF";

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full flex items-center justify-center transition-[filter] duration-300"
      )}
      style={{
        width: s.container,
        height: s.container,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={s.container}
        height={s.container}
        className="block"
      >
        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke={accent}
          strokeWidth={isActive ? s.ring + 1 : s.ring}
          opacity={isActive ? 1 : 0.5}
        />

        {/* Inner fill */}
        <circle cx="50" cy="50" r="44" fill={accent} />

        {/* Decorative stripe using secondary jersey color */}
        <path
          d="M 50 6 L 94 50 L 50 94 L 6 50 Z"
          fill="none"
          stroke={secondary}
          strokeWidth="1.5"
          opacity="0.25"
        />

        {/* Chevron accent */}
        <path
          d="M 50 20 L 72 50 L 50 80 L 28 50 Z"
          fill="none"
          stroke={secondary}
          strokeWidth="2"
          opacity="0.35"
        />

        {/* Initials */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fill={secondary}
          fontSize={s.font}
          fontWeight="900"
          fontFamily="var(--font-heading), var(--font-body), sans-serif"
          letterSpacing="0.05em"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
