'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Save, 
  Send, 
  Eye, 
  SlidersHorizontal, 
  Sparkles, 
  FileText, 
  Clock, 
  Image as ImageIcon, 
  Tag, 
  Share2, 
  Calendar, 
  RefreshCw, 
  Trash2, 
  Code,
  PenTool
} from 'lucide-react';
import { TiptapArticleEditor } from '../editor/TiptapArticleEditor';
import ImagePicker from '../ui/ImagePicker';
import { useToast } from '../ui/ToastProvider';
import { useConfirm } from '../ui/ConfirmProvider';
import { ArticleLivePreview } from '../ArticleLivePreview';
import ArticleSocialCardModal from '../ArticleSocialCardModal';

export interface EditorialArticle {
  id?: string | number;
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  category?: string;
  status: 'draft' | 'published' | 'archived';
  date?: string;
  date_created?: string;
  date_updated?: string;
  image?: string;
  hero_image_caption?: string;
  hero_image_alt?: string;
  photographer_credit?: string;
  photographer_licence?: string;
  is_hero_slider?: boolean;
  author?: string;
  tags?: string[] | string;
  meta_description?: string;
}

interface EditorialWorkspaceProps {
  initialArticles?: EditorialArticle[];
  categories?: string[];
  currentUser?: { name?: string; email?: string; role?: string };
  canPublish?: boolean;
  onSave?: (article: EditorialArticle, isPublish: boolean) => Promise<{ success: boolean; data?: any; error?: string }>;
  onDelete?: (id: string | number) => Promise<boolean>;
  onRefresh?: () => Promise<void>;
  focusId?: string | number | null;
}

const LOCAL_STORAGE_DRAFT_KEY = 'zru_admin_editorial_autodraft';

