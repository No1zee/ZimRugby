import { describe, expect, it } from "vitest";
import { deriveEventStatus, derivedStatusLabel } from "../status";

const NOW = new Date(2026, 7, 11, 12, 0, 0); // 2026-08-11 12:00 local

describe("deriveEventStatus", () => {
  it("returns upcoming for no date", () => {
    expect(deriveEventStatus(null, null, NOW)).toBe("upcoming");
    expect(deriveEventStatus(undefined, undefined, NOW)).toBe("upcoming");
  });

  it("returns upcoming for an event later today", () => {
    expect(deriveEventStatus("2026-08-11", "18:00", NOW)).toBe("upcoming");
  });

  it("returns ongoing for an event happening now", () => {
    expect(deriveEventStatus("2026-08-11", "10:00", NOW)).toBe("ongoing");
    expect(deriveEventStatus("2026-08-11", undefined, NOW)).toBe("ongoing");
  });

  it("returns completed for yesterday", () => {
    expect(deriveEventStatus("2026-08-10", "18:00", NOW)).toBe("completed");
  });

  it("treats the start day as ongoing regardless of start time", () => {
    expect(deriveEventStatus("2026-08-11", "00:30", NOW)).toBe("ongoing");
  });

  it("handles malformed dates safely", () => {
    expect(deriveEventStatus("not-a-date", "18:00", NOW)).toBe("upcoming");
    expect(deriveEventStatus("", "18:00", NOW)).toBe("upcoming");
  });
});

describe("derivedStatusLabel", () => {
  it("maps statuses to labels", () => {
    expect(derivedStatusLabel("upcoming")).toBe("Upcoming");
    expect(derivedStatusLabel("ongoing")).toBe("Today");
    expect(derivedStatusLabel("completed")).toBe("Completed");
  });
});
