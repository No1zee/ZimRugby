"use client";

import { useRef } from "react";
import { Bold, Italic, Heading2, Link, List, Quote, Undo2, Redo2 } from "lucide-react";

export function sanitizeRichHtml(input: string): string {
  if (!input) return "";
  const doc = new DOMParser().parseFromString(input, "text/html");
  const disallowed = doc.querySelectorAll("script, style, iframe, object, embed, form, input, button, video, audio, meta, link");
  disallowed.forEach((el) => el.remove());
  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const val = attr.value.toLowerCase();
      if (
        name.startsWith("on") ||
        (name === "href" && val.startsWith("javascript:")) ||
        (name === "src" && val.startsWith("javascript:"))
      ) {
        el.removeAttribute(attr.name);
      }
    });
    if (!el.getAttribute("href")) el.removeAttribute("href");
  });
  doc.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
  return doc.body.innerHTML;
}

function ToolbarBtn({ title, onClick, children }: { title: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, arg);
    emit();
  };

  const emit = () => {
    const html = sanitizeRichHtml(ref.current?.innerHTML ?? "");
    if (html !== value) onChange(html);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 bg-neutral-50 px-2 py-1.5">
        <ToolbarBtn title="Bold" onClick={() => exec("bold")}><Bold className="h-3.5 w-3.5" /></ToolbarBtn>
        <ToolbarBtn title="Italic" onClick={() => exec("italic")}><Italic className="h-3.5 w-3.5" /></ToolbarBtn>
        <ToolbarBtn title="Heading" onClick={() => exec("formatBlock", "<h3>")}><Heading2 className="h-3.5 w-3.5" /></ToolbarBtn>
        <span className="mx-1 h-4 w-px bg-neutral-200" />
        <ToolbarBtn title="Bullet list" onClick={() => exec("insertUnorderedList")}><List className="h-3.5 w-3.5" /></ToolbarBtn>
        <ToolbarBtn title="Quote" onClick={() => exec("formatBlock", "<blockquote>")}><Quote className="h-3.5 w-3.5" /></ToolbarBtn>
        <ToolbarBtn title="Link" onClick={() => {
          const url = window.prompt("Link URL (https://…)");
          if (url) exec("createLink", url);
        }}><Link className="h-3.5 w-3.5" /></ToolbarBtn>
        <span className="mx-1 h-4 w-px bg-neutral-200" />
        <ToolbarBtn title="Undo" onClick={() => exec("undo")}><Undo2 className="h-3.5 w-3.5" /></ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={() => exec("redo")}><Redo2 className="h-3.5 w-3.5" /></ToolbarBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
        className="min-h-[180px] px-4 py-3 text-sm text-neutral-800 outline-none [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-neutral-400 [&_a]:text-teal-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-3 [&_blockquote]:text-neutral-600 [&_h3]:text-base [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}



