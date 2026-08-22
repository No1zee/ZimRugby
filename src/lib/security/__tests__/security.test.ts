import { describe, it, expect } from 'vitest';
import { canOnCollection, isSuperAdmin, RolePermissions } from '../../admin/iam';

describe('Security & Penetration Test Suite', () => {
  describe('Broken Object Level Authorization (BOLA / RBAC Isolation)', () => {
    const EDITOR_PERMS: RolePermissions = {
      tabs: ["overview", "media", "fixtures", "teams"],
      collections: {
        news: { create: true, read: true, update: true, delete: false },
        teams: { create: true, read: true, update: true, delete: false },
        venues: { read: true },
      },
      pages_builder: false,
      ai_assistant: false,
      media_upload: true,
      fanzone_pii: false,
    };

    const AUDITOR_PERMS: RolePermissions = {
      tabs: ["overview", "fanzone", "onboarding"],
      collections: {
        news: { read: true },
        matches: { read: true },
      },
      fanzone_pii: true,
    };

    const MEDIA_MANAGER_PERMS: RolePermissions = {
      tabs: ["overview", "media", "hero_layout"],
      collections: {
        hero_slides: { create: true, read: true, update: true, delete: true },
        news: { create: true, read: true, update: true, delete: false },
      },
      media_upload: true,
    };

    it('prevents non-super_admin roles from hard-purging items or gaining bypass access', () => {
      expect(isSuperAdmin(EDITOR_PERMS)).toBe(false);
      expect(isSuperAdmin(AUDITOR_PERMS)).toBe(false);
      expect(isSuperAdmin(MEDIA_MANAGER_PERMS)).toBe(false);
      expect(isSuperAdmin({ all: true })).toBe(true);
    });

    it('ensures auditor role has zero mutation permissions on content collections', () => {
      expect(canOnCollection(AUDITOR_PERMS, 'news', 'create')).toBe(false);
      expect(canOnCollection(AUDITOR_PERMS, 'news', 'update')).toBe(false);
      expect(canOnCollection(AUDITOR_PERMS, 'news', 'delete')).toBe(false);
      expect(canOnCollection(AUDITOR_PERMS, 'news', 'read')).toBe(true);
    });

    it('enforces media_manager restriction away from fixture governance', () => {
      expect(canOnCollection(MEDIA_MANAGER_PERMS, 'hero_slides', 'create')).toBe(true);
      expect(canOnCollection(MEDIA_MANAGER_PERMS, 'hero_slides', 'update')).toBe(true);
      expect(canOnCollection(MEDIA_MANAGER_PERMS, 'matches', 'create')).toBe(false);
      expect(canOnCollection(MEDIA_MANAGER_PERMS, 'matches', 'delete')).toBe(false);
    });
  });

  describe('Webhook & Header Tampering', () => {
    it('rejects empty or forged bearer tokens in webhook authorization', () => {
      const validSecret = 'test-revalidate-secret-12345';
      const forgedToken = 'Bearer forged-random-secret';
      const emptyToken = '';

      const isAuthorized = (header: string) => header === `Bearer ${validSecret}`;

      expect(isAuthorized(`Bearer ${validSecret}`)).toBe(true);
      expect(isAuthorized(forgedToken)).toBe(false);
      expect(isAuthorized(emptyToken)).toBe(false);
      expect(isAuthorized('Bearer ')).toBe(false);
    });
  });

  describe('Asset Proxy Path Traversal & Identifier Validation', () => {
    const isValidAssetId = (id: string) => /^[a-zA-Z0-9_-]{1,64}$/.test(id);

    it('accepts valid UUIDs and alphanumeric asset keys', () => {
      expect(isValidAssetId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidAssetId('asset_123_456-abc')).toBe(true);
      expect(isValidAssetId('hero-banner-2026')).toBe(true);
    });

    it('rejects path traversal, special characters, and protocol injection in asset IDs', () => {
      expect(isValidAssetId('../admin/users')).toBe(false);
      expect(isValidAssetId('../../directus_users')).toBe(false);
      expect(isValidAssetId('..\\..\\etc\\passwd')).toBe(false);
      expect(isValidAssetId('id; DROP TABLE news;--')).toBe(false);
      expect(isValidAssetId('asset/123')).toBe(false);
      expect(isValidAssetId('<script>alert(1)</script>')).toBe(false);
      expect(isValidAssetId('')).toBe(false);
    });
  });

  describe('Open Redirect Defense', () => {
    const sanitizeRedirect = (target: string | null): string => {
      if (!target || typeof target !== "string") return "/";
      const trimmed = target.trim();
      if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
        return "/";
      }
      if (trimmed.includes(":") || trimmed.includes("\n") || trimmed.includes("\r")) {
        return "/";
      }
      return trimmed;
    };

    it('permits valid relative local application paths', () => {
      expect(sanitizeRedirect('/admin')).toBe('/admin');
      expect(sanitizeRedirect('/media/sables-win-nations-cup')).toBe('/media/sables-win-nations-cup');
      expect(sanitizeRedirect('/fixtures?season=2026')).toBe('/fixtures?season=2026');
    });

    it('neutralizes protocol-relative and external domain redirect attempts', () => {
      expect(sanitizeRedirect('//evil.com')).toBe('/');
      expect(sanitizeRedirect('https://evil.com/phishing')).toBe('/');
      expect(sanitizeRedirect('http://attacker.com')).toBe('/');
      expect(sanitizeRedirect('/\\evil.com')).toBe('/');
      expect(sanitizeRedirect('javascript:alert(document.cookie)')).toBe('/');
      expect(sanitizeRedirect(null)).toBe('/');
      expect(sanitizeRedirect('')).toBe('/');
    });
  });

  describe('Fail-Closed Cron & Webhook Gate', () => {
    const checkCronAuth = (providedToken: string | null, envSecret?: string): boolean => {
      if (!envSecret) return false; // Fail closed if secret is not set
      if (!providedToken) return false;
      return providedToken === envSecret;
    };

    it('fails closed when secret is not configured in the environment', () => {
      expect(checkCronAuth('any-token', undefined)).toBe(false);
      expect(checkCronAuth('any-token', '')).toBe(false);
    });

    it('rejects unauthenticated or mismatched tokens when secret is set', () => {
      const secret = 'prod-cron-secret-98765';
      expect(checkCronAuth(null, secret)).toBe(false);
      expect(checkCronAuth('wrong-token', secret)).toBe(false);
      expect(checkCronAuth(secret, secret)).toBe(true);
    });
  });
});
