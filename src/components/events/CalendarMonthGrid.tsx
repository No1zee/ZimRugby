"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import type { EventItem } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

interface CalendarMonthGridProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  eventsByDay: Map<string, EventItem[]>;
  selectedDateStr: string | null;
  onSelectDate: (dateStr: string) => void;
  getTagBadge: (tags: string[]) => { label: string; bg: string; text: string };
}

export default function CalendarMonthGrid({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  eventsByDay,
  selectedDateStr,
  onSelectDate,
  getTagBadge,
}: CalendarMonthGridProps) {
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  const startDayOfWeek = firstDayOfMonth.getDay();
  const totalDays = lastDayOfMonth.getDate();

  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

  const calendarDays: Array<{
    date: Date;
    key: string;
    isCurrentMonth: boolean;
    dayNum: number;
  }> = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, monthIndex - 1, prevMonthLastDay - i);
    calendarDays.push({
      date: d,
      key: dayKey(d),
      isCurrentMonth: false,
      dayNum: d.getDate(),
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, monthIndex, d);
    calendarDays.push({
      date: dateObj,
      key: dayKey(dateObj),
      isCurrentMonth: true,
      dayNum: d,
    });
  }

  // Next month leading days to complete grid
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, monthIndex + 1, i);
    calendarDays.push({
      date: d,
      key: dayKey(d),
      isCurrentMonth: false,
      dayNum: d.getDate(),
    });
  }

  const todayKey = dayKey(new Date());

  return (
    <div className="bg-white rounded-3xl border border-black/10 shadow-sm overflow-hidden">
      {/* Month Grid Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-black/5 bg-milk-white">
        <h3 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-tight text-rich-black flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-zru-green" />
          {monthLabel(currentMonth)}
        </h3>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-rich-black transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-xl border border-black/10 bg-white hover:bg-black/5 text-rich-black transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Strip */}
      <div className="grid grid-cols-7 border-b border-black/5 bg-black/2 text-center py-2.5">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-[11px] font-mono font-black uppercase text-black/50 tracking-wider">
            {wd}
          </div>
        ))}
      </div>

      {/* 7x6 Calendar Cells Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-black/5 bg-milk-white">
        {calendarDays.map((cell) => {
          const dayEvents = eventsByDay.get(cell.key) || [];
          const isToday = cell.key === todayKey;
          const isSelected = cell.key === selectedDateStr;
          const topEvent = dayEvents[0];
          const badge = topEvent ? getTagBadge(topEvent.tags) : null;

          return (
            <div
              key={cell.key}
              onClick={() => onSelectDate(cell.key)}
              className={`min-h-[90px] sm:min-h-[105px] p-2 flex flex-col justify-between cursor-pointer transition-all duration-150 relative ${
                !cell.isCurrentMonth
                  ? "bg-black/2 opacity-40 hover:opacity-70"
                  : isSelected
                  ? "bg-zru-green/10 border-2 border-zru-green shadow-inner"
                  : isToday
                  ? "bg-zru-gold/10 hover:bg-zru-gold/20"
                  : "bg-white hover:bg-black/2"
              }`}
            >
              {/* Top Cell Header: Date Number + Event Count Pill */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                    isToday
                      ? "bg-zru-gold text-rich-black font-black shadow"
                      : isSelected
                      ? "bg-zru-green text-white font-black"
                      : cell.isCurrentMonth
                      ? "text-rich-black"
                      : "text-black/40"
                  }`}
                >
                  {cell.dayNum}
                </span>

                {dayEvents.length > 0 && (
                  <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full bg-black text-white">
                    {dayEvents.length} {dayEvents.length === 1 ? "evt" : "evts"}
                  </span>
                )}
              </div>

              {/* Low-noise cell preview: Top event title only */}
              {topEvent ? (
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-1">
                    {badge && (
                      <span className={`text-[8px] font-mono font-black px-1 py-0.2 rounded ${badge.bg}`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-rich-black line-clamp-2 leading-tight">
                    {topEvent.title}
                  </p>
                </div>
              ) : (
                <div className="h-4" />
              )}

              {/* Bottom indicator strip for matches with score */}
              {topEvent?.score && (
                <div className="mt-auto pt-1">
                  <span className="text-[9px] font-mono font-black text-zru-green bg-zru-green/10 px-1.5 py-0.5 rounded block text-center truncate">
                    {topEvent.score}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
