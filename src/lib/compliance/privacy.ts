import crypto from 'crypto';

/**
 * Sensitive field patterns to redact from audit logs and tracking payloads
 */
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'access_token',
  'refresh_token',
  'authorization',
  'national_id',
  'passport',
  'credit_card',
  'phone_number'
];

/**
 * Mask PII and sensitive credentials in arbitrary objects
 */
export function sanitizePayload<T>(payload: T): T {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item)) as unknown as T;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some(sensitive => 
      key.toLowerCase().includes(sensitive)
    );

    if (isSensitive) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Hash an IP address using SHA-256 for privacy-preserving CDPA / GDPR compliance
 */
export function hashIpAddress(ip: string, salt: string = process.env.COMPLIANCE_HASH_SALT || 'zru-privacy-salt'): string {
  if (!ip) return 'anonymous';
  return crypto.createHmac('sha256', salt).update(ip.trim()).digest('hex');
}

export interface ConsentRecord {
  consentType: 'cookies_analytics' | 'newsletter' | 'fan_zone' | 'marketing' | 'parental_consent';
  isGranted: boolean;
  version: string;
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}
