'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EditorialWorkspace, { EditorialArticle } from './EditorialWorkspace';
import { useToast } from '../ui/ToastProvider';

interface NewsMasterDetailPanelProps {
  initialNews?: any[];
  currentUserEmail?: string;
  currentUser?: { name?: string; email?: string; role?: string };
  canPublish?: boolean;
  focusId?: string | number | null;
}

export function NewsMasterDetailPanel({ 
  initialNews = [], 
  currentUserEmail, 
  currentUser, 
  canPublish = true,
  focusId 
}: NewsMasterDetailPanelProps) {
  const { toast } = useToast();
  const [articles, setArticles] = useState<EditorialArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Map initial news items
  const mapItem = (item: any): EditorialArticle => ({
    id: item.id,
    title: item.title || '',
    slug: item.slug || '',
    summary: item.summary || '',
    content: item.content || '',
    category: item.category || 'General',
    status: item.status || 'draft',
    date: item.date || item.date_created?.split('T')[0] || '',
    date_created: item.date_created,
    date_updated: item.date_updated,
    image: item.image || '',
    hero_image_caption: item.hero_image_caption || '',
    hero_image_alt: item.hero_image_alt || '',
    photographer_credit: item.photographer_credit || '',
    photographer_licence: item.photographer_licence || 'ZRU Official Rights',
    is_hero_slider: item.is_hero_slider || false,
    author: item.author || 'ZRU Media Team',
    tags: item.tags || [],
    meta_description: item.meta_description || ''
  });

  useEffect(() => {
    if (initialNews && initialNews.length > 0) {
      setArticles(initialNews.map(mapItem));
    } else {
      fetchArticles();
    }
  }, [initialNews]);

  // Fetch news articles from Directus Admin API
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/directus?collection=news&limit=100&sort=-date');
      if (res.ok) {
        const json = await res.json();
        const data = json.data || [];
        setArticles(data.map(mapItem));
      }
    } catch (err) {
      console.error('Failed to load articles for newsroom workspace', err);
      toast('Could not load articles from CMS.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSaveArticle = async (article: EditorialArticle, isPublish: boolean) => {
    try {
      const isNew = !article.id;
      const method = isNew ? 'POST' : 'PATCH';
      
      const payload: any = {
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        content: article.content,
        category: article.category,
        status: isPublish ? 'published' : (article.status || 'draft'),
        date: article.date,
        image: article.image,
        hero_image_caption: article.hero_image_caption,
        hero_image_alt: article.hero_image_alt,
        photographer_credit: article.photographer_credit,
        photographer_licence: article.photographer_licence,
        is_hero_slider: article.is_hero_slider,
        author: article.author || currentUserEmail || currentUser?.email || 'ZRU Media Team',
        tags: Array.isArray(article.tags) ? article.tags : (article.tags ? [article.tags] : []),
        meta_description: article.meta_description
      };

      if (!isNew) {
        payload.id = article.id;
      }

      const res = await fetch('/api/admin/directus?collection=news', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `HTTP ${res.status}`);
      }

      const result = await res.json();
      return { success: true, data: result.data || result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleDeleteArticle = async (id: string | number) => {
    try {
      const res = await fetch('/api/admin/directus?collection=news', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <div className="w-full">
      <EditorialWorkspace
        initialArticles={articles}
        currentUser={currentUser || { email: currentUserEmail }}
        canPublish={canPublish}
        onSave={handleSaveArticle}
        onDelete={handleDeleteArticle}
        onRefresh={fetchArticles}
        focusId={focusId}
      />
    </div>
  );
}

export default NewsMasterDetailPanel;
