import { describe, it, expect } from 'vitest';
import { sanitizePayload, hashIpAddress } from '../privacy';

describe('Compliance & Privacy Utilities', () => {
  it('redacts sensitive credentials and PII from payloads', () => {
    const raw = {
      email: 'fan@example.com',
      password: 'SuperSecretPassword123!',
      user_token: 'zru-directus-secret',
      profile: {
        national_id: '63-123456-A-78',
        name: 'Tendai Mtawarira',
        phone_number: '+263771234567'
      }
    };

    const sanitized = sanitizePayload(raw);

    expect(sanitized.email).toBe('fan@example.com');
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.user_token).toBe('[REDACTED]');
    expect(sanitized.profile.national_id).toBe('[REDACTED]');
    expect(sanitized.profile.phone_number).toBe('[REDACTED]');
    expect(sanitized.profile.name).toBe('Tendai Mtawarira');
  });

  it('hashes IP addresses deterministically for GDPR compliance', () => {
    const ip = '197.221.254.10';
    const hash1 = hashIpAddress(ip, 'test-salt');
    const hash2 = hashIpAddress(ip, 'test-salt');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(ip);
    expect(hash1.length).toBe(64); // SHA-256 hex length
  });
});
