interface ArticleBodyProps {
  html: string;
  dek?: string | null;
}

export default function ArticleBody({ html, dek }: ArticleBodyProps) {
  return (
    <div className="space-y-8">
      {/* Dek / lead paragraph — only if present and not duplicating body */}
      {dek && (
        <p className="text-xl md:text-2xl font-normal text-neutral-600 leading-relaxed">
          {dek}
        </p>
      )}

      {/* Article body prose */}
      <div
        className={[
          "prose prose-lg prose-neutral max-w-none",
          // Headings
          "prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-neutral-900",
          "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
          "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
          // Body text
          "prose-p:text-neutral-700 prose-p:leading-relaxed prose-p:text-[1.0625rem]",
          // Strong / em
          "prose-strong:text-neutral-900 prose-strong:font-bold",
          "prose-em:text-neutral-600",
          // Links
          "prose-a:text-zru-green prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
          // Lists — squad lists are <ol>, bullet points are <ul>
          "prose-ol:text-neutral-700 prose-ol:space-y-1",
          "prose-ul:text-neutral-700 prose-ul:space-y-1",
          "prose-li:marker:text-zru-green",
          // Tables (fixture tables from Elementor)
          "prose-table:text-sm prose-table:border-collapse",
          "prose-th:bg-neutral-100 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-black prose-th:uppercase prose-th:tracking-wider prose-th:text-[11px] prose-th:text-neutral-900",
          "prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-neutral-200 prose-td:text-neutral-700",
          // Images inside body (from zru.co.zw CDN)
          "prose-img:rounded-xl prose-img:w-full prose-img:object-cover prose-img:my-8",
          // Blockquotes
          "prose-blockquote:border-l-4 prose-blockquote:border-zru-green prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-neutral-600 prose-blockquote:not-italic",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
