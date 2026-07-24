export interface CreatePaymentLinkInput {
  amount: string;
  email: string;
  externalref: string;
  callback: string;
  redirect: string;
  /** Minutes until the link expires. Defaults to 30 if omitted. */
  expirationMinutes?: number;
  metadata?: Record<string, string>;
}

export interface MoolrePaymentLinkResponse {
  status: number | string;
  code: string;
  message: string | null;
  data:
    | {
        authorization_url: string;
        reference: string;
      }
    | unknown[];
}
