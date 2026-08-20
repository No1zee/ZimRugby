"use client";

import React from "react";
import NewsCard, { NewsCardProps } from "@/components/media/NewsCard";

export interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  href: string;
}

export default function ArticleCard({
  title,
  excerpt,
  image,
  category,
  date,
  href,
}: ArticleCardProps) {
  return (
    <NewsCard
      title={title}
      excerpt={excerpt}
      image={image}
      category={category}
      date={date}
      slug={href}
      variant="grid"
    />
  );
}
