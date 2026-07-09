/**
 * ZRU MOCK COLLECTION STORAGE & SECURITY VALIDATOR
 * 
 * Safely validates, sanitizes, and stores client-submitted data (forms, newsletters, registrations)
 * in memory / localStorage. This serves as our mock DB layer until the headless CMS/CRM backend integration is live.
 */

// Helper to escape HTML characters (prevent XSS)
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Helper to validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// Types for submissions
export interface FormSubmission {
  id: string;
  timestamp: string;
  formType: "newsletter" | "referee_course" | "ticket_interest" | "contact_message";
  data: Record<string, any>;
}

// In-memory array fallback (or localStorage if browser-side)
let mockDatabase: FormSubmission[] = [];

// Safe save utility
export async function saveSubmission(
  formType: FormSubmission["formType"],
  rawData: Record<string, any>
): Promise<{ success: boolean; message: string; data?: FormSubmission }> {
  // 1. Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 2. Validate and sanitize keys
  const sanitizedData: Record<string, any> = {};
  
  for (const key in rawData) {
    if (Object.prototype.hasOwnProperty.call(rawData, key)) {
      const val = rawData[key];
      if (typeof val === "string") {
        const cleanVal = sanitizeInput(val);
        // Additional field-specific constraints
        if (key === "email" && !isValidEmail(cleanVal)) {
          return { success: false, message: `Invalid email address format for field: ${key}` };
        }
        if (cleanVal.length > 1000) {
          return { success: false, message: `Field: ${key} exceeds safety length limit.` };
        }
        sanitizedData[key] = cleanVal;
      } else if (typeof val === "boolean") {
        sanitizedData[key] = val;
      } else if (typeof val === "number") {
        sanitizedData[key] = val;
      }
    }
  }

  // 3. Create entry
  const submission: FormSubmission = {
    id: Math.random().toString(36).substring(2, 11).toUpperCase(),
    timestamp: new Date().toISOString(),
    formType,
    data: sanitizedData
  };

  // 4. Save to memory (and try LocalStorage if available in browser context)
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("zru_form_submissions");
      const list = existing ? JSON.parse(existing) : [];
      list.push(submission);
      localStorage.setItem("zru_form_submissions", JSON.stringify(list));
    } catch (e) {
      console.warn("localStorage quota exceeded or disabled, falling back to in-memory storage:", e);
    }
  }
  
  mockDatabase.push(submission);
  console.log(`[Mock DB] New submission stored:`, submission);

  return { 
    success: true, 
    message: "Submission received and securely stored.", 
    data: submission 
  };
}

// Fetch submissions (for dashboard/admin previews)
export function getSubmissions(type?: FormSubmission["formType"]): FormSubmission[] {
  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("zru_form_submissions");
      const list: FormSubmission[] = existing ? JSON.parse(existing) : [];
      return type ? list.filter(item => item.formType === type) : list;
    } catch (e) {
      console.warn("Failed to read submissions from localStorage, falling back to in-memory storage:", e);
    }
  }
  return type ? mockDatabase.filter(item => item.formType === type) : mockDatabase;
}
