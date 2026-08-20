import type { Metadata } from "next";
import { getReportById, getLatestReports } from "@/lib/data-fetcher";
import { notFound } from "next/navigation";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleByline from "@/components/article/ArticleByline";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleTags from "@/components/article/ArticleTags";
import RelatedArticles from "@/components/article/RelatedArticles";
import { sanitizeArticleHtml, extractDek } from "@/lib/article-sanitizer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const reports = await getLatestReports();
  return reports.map((r) => ({
    slug: r.id
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReportById(slug);
  if (!report) return {};
  return {
    title: `${report.title} | Zimbabwe Rugby Union`,
    description: report.excerpt,
    openGraph: {
      title: report.title,
      description: report.excerpt,
      images: [{ url: report.image }]
    }
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { slug } = await params;
  const report = await getReportById(slug);
  
  if (!report) {
    notFound();
  }

  const reports = await getLatestReports();
  const relatedReports = reports
    .filter(r => r.id !== report.id)
    .slice(0, 3);

  const rawBody = report.content ?? "";
  const cleanedHtml = sanitizeArticleHtml(rawBody, report.title);
  
  const readingMinutes = Math.max(
    1,
    Math.round(rawBody.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200)
  );

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": report.title,
    "description": report.excerpt,
    "image": [report.image],
    "datePublished": report.date,
    "dateModified": report.date,
    "author": [{
      "@type": "Organization",
      "name": "Zimbabwe Rugby Union",
      "url": "https://zimrugby.vercel.app"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Zimbabwe Rugby Union",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zimrugby.vercel.app/images/logo/zru-logo.png"
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-zru-green selection:text-white">
      {/* Schema.org NewsArticle Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* 1. Dark Compact Hero Header */}
      <ArticleHero
        title={report.title}
        image={report.image}
        category={report.category}
        date={report.date}
        readingMinutes={readingMinutes}
      />

      {/* 2. Main Article Content Container (Clean White/Off-White Editorial Space) */}
      <article className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Byline & Sharing Options */}
        <ArticleByline
          date={report.date}
          readingMinutes={readingMinutes}
          articleTitle={report.title}
          articleUrl={report.url}
        />

        {/* Core Article Body with Typography Tokens */}
        <ArticleBody
          html={cleanedHtml}
        />

        {/* Dynamic Tags and Categories */}
        <ArticleTags
          categories={report.categories || [report.category]}
        />
      </article>

      {/* 3. Keep Reading Section (Warm Off-White Footer Cards) */}
      <RelatedArticles items={relatedReports} />
    </main>
  );
}