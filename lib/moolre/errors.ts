export const USER_MESSAGES = {
  duplicate: "This payment was already submitted. Please wait a moment and check your tickets.",
  generic: "Payment could not be initiated. Please try again shortly.",
} as const;

export type MoolreErrorKey = keyof typeof USER_MESSAGES;

export function mapMoolreCode(code: string): MoolreErrorKey {
  switch (code) {
    case "INP02":
      return "duplicate";
    default:
      return "generic";
  }
}
