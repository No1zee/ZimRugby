import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sanitizeInput, isValidEmail, saveSubmission, getSubmissions } from './mockStorage';

describe('sanitizeInput', () => {
  it('trims surrounding whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('escapes HTML-significant characters to prevent XSS', () => {
    expect(sanitizeInput('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;&#x2F;script&gt;'
    );
  });

  it('escapes ampersands first so entities are not double-encoded oddly', () => {
    expect(sanitizeInput('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes single quotes and slashes', () => {
    expect(sanitizeInput("a'b/c")).toBe('a&#x27;b&#x2F;c');
  });

  it('returns an empty string for non-string input', () => {
    // @ts-expect-error testing runtime guard against non-string input
    expect(sanitizeInput(null)).toBe('');
    // @ts-expect-error testing runtime guard against non-string input
    expect(sanitizeInput(42)).toBe('');
  });
});

describe('isValidEmail', () => {
  it.each([
    'user@example.com',
    'first.last@sub.domain.co',
    'name+tag@example.org',
    '  spaced@example.com  ',
  ])('accepts valid email %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each([
    'plainaddress',
    '@no-local.com',
    'no-at-sign.com',
    'no-domain@',
    'trailing@dot.c',
    'spaces in@example.com',
  ])('rejects invalid email %s', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe('saveSubmission / getSubmissions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function flush<T>(promise: Promise<T>): Promise<T> {
    await vi.runAllTimersAsync();
    return promise;
  }

  it('sanitizes string fields and preserves booleans and numbers', async () => {
    const result = await flush(
      saveSubmission('contact_message', {
        name: '<b>Bob</b>',
        subscribed: true,
        age: 30,
        ignored: { nested: 'object' },
      })
    );

    expect(result.success).toBe(true);
    expect(result.data?.data).toEqual({
      name: '&lt;b&gt;Bob&lt;&#x2F;b&gt;',
      subscribed: true,
      age: 30,
    });
    expect(result.data?.formType).toBe('contact_message');
    expect(result.data?.id).toMatch(/^[A-Z0-9]+$/);
    expect(() => new Date(result.data!.timestamp).toISOString()).not.toThrow();
  });

  it('rejects submissions with an invalid email field', async () => {
    const result = await flush(
      saveSubmission('newsletter', { email: 'not-an-email' })
    );
    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid email address format');
  });

  it('rejects fields that exceed the safety length limit', async () => {
    const result = await flush(
      saveSubmission('contact_message', { message: 'x'.repeat(1001) })
    );
    expect(result.success).toBe(false);
    expect(result.message).toContain('exceeds safety length limit');
  });

  it('stores submissions retrievable via getSubmissions with type filtering', async () => {
    await flush(saveSubmission('newsletter', { email: 'a@b.com' }));
    await flush(saveSubmission('referee_course', { name: 'Ref' }));

    const newsletters = getSubmissions('newsletter');
    expect(newsletters.length).toBeGreaterThanOrEqual(1);
    expect(newsletters.every((s) => s.formType === 'newsletter')).toBe(true);

    const all = getSubmissions();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});
