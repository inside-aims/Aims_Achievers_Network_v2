import { internalAction } from "./_generated/server";
import { v } from "convex/values";

async function sendSms(apiKey: string, phone: string, message: string) {
  const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({ sender: "AIMSNetwork", message, recipients: [phone] }),
  });
  const body = await response.json();
  if (!response.ok) console.error("Arkesel SMS error:", body);
  else console.log("SMS sent:", body);
}

export const sendNomineeApprovalSms = internalAction({
  args: {
    phone: v.string(),
    nomineeName: v.string(),
    categoryName: v.string(),
    eventName: v.string(),
    shortcode: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ARKESEL_API_KEY;
    if (!apiKey) { console.error("ARKESEL_API_KEY not set — skipping SMS"); return; }
    const message =
      `Congratulations ${args.nomineeName}! You have been approved as a nominee ` +
      `in the ${args.categoryName} category for ${args.eventName}. ` +
      `Your shortcode is ${args.shortcode}. Good luck!`;
    try { await sendSms(apiKey, args.phone, message); }
    catch (err) { console.error("Failed to send nominee approval SMS:", err); }
  },
});

export const sendShortcodeUpdateSms = internalAction({
  args: {
    phone: v.string(),
    nomineeName: v.string(),
    oldShortcode: v.string(),
    newShortcode: v.string(),
    eventName: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ARKESEL_API_KEY;
    if (!apiKey) { console.error("ARKESEL_API_KEY not set — skipping SMS"); return; }
    const message =
      `Hi ${args.nomineeName}, your ${args.eventName} voting shortcode has been updated. ` +
      `Old code: ${args.oldShortcode}. New code: ${args.newShortcode}. ` +
      `Please use your new shortcode for USSD voting. Good luck!`;
    try { await sendSms(apiKey, args.phone, message); }
    catch (err) { console.error("Failed to send shortcode update SMS:", err); }
  },
});

/** Sends a nominee their shortcode as a plain reminder (no old/new comparison). */
export const sendShortcodeReminderSms = internalAction({
  args: {
    phone: v.string(),
    nomineeName: v.string(),
    shortcode: v.string(),
    eventName: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.ARKESEL_API_KEY;
    if (!apiKey) { console.error("ARKESEL_API_KEY not set — skipping SMS"); return; }
    const message =
      `Hi ${args.nomineeName}, your voting shortcode for ${args.eventName} is ${args.shortcode}. ` +
      `Voting opens soon — when it does, dial the USSD code and enter this shortcode to receive votes. Good luck!`;
    try { await sendSms(apiKey, args.phone, message); }
    catch (err) { console.error("Failed to send shortcode reminder SMS:", err); }
  },
});
