# Session State — 25 July 2026
## Pick up from here on next session

### IMMEDIATE: Load on startup
```
skill(name="morty")
skill(name="ag-sync")
```

### What we did
1. Built full PSI performance plan (9 phases, 28 items) — in ag-comm
2. Analyzed RWC 2027 benchmark — in ag-comm
3. Confirmed Phase 1 of BLUEPRINT.md constraints
4. Configured headroom proxy with --memory
5. Added morty + ag-sync to AGENTS.md startup requirements

### Ed's decisions
- **Epic 1:** Squad system (player card grid with placeholder portraits)
- **Epic 2:** Match utility (next match banner + recent results strip on team page)
- **Visual:** Keep existing design, just add components
- **Branch:** `OC Experimental` for all my work
- **Player profiles:** Deferred (Phase 1 constraint)

### Files to read
- `~/.gemini/ag-comm/pending/req-2026-07-25-performance-plan.md`
- `~/.gemini/ag-comm/pending/req-2026-07-25-rwc27-benchmark-full-analysis.md`
- `BLUEPRINT.md`
- `src/components/teams/TeamPageClient.tsx`
- `src/lib/api/teams.ts`
- `src/types/index.ts`

### Next steps
1. Create `OC Experimental` branch
2. Build PlayerCardGrid component (enhance existing squad cards)
3. Build NextMatchBanner component
4. Build RecentResultsStrip component
5. Add these to TeamPageClient.tsx above the tabs
6. Update ag-comm after each change

### Current codebase state
- Sables page: `src/app/teams/[slug]/page.tsx` → renders `TeamPageClient.tsx`
- TeamPageClient already has card-based squad grid (not text list!)
- Missing: player photos, match banner, results strip, position filters
- Mock data in `src/lib/api/teams.ts` with hardcoded squad + matches
