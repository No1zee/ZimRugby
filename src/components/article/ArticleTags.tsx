import Link from "next/link";

interface ArticleTagsProps {
  categories?: string[];
  tags?: string[];
}

export default function ArticleTags({ categories = [], tags = [] }: ArticleTagsProps) {
  // Combine unique tags and categories, filter empty strings
  const combined = Array.from(new Set([...categories, ...tags])).filter(Boolean);

  if (combined.length === 0) return null;

  return (
    <div className="pt-8 border-t border-neutral-200 mt-12 mb-8">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">
        Related Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {combined.map((tag) => (
          <Link
            key={tag}
            href={`/media?category=${encodeURIComponent(tag)}`}
            className="text-[11px] font-black uppercase tracking-wider px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200 hover:border-zru-green hover:text-zru-green hover:bg-neutral-50 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
