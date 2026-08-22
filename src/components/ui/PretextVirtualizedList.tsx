"use client";

import React, { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { computePretextLayout } from "@/lib/pretext/measure";

export interface VirtualItemData {
  id: string | number;
  title: string;
  excerpt?: string;
}

export interface PretextVirtualizedListProps<T extends VirtualItemData> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  titleFont?: string;
  titleLineHeight?: number;
  excerptFont?: string;
  excerptLineHeight?: number;
  fixedPaddingHeight?: number;
  overscan?: number;
  containerHeight?: number | string;
}

export function PretextVirtualizedList<T extends VirtualItemData>({
  items,
  renderItem,
  className = "",
  titleFont = "700 18px 'Montserrat', sans-serif",
  titleLineHeight = 24,
  excerptFont = "400 14px 'Inter', sans-serif",
  excerptLineHeight = 20,
  fixedPaddingHeight = 64,
  overscan = 3,
  containerHeight = 600,
}: PretextVirtualizedListProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!scrollRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, []);

  // 1. Calculate exact item heights in memory without DOM thrashing
  const { itemHeights, itemOffsets, totalHeight } = useMemo(() => {
    if (!isClient || containerWidth <= 0) {
      const fallbackHeight = 120;
      return {
        itemHeights: items.map(() => fallbackHeight),
        itemOffsets: items.map((_, i) => i * fallbackHeight),
        totalHeight: items.length * fallbackHeight,
      };
    }

    const heights: number[] = new Array(items.length);
    const offsets: number[] = new Array(items.length);
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      offsets[i] = currentOffset;

      // Measure title dynamic lines
      const titleLayout = computePretextLayout(
        item.title,
        titleFont,
        containerWidth - 32,
        titleLineHeight
      );

      let excerptHeight = 0;
      if (item.excerpt) {
        const excerptLayout = computePretextLayout(
          item.excerpt,
          excerptFont,
          containerWidth - 32,
          excerptLineHeight
        );
        excerptHeight = excerptLayout.totalHeight;
      }

      const itemH = titleLayout.totalHeight + excerptHeight + fixedPaddingHeight;
      heights[i] = itemH;
      currentOffset += itemH;
    }

    return {
      itemHeights: heights,
      itemOffsets: offsets,
      totalHeight: currentOffset,
    };
  }, [
    items,
    containerWidth,
    titleFont,
    titleLineHeight,
    excerptFont,
    excerptLineHeight,
    fixedPaddingHeight,
    isClient,
  ]);

  // 2. Viewport Virtualization Window
  const visibleItems = useMemo(() => {
    if (!isClient || items.length === 0) return items.slice(0, 10).map((item, i) => ({
      item,
      absIndex: i,
      top: i * 120,
    }));

    const viewportHeight = typeof containerHeight === "number" ? containerHeight : 600;
    const startThresh = Math.max(0, scrollTop - 100);
    const endThresh = scrollTop + viewportHeight + 100;

    let startIndex = 0;
    while (startIndex < itemOffsets.length - 1 && itemOffsets[startIndex + 1] <= startThresh) {
      startIndex++;
    }

    let endIndex = startIndex;
    while (endIndex < itemOffsets.length && itemOffsets[endIndex] <= endThresh) {
      endIndex++;
    }

    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(items.length, endIndex + overscan);

    return items.slice(startIndex, endIndex).map((item, relIdx) => ({
      item,
      absIndex: startIndex + relIdx,
      top: itemOffsets[startIndex + relIdx] || 0,
    }));
  }, [items, itemOffsets, scrollTop, containerHeight, overscan, isClient]);

  return (
    <div
      ref={scrollRef}
      className={`overflow-y-auto relative ${className}`}
      style={{ height: containerHeight }}
      onScroll={(evt) => setScrollTop(evt.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative", width: "100%" }}>
        {visibleItems.map(({ item, absIndex, top }) => (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${top}px)`,
            }}
          >
            {renderItem(item, absIndex)}
          </div>
        ))}
      </div>
    </div>
  );
}
