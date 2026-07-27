import { motion } from "framer-motion";
import Image from "next/image";

interface ArchiveFolderCardProps {
  name: string;
  images: string[];
  date: string;
  count: number;
  description?: string;
  onClick: () => void;
}

const LAYERS = [
  { rotate: -8, x: 4, y: 4, hoverX: 24, hoverY: 24 },
  { rotate: 8, x: -4, y: -4, hoverX: -28, hoverY: 8 },
  { rotate: -4, x: 0, y: 0, hoverX: 12, hoverY: -16 },
  { rotate: 0, x: 0, y: 0, hoverX: 0, hoverY: 0 },
];

export default function ArchiveFolderCard({
  name,
  images,
  date,
  count,
  onClick,
}: ArchiveFolderCardProps) {
  const stack = [...images];
  while (stack.length < 4) {
    stack.push(stack[stack.length - 1] || "/images/media/vid1.jpg");
  }
  const displayImages = stack.slice(0, 4);

  return (
    <motion.div
      className="group cursor-pointer flex flex-col items-center"
      onClick={onClick}
      whileHover="hover"
      initial="default"
    >
      <div className="relative w-[240px] h-[300px] sm:w-[280px] sm:h-[360px]">
        {displayImages.map((src, i) => {
          const layer = LAYERS[i];
          return (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: i + 1 }}
              variants={{
                default: { x: layer.x, y: layer.y, rotate: layer.rotate },
                hover: {
                  x: layer.hoverX,
                  y: layer.hoverY,
                  rotate: layer.rotate * 0.4,
                },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative w-[85%] h-[85%] overflow-hidden border-[6px] sm:border-[8px] border-white rounded-[3px] shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
                <Image
                  src={src}
                  alt={`${name} - Photo ${i + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-5 text-center max-w-[280px]">
        <p className="font-heading text-sm sm:text-base font-black text-rich-black leading-tight">
          {name}
        </p>
        <p className="text-[10px] text-rich-black/40 mt-1 uppercase tracking-wider font-body">
          {date} &middot; {count} photos
        </p>
      </div>
    </motion.div>
  );
}
