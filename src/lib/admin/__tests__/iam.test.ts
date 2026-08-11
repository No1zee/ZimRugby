import { describe, expect, it } from "vitest";
import {
  canAccessTab,
  canCreateCollection,
  canEditCollection,
  canOnCollection,
  canUseFeature,
  hasPermission,
  isSuperAdmin,
  roleToName,
} from "../iam";

const EDITOR = {
  tabs: ["overview", "media", "fixtures", "teams"],
  collections: {
    news: { create: true, read: true, update: true },
    teams: { create: true, read: true, update: true },
    venues: { read: true },
  },
  pages_builder: false,
  ai_assistant: false,
  media_upload: true,
  fanzone_pii: false,
};

describe("canAccessTab", () => {
  it("grants everything to super admin", () => {
    expect(canAccessTab({ all: true }, "roles")).toBe(true);
    expect(canAccessTab({ all: true }, "anything")).toBe(true);
  });

  it("grants listed tabs only", () => {
    expect(canAccessTab(EDITOR, "teams")).toBe(true);
    expect(canAccessTab(EDITOR, "overview")).toBe(true);
    expect(canAccessTab(EDITOR, "events")).toBe(false);
  });

  it("denies null/undefined and empty perms", () => {
    expect(canAccessTab(null, "overview")).toBe(false);
    expect(canAccessTab(undefined, "overview")).toBe(false);
    expect(canAccessTab({}, "overview")).toBe(false);
  });
});

describe("collection grants", () => {
  it("checks per-collection actions", () => {
    expect(canOnCollection(EDITOR, "news", "update")).toBe(true);
    expect(canOnCollection(EDITOR, "news", "delete")).toBe(false);
    expect(canOnCollection(EDITOR, "venues", "create")).toBe(false);
  });

  it("super admin bypasses grants", () => {
    expect(canOnCollection({ all: true }, "anything", "delete")).toBe(true);
  });

  it("edit/create helpers match grants", () => {
    expect(canEditCollection(EDITOR, "teams")).toBe(true);
    expect(canCreateCollection(EDITOR, "teams")).toBe(true);
    expect(canCreateCollection(EDITOR, "venues")).toBe(false);
  });
});

describe("canUseFeature", () => {
  it("respects feature flags", () => {
    expect(canUseFeature(EDITOR, "media_upload")).toBe(true);
    expect(canUseFeature(EDITOR, "pages_builder")).toBe(false);
    expect(canUseFeature(EDITOR, "ai_assistant")).toBe(false);
  });

  it("super admin gets all features", () => {
    expect(canUseFeature({ all: true }, "ai_assistant")).toBe(true);
  });
});

describe("hasPermission", () => {
  it("EDIT/PUBLISH pass when any collection is writable", () => {
    expect(hasPermission(EDITOR, "EDIT")).toBe(true);
    expect(hasPermission(EDITOR, "PUBLISH")).toBe(true);
  });

  it("DELETE only when a grant allows delete", () => {
    expect(hasPermission(EDITOR, "DELETE")).toBe(false);
    expect(hasPermission({ all: true }, "DELETE")).toBe(true);
  });

  it("MEDIA follows media_upload flag", () => {
    expect(hasPermission(EDITOR, "MEDIA")).toBe(true);
    expect(hasPermission({}, "MEDIA")).toBe(false);
  });
});

describe("isSuperAdmin / roleToName", () => {
  it("detects super admin", () => {
    expect(isSuperAdmin({ all: true })).toBe(true);
    expect(isSuperAdmin(EDITOR)).toBe(false);
  });

  it("maps role names", () => {
    expect(roleToName("super_admin")).toBe("Super Admin");
    expect(roleToName("editor")).toBe("Content Editor");
    expect(roleToName("custom_role")).toBe("Custom Role");
  });
});
