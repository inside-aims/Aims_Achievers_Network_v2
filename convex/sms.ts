import { internalAction } from "./_generated/server";
import { v } from "convex/values";

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
    if (!apiKey) {
      console.error("ARKESEL_API_KEY not set — skipping nominee approval SMS");
      return;
    }

    const message =
      `Congratulations ${args.nomineeName}! You have been approved as a nominee ` +
      `in the ${args.categoryName} category for ${args.eventName}. ` +
      `Your shortcode is ${args.shortcode}. Good luck!`;

    try {
      const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: "AIMSNetwork",
          message,
          recipients: [args.phone],
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        console.error("Arkesel SMS error:", body);
      } else {
        console.log("Nominee approval SMS sent:", body);
      }
    } catch (err) {
      console.error("Failed to send nominee approval SMS:", err);
    }
  },
});
