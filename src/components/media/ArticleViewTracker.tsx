'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ArticleViewTrackerProps {
  slug: string;
  articleId?: string | number;
  showBadge?: boolean;
  className?: string;
}

export default function ArticleViewTracker({
  slug,
  articleId,
  showBadge = true,
  className = '',
}: ArticleViewTrackerProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    // Fire view tracking POST call once per page view
    const trackView = async () => {
      try {
        const res = await fetch('/api/articles/view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, articleId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (typeof data.views === 'number') {
            setViews(data.views);
          }
        }
      } catch {
        // Silent failure so it never disrupts reader experience
      }
    };

    // Also fetch initial view count if POST didn't return it
    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/articles/view?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.views === 'number') {
            setViews(data.views);
          }
        }
      } catch {
        // Silent
      }
    };

    trackView();
    if (views === null) {
      fetchViews();
    }
  }, [slug, articleId]);

  if (!showBadge) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 shadow-sm backdrop-blur-sm ${className}`}
      title="Article view count"
    >
      <Eye className="w-3.5 h-3.5 text-emerald-400" />
      <span>{views !== null ? views.toLocaleString() : '...'} reads</span>
    </span>
  );
}
