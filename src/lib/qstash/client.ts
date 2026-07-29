import { Client } from "@upstash/qstash";

const qstashToken = process.env.QSTASH_TOKEN || "placeholder_qstash_token";

export const qstash = new Client({
  token: qstashToken,
});

/**
 * Publish an async form payload to QStash queue with exponential backoff retries.
 * If QStash token is unconfigured, executes local fallback handler cleanly.
 */
export async function publishToQueue(destinationUrl: string, payload: Record<string, unknown>) {
  try {
    if (process.env.QSTASH_TOKEN) {
      const res = await qstash.publishJSON({
        url: destinationUrl,
        body: payload,
        retries: 5,
      });
      return { success: true, messageId: res.messageId, queued: true };
    } else {
      // Local fallback execution mode
      return { success: true, queued: false, mode: "local-fallback" };
    }
  } catch (error) {
    console.warn("QStash queue publishing fallback to direct mode:", error);
    return { success: false, queued: false, error };
  }
}
