import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "placeholder_resend_key";
export const resend = new Resend(resendApiKey);

interface WelcomeEmailParams {
  name: string;
  email: string;
  vipCode: string;
  favoriteTeam: string;
}

/**
 * Triggers automated VIP welcome email with merchandise discount code.
 * Falls back safely if RESEND_API_KEY is unconfigured.
 */
export async function sendVIPWelcomeEmail({ name, email, vipCode, favoriteTeam }: WelcomeEmailParams) {
  try {
    if (process.env.RESEND_API_KEY) {
      const data = await resend.emails.send({
        from: "Zimbabwe Rugby Union <welcome@zimrugby.co.zw>",
        to: [email],
        subject: "Welcome to the Sables VIP Fan Zone! 🇿🇼",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #003322; color: #ffffff; padding: 30px; borderRadius: 20px;">
            <h1 style="color: #34d399; font-size: 24px; text-transform: uppercase;">WELCOME TO THE FAN ZONE, ${name.toUpperCase()}!</h1>
            <p style="font-size: 14px; color: rgba(255,255,255,0.8);">Thank you for registering your support for the <strong>${favoriteTeam}</strong> under Zimbabwe CDPA 2021.</p>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; border: 1px solid rgba(255,255,255,0.2);">
              <p style="font-size: 12px; color: #34d399; font-weight: bold; letter-spacing: 2px;">YOUR VIP SABLES MEMBER PASS</p>
              <h2 style="font-size: 28px; letter-spacing: 4px; margin: 10px 0; color: #ffffff;">CODE: ${vipCode}</h2>
              <p style="font-size: 12px; color: rgba(255,255,255,0.8);">Use this code at checkout for 10% OFF official jerseys and merchandise!</p>
            </div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.5); text-align: center;">Zimbabwe Rugby Union • Commercial Opportunities & Road to Australia 2027</p>
          </div>
        `,
      });
      if (data.data) {
        return { success: true, id: data.data.id };
      }
      return { success: true, mode: "sent" };
    } else {
      console.log(`[Mock Email Engine] Triggered VIP Welcome Email to ${email} with code ${vipCode}`);
      return { success: true, mode: "mock-fallback" };
    }
  } catch (error) {
    console.warn("Failed to send VIP welcome email:", error);
    return { success: false, error };
  }
}