export default function EditorialWorkspace({
  initialArticles = [],
  categories = ['General', 'Sables', 'Lady Sables', 'Junior Sables', 'Sevens', 'Academy', 'Governance', 'Community'],
  currentUser,
  canPublish = true,
  onSave,
  onDelete,
  onRefresh,
  focusId
}: EditorialWorkspaceProps) {
  const { toast } = useToast();
  const confirm = useConfirm();

  // Articles & List state
  const [articles, setArticles] = useState<EditorialArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedArticleId, setSelectedArticleId] = useState<string | number | null>(focusId || null);

  // Active Editor state
  const [activeArticle, setActiveArticle] = useState<EditorialArticle>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'General',
    status: 'draft',
    date: new Date().toISOString().split('T')[0],
    is_hero_slider: false,
    author: currentUser?.name || currentUser?.email || 'ZRU Media Team',
    tags: []
  });

  const [editorMode, setEditorMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasAutoDraftAvailable, setHasAutoDraftAvailable] = useState(false);

  // Inspector Accordion states
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    publish: true,
    taxonomy: true,
    media: true,
    seo: false
  });

  // Modal / Preview states
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  // Sync initial articles
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // Handle focusId initial select
  useEffect(() => {
    if (focusId && articles.length > 0) {
      const match = articles.find(a => String(a.id) === String(focusId));
      if (match) {
        handleSelectArticle(match);
      }
    }
  }, [focusId, articles]);

  // Check localStorage for auto-draft on mount
  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        if (parsed && parsed.title && !selectedArticleId) {
          setHasAutoDraftAvailable(true);
        }
      }
    } catch {
      // Ignore parse error
    }
  }, [selectedArticleId]);

  // Local auto-draft interval (every 2 seconds when dirty)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify({
          ...activeArticle,
          _savedAt: new Date().toISOString()
        }));
        setLastAutoSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.warn('Failed to save auto-draft to localStorage', err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeArticle, hasUnsavedChanges]);

  // Keyboard shortcut listener (/ for search, Cmd+S for save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave(false);
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName) && !(e.target as HTMLElement)?.isContentEditable) {
        e.preventDefault();
        const searchEl = document.getElementById('editorial-search-input');
        searchEl?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeArticle]);

  // Derived article counts
  const counts = useMemo(() => {
    const total = articles.length;
    const published = articles.filter(a => a.status === 'published').length;
    const draft = articles.filter(a => a.status === 'draft').length;
    return { total, published, draft };
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      if (selectedStatusTab === 'published' && article.status !== 'published') return false;
      if (selectedStatusTab === 'draft' && article.status !== 'draft') return false;

      if (selectedCategoryFilter !== 'all' && article.category !== selectedCategoryFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = article.title?.toLowerCase().includes(query);
        const summaryMatch = article.summary?.toLowerCase().includes(query);
        const authorMatch = article.author?.toLowerCase().includes(query);
        if (!titleMatch && !summaryMatch && !authorMatch) return false;
      }

      return true;
    });
  }, [articles, selectedStatusTab, selectedCategoryFilter, searchQuery]);

  // Word count and reading time
  const metrics = useMemo(() => {
    const text = (activeArticle.title || '') + ' ' + (activeArticle.summary || '') + ' ' + (activeArticle.content || '').replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, readTimeMinutes };
  }, [activeArticle.title, activeArticle.summary, activeArticle.content]);

  // Actions
  const handleSelectArticle = async (article: EditorialArticle) => {
    if (hasUnsavedChanges) {
      const ok = await confirm({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes on the current article. Switching will discard unsaved local edits.',
        confirmLabel: 'Discard & Switch'
      });
      if (!ok) return;
    }

    setSelectedArticleId(article.id || null);
    setActiveArticle({
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : (typeof article.tags === 'string' ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [])
    });
    setHasUnsavedChanges(false);
  };

  const handleNewDocument = async () => {
    if (hasUnsavedChanges) {
      const ok = await confirm({
        title: 'Start New Document?',
        message: 'You have unsaved changes in your current article. Discard them to start fresh?',
        confirmLabel: 'Discard & Create New'
      });
      if (!ok) return;
    }

    setSelectedArticleId(null);
    setActiveArticle({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: 'General',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      is_hero_slider: false,
      author: currentUser?.name || currentUser?.email || 'ZRU Media Team',
      tags: []
    });
    setHasUnsavedChanges(false);
  };

  const handleRestoreAutoDraft = () => {
    try {
      const rawDraft = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft);
        setActiveArticle(parsed);
        setHasUnsavedChanges(true);
        setHasAutoDraftAvailable(false);
        toast('Auto-draft successfully restored!', 'success');
      }
    } catch {
      toast('Could not restore auto-draft.', 'error');
    }
  };

  const handleDismissAutoDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
    setHasAutoDraftAvailable(false);
  };

  const handleFieldChange = (field: keyof EditorialArticle, value: any) => {
    setActiveArticle(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = async (isPublish: boolean) => {
    if (!activeArticle.title?.trim()) {
      toast('Article headline is required.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: EditorialArticle = {
        ...activeArticle,
        status: isPublish ? 'published' : 'draft',
        slug: activeArticle.slug?.trim() || generateSlug(activeArticle.title)
      };

      if (onSave) {
        const res = await onSave(payload, isPublish);
        if (res.success) {
          toast(isPublish ? 'Article published live!' : 'Draft saved successfully.', 'success');
          setHasUnsavedChanges(false);
          localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
          if (res.data?.id) {
            setSelectedArticleId(res.data.id);
            setActiveArticle(prev => ({ ...prev, id: res.data.id, status: payload.status }));
          }
          if (onRefresh) await onRefresh();
        } else {
          toast(res.error || 'Failed to save article.', 'error');
        }
      } else {
        toast(isPublish ? 'Article published (demo)!' : 'Draft saved (demo).', 'success');
        setHasUnsavedChanges(false);
      }
    } catch (err: any) {
      toast(err.message || 'Save error occurred.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCurrent = async () => {
    if (!selectedArticleId) return;
    const ok = await confirm({
      title: 'Delete Article',
      message: `Are you sure you want to delete "${activeArticle.title}"? This action moves it to Trash.`,
      confirmLabel: 'Move to Trash'
    });
    if (!ok) return;

    if (onDelete) {
      const success = await onDelete(selectedArticleId);
      if (success) {
        toast('Article moved to Trash.', 'success');
        handleNewDocument();
        if (onRefresh) await onRefresh();
      } else {
        toast('Failed to delete article.', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[680px] bg-[#0c120c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      
      {/* Recovery banner for local draft */}
      {hasAutoDraftAvailable && (
        <div className="bg-zru-green/10 border-b border-zru-green/30 px-4 py-2 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zru-green animate-pulse" />
            <span>We found an unsaved local draft from a previous session. Would you like to recover it?</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRestoreAutoDraft}
              className="px-2.5 py-1 bg-zru-green hover:bg-zru-green/80 text-white font-bold rounded-lg transition-colors"
            >
              Restore Draft
            </button>
            <button 
              onClick={handleDismissAutoDraft}
              className="px-2.5 py-1 text-zinc-400 hover:text-white transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* PANEL 1: LEFT CONTENT RAIL */}
        <aside className="w-80 border-r border-white/10 bg-black/40 flex flex-col shrink-0">
          
          {/* Header & New Document CTA */}
          <div className="p-3.5 border-b border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Editorial Rail</span>
              <button
                onClick={handleNewDocument}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zru-green hover:bg-zru-green/80 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Article</span>
              </button>
            </div>

            {/* Search Input with / shortcut badge */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="editorial-search-input"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles... (Press /)"
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-7 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zru-green/60"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex rounded-xl bg-white/5 p-1 text-[11px] font-semibold text-zinc-400">
              <button
                onClick={() => setSelectedStatusTab('all')}
                className={`flex-1 py-1 text-center rounded-lg transition-colors ${selectedStatusTab === 'all' ? 'bg-zru-green text-white shadow-xs' : 'hover:text-white'}`}
              >
                All ({counts.total})
              </button>
              <button
                onClick={() => setSelectedStatusTab('published')}
                className={`flex-1 py-1 text-center rounded-lg transition-colors ${selectedStatusTab === 'published' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-white'}`}
              >
                Published ({counts.published})
              </button>
              <button
                onClick={() => setSelectedStatusTab('draft')}
                className={`flex-1 py-1 text-center rounded-lg transition-colors ${selectedStatusTab === 'draft' ? 'bg-amber-600 text-white shadow-xs' : 'hover:text-white'}`}
              >
                Drafts ({counts.draft})
              </button>
            </div>

            {/* Category Quick Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap font-medium transition-colors ${selectedCategoryFilter === 'all' ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap font-medium transition-colors ${selectedCategoryFilter === cat ? 'bg-zru-green/30 text-zru-green border border-zru-green/40' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Article List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No matching articles found.
              </div>
            ) : (
              filteredArticles.map(article => {
                const isSelected = selectedArticleId === article.id;
                return (
                  <button
                    key={article.id || article.title}
                    onClick={() => handleSelectArticle(article)}
                    className={`w-full text-left p-3.5 transition-all flex flex-col gap-1.5 relative group ${
                      isSelected 
                        ? 'bg-zru-green/10 border-l-4 border-l-zru-green pl-3' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zru-green px-1.5 py-0.5 bg-zru-green/10 rounded">
                        {article.category || 'General'}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        article.status === 'published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {article.status}
                      </span>
                    </div>

                    <h4 className={`text-xs font-semibold line-clamp-2 leading-snug ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                      {article.title || 'Untitled Draft'}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{article.date || 'No date'}</span>
                      {article.is_hero_slider && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          ★ Hero
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Refresh / Footer Stats */}
          <div className="p-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-[11px] text-zinc-500">
            <span>{filteredArticles.length} document{filteredArticles.length === 1 ? '' : 's'}</span>
            {onRefresh && (
              <button 
                onClick={onRefresh}
                className="hover:text-white flex items-center gap-1 transition-colors"
                title="Refresh CMS data"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync</span>
              </button>
            )}
          </div>
        </aside>

        {/* PANEL 2: CENTER WRITING CANVAS */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0e140e]">
          
          {/* Top Sticky Action & Metric Bar */}
          <header className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-black/30 backdrop-blur shrink-0">
            
            {/* Left Status & Readiness indicator */}
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${activeArticle.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white capitalize">
                  {selectedArticleId ? `Editing ${activeArticle.status}` : 'New Article Draft'}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {hasUnsavedChanges ? (
                    <span className="text-amber-400/90 font-medium">Unsaved local changes</span>
                  ) : lastAutoSavedTime ? (
                    `Draft synced locally at ${lastAutoSavedTime}`
                  ) : (
                    'Clean state'
                  )}
                </span>
              </div>
            </div>

            {/* Center: Quiet word & time counters */}
            <div className="hidden md:flex items-center gap-4 text-xs text-zinc-500 font-medium">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-zinc-600" />
                {metrics.words} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                ~{metrics.readTimeMinutes} min read
              </span>
              
              {/* WYSIWYG / Markdown toggle */}
              <div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10 ml-2">
                <button
                  type="button"
                  onClick={() => setEditorMode('wysiwyg')}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                    editorMode === 'wysiwyg' ? 'bg-zru-green text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="WYSIWYG Visual Mode"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Visual</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('markdown')}
                  className={`px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
                    editorMode === 'markdown' ? 'bg-zru-green text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Raw HTML/Markdown Mode"
                >
                  <Code className="w-3 h-3" />
                  <span>Code</span>
                </button>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl transition-colors flex items-center gap-1.5"
                title="Live Website Preview"
              >
                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Preview</span>
              </button>

              <button
                onClick={() => handleSave(false)}
                disabled={isSaving}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
                title="Save as Draft (Cmd+S)"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>

              {canPublish && (
                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-zru-green hover:bg-zru-green/80 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
                  title="Publish Article to Production"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              )}

              {/* Inspector toggle button */}
              <button
                onClick={() => setIsInspectorOpen(prev => !prev)}
                className={`p-2 rounded-xl border transition-colors ml-1 ${
                  isInspectorOpen 
                    ? 'bg-zru-green/20 border-zru-green/40 text-zru-green' 
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                }`}
                title="Toggle Inspector Sidebar"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Center Canvas Writing Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              
              {/* Article Headline Input */}
              <div>
                <input
                  type="text"
                  value={activeArticle.title}
                  onChange={e => handleFieldChange('title', e.target.value)}
                  placeholder="Article Headline..."
                  className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white placeholder:text-zinc-600 focus:outline-none tracking-tight"
                />
              </div>

              {/* Article Summary / Subtitle Input */}
              <div>
                <textarea
                  rows={2}
                  value={activeArticle.summary || ''}
                  onChange={e => handleFieldChange('summary', e.target.value)}
                  placeholder="Add a clear, compelling 1-2 sentence lead summary..."
                  className="w-full bg-transparent text-sm sm:text-base text-zinc-300 placeholder:text-zinc-600 focus:outline-none resize-none border-b border-white/10 pb-3"
                />
              </div>

              {/* Editor Surface (WYSIWYG or Markdown) */}
              <div className="min-h-[360px] pb-16">
                {editorMode === 'wysiwyg' ? (
                  <TiptapArticleEditor
                    content={activeArticle.content}
                    onChange={(html: string) => handleFieldChange('content', html)}
                    placeholder="Start writing the story... Use the floating toolbar for headings, lists, quotes, and links."
                  />
                ) : (
                  <textarea
                    rows={16}
                    value={activeArticle.content}
                    onChange={e => handleFieldChange('content', e.target.value)}
                    placeholder="Enter raw HTML or Markdown content..."
                    className="w-full h-full min-h-[400px] bg-black/30 border border-white/10 rounded-2xl p-4 font-mono text-xs text-zinc-200 focus:outline-none focus:border-zru-green/50 resize-y"
                  />
                )}
              </div>

            </div>
          </div>
        </main>

        {/* PANEL 3: RIGHT COLLAPSIBLE INSPECTOR */}
        {isInspectorOpen && (
          <aside className="w-80 border-l border-white/10 bg-black/40 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
            
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Article Inspector</span>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="text-zinc-500 hover:text-white text-xs p-1"
                title="Collapse Inspector"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5">
              
              {/* SECTION: PUBLISHING & VISIBILITY */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleSection('publish')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zru-green" />
                    <span>Publishing & Status</span>
                  </span>
                  {openSections.publish ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </button>

                {openSections.publish && (
                  <div className="p-3.5 flex flex-col gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Workflow Status</label>
                      <select
                        value={activeArticle.status}
                        onChange={e => handleFieldChange('status', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      >
                        <option value="draft">Draft (Private)</option>
                        <option value="published">Published (Live)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Publish Date</label>
                      <input
                        type="date"
                        value={activeArticle.date || ''}
                        onChange={e => handleFieldChange('date', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Author / Byline</label>
                      <input
                        type="text"
                        value={activeArticle.author || ''}
                        onChange={e => handleFieldChange('author', e.target.value)}
                        placeholder="e.g. ZRU Media Team"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">Homepage Hero Slider</span>
                        <span className="text-[10px] text-zinc-500">Feature as main top banner</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeArticle.is_hero_slider || false}
                        onChange={e => handleFieldChange('is_hero_slider', e.target.checked)}
                        className="w-4 h-4 accent-zru-green rounded cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: TAXONOMY & CATEGORY */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleSection('taxonomy')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-zru-green" />
                    <span>Taxonomy & Tags</span>
                  </span>
                  {openSections.taxonomy ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </button>

                {openSections.taxonomy && (
                  <div className="p-3.5 flex flex-col gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Primary Category</label>
                      <select
                        value={activeArticle.category || 'General'}
                        onChange={e => handleFieldChange('category', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(activeArticle.tags) ? activeArticle.tags.join(', ') : (activeArticle.tags || '')}
                        onChange={e => handleFieldChange('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                        placeholder="e.g. Sables, Rugby Africa, Victoria Cup"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: MEDIA & LEGAL CREDITS */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleSection('media')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-zru-green" />
                    <span>Featured Media & Rights</span>
                  </span>
                  {openSections.media ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </button>

                {openSections.media && (
                  <div className="p-3.5 flex flex-col gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Cover / Hero Image</label>
                      <ImagePicker
                        value={activeArticle.image || ''}
                        onChange={(val: string) => handleFieldChange('image', val)}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Image Caption</label>
                      <input
                        type="text"
                        value={activeArticle.hero_image_caption || ''}
                        onChange={e => handleFieldChange('hero_image_caption', e.target.value)}
                        placeholder="Photo description for display"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Photographer Credit</label>
                      <input
                        type="text"
                        value={activeArticle.photographer_credit || ''}
                        onChange={e => handleFieldChange('photographer_credit', e.target.value)}
                        placeholder="e.g. ZRU Media / John Doe"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Licence & Rights</label>
                      <select
                        value={activeArticle.photographer_licence || 'ZRU Official Rights'}
                        onChange={e => handleFieldChange('photographer_licence', e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-zru-green"
                      >
                        <option value="ZRU Official Rights">ZRU Official Rights</option>
                        <option value="Editorial Press Use">Editorial Press Use</option>
                        <option value="Creative Commons (CC-BY)">Creative Commons (CC-BY)</option>
                        <option value="World Rugby Pool">World Rugby Pool</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: SEO & SOCIAL PREVIEW */}
              <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                <button
                  type="button"
                  onClick={() => toggleSection('seo')}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-zru-green" />
                    <span>SEO & Social Card</span>
                  </span>
                  {openSections.seo ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                </button>

                {openSections.seo && (
                  <div className="p-3.5 flex flex-col gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">URL Slug</label>
                      <input
                        type="text"
                        value={activeArticle.slug || ''}
                        onChange={e => handleFieldChange('slug', e.target.value)}
                        placeholder="article-slug"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-zru-green"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Meta Excerpt</label>
                      <textarea
                        rows={2}
                        value={activeArticle.meta_description || activeArticle.summary || ''}
                        onChange={e => handleFieldChange('meta_description', e.target.value)}
                        placeholder="Search engine meta description..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-zru-green resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowSocialModal(true)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-zru-green" />
                      <span>Social Share Preview</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Danger Zone: Delete Article */}
              {selectedArticleId && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteCurrent}
                    className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Move to Trash</span>
                  </button>
                </div>
              )}

            </div>
          </aside>
        )}

      </div>

      {/* Live Website Preview Modal */}
      {showPreviewModal && (
        <ArticleLivePreview
          isOpen={showPreviewModal}
          title={activeArticle.title}
          summary={activeArticle.summary || ''}
          content={activeArticle.content}
          category={activeArticle.category || 'General'}
          author={activeArticle.author || 'ZRU Media Team'}
          onClose={() => setShowPreviewModal(false)}
        />
      )}

      {/* Social Card Modal */}
      {showSocialModal && (
        <ArticleSocialCardModal
          title={activeArticle.title}
          category={activeArticle.category || 'General'}
          image={activeArticle.image}
          onClose={() => setShowSocialModal(false)}
        />
      )}

    </div>
  );
}
