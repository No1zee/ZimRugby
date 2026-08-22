"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Shield,
  Trophy,
  Users,
  Video,
  Sparkles,
  UploadCloud,
  Loader2,
  X,
  Plus,
} from "lucide-react";
import { useToast } from "../ui/ToastProvider";

interface TiptapArticleEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  onOpenMediaPicker?: () => void;
  editable?: boolean;
}

interface SlashCommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  command: (editor: any) => void;
}

export function TiptapArticleEditor({
  content,
  onChange,
  placeholder = "Type '/' for rugby blocks or write your story...",
  onOpenMediaPicker,
  editable = true,
}: TiptapArticleEditorProps) {
  const { toast } = useToast();
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: false,
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      // Check if user just typed slash
      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(Math.max(0, from - 10), from, "\n", " ");
      if (textBefore.endsWith("/")) {
        setSlashMenuOpen(true);
        setSlashQuery("");
      } else if (slashMenuOpen && !textBefore.includes("/")) {
        setSlashMenuOpen(false);
      }
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[320px] px-4 py-3 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-500 [&_p]:mb-3 [&_p]:text-zinc-200 [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-white [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:text-zinc-200 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:text-zinc-200 [&_blockquote]:border-l-4 [&_blockquote]:border-zru-green [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-3 [&_blockquote]:bg-white/[0.03] [&_blockquote]:rounded-r-lg [&_blockquote]:text-zinc-300 [&_img]:rounded-lg [&_img]:border [&_img]:border-white/10 [&_img]:my-3 [&_a]:text-zru-green [&_a]:underline",
      },
    },
  });

  // Keep editor content in sync when loaded from external source
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  // Keep editable property in sync
  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Handle direct file upload to Directus volume
  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      toast("Uploading image to durable storage...", "info");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      const imageUrl = data.url || data.path || (data.data && data.data.id ? `/api/assets/${data.data.id}` : null);

      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
        toast("Image inserted successfully", "success");
      } else {
        throw new Error("No image URL returned");
      }
    } catch (err: any) {
      toast(err.message || "Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const slashCommands: SlashCommandItem[] = [
    {
      id: "h1",
      title: "Heading 1",
      description: "Large section heading",
      icon: Heading1,
      command: (ed) => ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from }).toggleHeading({ level: 1 }).run(),
    },
    {
      id: "h2",
      title: "Heading 2",
      description: "Medium subsection heading",
      icon: Heading2,
      command: (ed) => ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from }).toggleHeading({ level: 2 }).run(),
    },
    {
      id: "bullet-list",
      title: "Bullet List",
      description: "Create an unordered list",
      icon: List,
      command: (ed) => ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from }).toggleBulletList().run(),
    },
    {
      id: "quote",
      title: "Quote Callout",
      description: "Official coach or captain quote box",
      icon: Quote,
      command: (ed) => ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from }).toggleBlockquote().run(),
    },
    {
      id: "image-upload",
      title: "Upload Image",
      description: "Upload photo to Directus storage",
      icon: ImageIcon,
      command: (ed) => {
        ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from }).run();
        fileInputRef.current?.click();
      },
    },
    {
      id: "match-callout",
      title: "Match Result Callout",
      description: "Embed match score plate snippet",
      icon: Trophy,
      command: (ed) => {
        ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from })
          .insertContent(`<blockquote><p><strong>MATCH RESULT:</strong> Zimbabwe Sables 32 - 17 Namibia | Rugby Africa Cup Final</p></blockquote>`)
          .run();
      },
    },
    {
      id: "squad-list",
      title: "Starting 15 Roster",
      description: "Insert numbered lineup template",
      icon: Users,
      command: (ed) => {
        ed.chain().focus().deleteRange({ from: ed.state.selection.from - 1, to: ed.state.selection.from })
          .insertContent(`<ol><li>1. Prop: </li><li>2. Hooker: </li><li>3. Prop: </li><li>4. Lock: </li><li>5. Lock: </li><li>6. Flanker: </li><li>7. Flanker: </li><li>8. Number 8: </li><li>9. Scrum-half: </li><li>10. Fly-half: </li><li>11. Left Wing: </li><li>12. Inside Centre: </li><li>13. Outside Centre: </li><li>14. Right Wing: </li><li>15. Fullback: </li></ol>`)
          .run();
      },
    },
  ];

  const filteredCommands = slashCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(slashQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(slashQuery.toLowerCase())
  );

  if (!editor) return null;

  return (
    <div className="relative rounded-xl border border-white/10 bg-zinc-950 overflow-hidden shadow-inner flex flex-col">
      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = "";
        }}
      />

      {/* Floating Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-white/10 bg-white/[0.02] px-3 py-2 shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded text-xs transition-colors ${editor.isActive("bold") ? "bg-zru-green text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded text-xs transition-colors ${editor.isActive("italic") ? "bg-zru-green text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded text-xs transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-zru-green text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            title="Heading 1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded text-xs transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-zru-green text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded text-xs transition-colors ${editor.isActive("bulletList") ? "bg-zru-green text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded text-xs transition-colors ${editor.isActive("blockquote") ? "bg-zru-green text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            title="Blockquote"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Media & Slash Hint */}
        <div className="flex items-center gap-2">
          {isUploading && (
            <div className="flex items-center gap-1.5 text-xs text-zru-green font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-xs text-zinc-300 transition-colors"
            title="Upload Image"
          >
            <UploadCloud className="w-3.5 h-3.5 text-zru-green" />
            <span className="hidden sm:inline">Add Photo</span>
          </button>
          <span className="text-[10px] font-mono text-zinc-500 hidden md:inline">
            Type <kbd className="px-1 py-0.5 rounded bg-white/10 text-zinc-400">/</kbd> for blocks
          </span>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-[340px] p-2 bg-black/40">
        <EditorContent editor={editor} />

        {/* Slash Command Dropdown Menu */}
        {slashMenuOpen && (
          <div className="absolute left-6 top-16 z-30 w-72 rounded-xl bg-zinc-950 border border-zru-green/40 shadow-2xl shadow-black p-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-zru-green border-b border-white/10 mb-1 flex items-center justify-between">
              <span>Insert Rugby Block</span>
              <button
                type="button"
                onClick={() => setSlashMenuOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onClick={() => {
                      cmd.command(editor);
                      setSlashMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs text-zinc-300 hover:bg-zru-green/20 hover:text-white transition-colors group"
                  >
                    <div className="w-6 h-6 rounded bg-white/5 group-hover:bg-zru-green flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">{cmd.title}</p>
                      <p className="text-[10px] text-zinc-400">{cmd.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
