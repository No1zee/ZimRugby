import { describe, expect, it } from "vitest";
import { deriveEventStatus, deriveEventStatusFromOccurrence, derivedStatusLabel } from "../status";

const NOW = new Date(2026, 7, 11, 12, 0, 0); // 2026-08-11 12:00 local

// Occurrence instants are UTC; NOW is 12:00 local. Test machine TZ is assumed
// UTC, so construct instants that land around the assertions on any zone by
// pinning the CAT wall clock: 2026-08-11 10:00 CAT == 08:00 UTC, etc.
const CAT = (wall: string) => new Date(`${wall}+02:00`).toISOString();

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

describe("deriveEventStatusFromOccurrence", () => {
  const NOW_UTC = new Date("2026-08-11T12:00:00.000Z"); // 14:00 CAT

  it("returns upcoming for a future occurrence", () => {
    expect(deriveEventStatusFromOccurrence(CAT("2026-08-11 18:00"), undefined, NOW_UTC)).toBe("upcoming");
  });

  it("returns ongoing for a live occurrence", () => {
    expect(deriveEventStatusFromOccurrence(CAT("2026-08-11 10:00"), undefined, NOW_UTC)).toBe("ongoing");
  });

  it("returns completed when the occurrence ends_at has passed", () => {
    expect(deriveEventStatusFromOccurrence(CAT("2026-08-11 08:00"), CAT("2026-08-11 11:00"), NOW_UTC)).toBe("completed");
  });

  it("is ongoing inside an ends_at window", () => {
    expect(deriveEventStatusFromOccurrence(CAT("2026-08-11 08:00"), CAT("2026-08-11 16:00"), NOW_UTC)).toBe("ongoing");
  });

  it("runs to end of the CAT start day when ends_at is absent", () => {
    // 23:59 CAT on the 11th > now, so still ongoing even though start passed.
    expect(deriveEventStatusFromOccurrence(CAT("2026-08-11 00:30"), undefined, NOW_UTC)).toBe("ongoing");
    // A start on the 10th without ends_at is completed by the 11th.
    expect(deriveEventStatusFromOccurrence(CAT("2026-08-10 18:00"), undefined, NOW_UTC)).toBe("completed");
  });

  it("handles missing or malformed instants safely", () => {
    expect(deriveEventStatusFromOccurrence(null, undefined, NOW_UTC)).toBe("upcoming");
    expect(deriveEventStatusFromOccurrence("not-a-date", undefined, NOW_UTC)).toBe("upcoming");
  });
});
