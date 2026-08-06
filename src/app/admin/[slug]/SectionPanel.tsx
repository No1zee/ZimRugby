"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, LayoutTemplate, Type, Image, List, HelpCircle, ArrowRight, BarChart3, Users, Target, Eye, Mail, GraduationCap, MapPin, Search, Megaphone, Newspaper, Trophy, Sprout, Send, Handshake, Layers } from "lucide-react";
import AddSectionModal from "./AddSectionModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Section {
  id: string;
  section_key: string;
  title?: string;
  status?: string;
  is_enabled?: boolean;
  date_created?: string;
  date_updated?: string;
}

const SECTION_TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  overview:             { label: "Overview", icon: Type, color: "#6366f1" },
  hero_image:          { label: "Hero Image", icon: Image, color: "#8b5cf6" },
  stats:               { label: "Statistics", icon: BarChart3, color: "#06b6d4" },
  benefits:            { label: "Benefits", icon: List, color: "#10b981" },
  faq:                 { label: "FAQ", icon: HelpCircle, color: "#f59e0b" },
  cta:                 { label: "CTA", icon: ArrowRight, color: "#f97316" },
  team_list:           { label: "Team List", icon: Users, color: "#3b82f6" },
  mission:             { label: "Mission", icon: Target, color: "#ec4899" },
  vision:              { label: "Vision", icon: Eye, color: "#a855f7" },
  contact:             { label: "Contact", icon: Mail, color: "#14b8a6" },
  programmes:          { label: "Programmes", icon: GraduationCap, color: "#22c55e" },
  clubs:               { label: "Clubs", icon: MapPin, color: "#eab308" },
  development_pathways: { label: "Pathways", icon: Search, color: "#0ea5e9" },
  hero_carousel:       { label: "Hero Carousel", icon: Layers, color: "#64748b" },
  announcements:       { label: "Announcements", icon: Megaphone, color: "#ef4444" },
  hub_grid:            { label: "Hub Grid", icon: Newspaper, color: "#8b5cf6" },
  campaign_highlight:  { label: "Campaign", icon: Trophy, color: "#f59e0b" },
  grassroots:          { label: "Grassroots", icon: Sprout, color: "#22c55e" },
  newsletter_cta:      { label: "Newsletter", icon: Send, color: "#06b6d4" },
  sponsors_grid:       { label: "Sponsors", icon: Handshake, color: "#10b981" },
  custom:              { label: "Custom", icon: Type, color: "#6b7280" },
};

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return "just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function SortableSectionItem({
  section,
  selectedSectionId,
  onSelect,
  onDelete,
}: {
  section: Section;
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const meta = SECTION_TYPE_META[section.section_key] || { label: section.section_key, icon: Type, color: "#6b7280" };
  const Icon = meta.icon;
  const isPublished = section.status === "published";
  const updatedLabel = formatRelativeTime(section.date_updated);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(section.id)}
      className={`group flex items-center gap-2.5 p-3 rounded-lg cursor-pointer transition-all ${
        selectedSectionId === section.id
          ? "bg-[#006B3F]/20 border border-[#006B3F]/50 shadow-[0_0_15px_rgba(0,107,63,0.15)]"
          : "bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
      } ${isDragging ? "shadow-2xl shadow-black/50 border-[#00A85A]/50 bg-[#1A1A1A]" : ""}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="w-7 h-7 flex items-center justify-center -ml-1 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 transition-colors"
      >
        <GripVertical className="w-3.5 h-3.5 shrink-0 outline-none" />
      </div>

      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${meta.color}18` }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-bold truncate">
            {section.title || section.section_key}
          </span>
          <span
            className={`shrink-0 w-1.5 h-1.5 rounded-full ${
              isPublished ? "bg-[#00A85A]" : "bg-[#FFB800]"
            }`}
            title={isPublished ? "Published" : "Draft"}
          />
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-white/20 text-[9px] font-subheading uppercase tracking-[0.3em]">
            {meta.label}
          </span>
          {updatedLabel && (
            <>
              <span className="text-white/10 text-[9px]">|</span>
              <span className="text-white/20 text-[9px] font-subheading">
                {updatedLabel}
              </span>
            </>
          )}
          {section.is_enabled === false && (
            <span className="text-white/20 text-[8px] font-subheading uppercase tracking-widest ml-auto">
              DISABLED
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(section.id);
        }}
        className="p-1.5 text-white/20 hover:text-[#FF4444] transition-colors shrink-0 opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function SectionPanel({
  sections,
  selectedSectionId,
  onSelect,
  onReorder,
  onAdd,
  onDelete,
  pageSlug,
}: {
  sections: Section[];
  selectedSectionId: string | null;
  onSelect: (id: string) => void;
  onReorder: (ids: string[]) => void;
  onAdd: (data: Partial<Section>) => void;
  onDelete: (id: string) => void;
  pageSlug: string;
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sections, oldIndex, newIndex);
      onReorder(newSections.map((s) => s.id));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 relative">
        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#006B3F]/50 to-transparent" />
        <h2 className="text-white font-heading text-sm uppercase tracking-wider">
          Sections
        </h2>
        <p className="text-white/30 text-[10px] font-subheading uppercase tracking-[0.3em] mt-1">
          Click to edit &bull; Drag to reorder
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Page Hero & Settings Edit Button */}
        <div
          onClick={() => onSelect("page_settings")}
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
            selectedSectionId === "page_settings"
              ? "bg-[#006B3F] border-[#00A85A] text-white shadow-[0_0_15px_rgba(0,107,63,0.3)]"
              : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07] text-white"
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <LayoutTemplate className="w-4 h-4 text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-bold truncate">
              Page Hero & Settings
            </div>
            <div className="text-white/25 text-[9px] font-subheading uppercase tracking-[0.3em]">
              Header & Metadata
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 my-2" />

        {sections.length === 0 ? (
          <div className="text-center py-12 text-white/20">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-xs font-subheading uppercase tracking-widest">
              No sections yet
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  selectedSectionId={selectedSectionId}
                  onSelect={onSelect}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="p-4 border-t border-white/10 relative">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#006B3F]/30 rounded-lg text-[#00A85A]/70 hover:text-[#00A85A] hover:border-[#006B3F]/50 hover:bg-[#006B3F]/10 transition-all text-[10px] font-bold uppercase tracking-widest"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {showAddModal && (
        <AddSectionModal
          onAdd={onAdd}
          onClose={() => setShowAddModal(false)}
          pageSlug={pageSlug}
        />
      )}
    </div>
  );
}
