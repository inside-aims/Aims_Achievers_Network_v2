export type TicketStatus = "valid" | "used" | "cancelled";

export type ScanResultType = "success" | "already_used" | "invalid" | "cancelled";

export interface TicketType {
  id: string;
  name: string;
  description: string;
  pricePesewas: number; // 0 = free
  quantityTotal: number; // -1 = unlimited
  quantitySold: number;
  salesStartAt?: string;
  salesEndAt?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string; // ISO date
  eventTime: string; // e.g. "7:00 PM"
  venue: string;
  orderId: string;
  ticketTypeName: string;
  ticketCode: string; // e.g. "AIMS-A3K9X2B7"
  holderName: string;
  holderEmail: string;
  holderPhone?: string;
  status: TicketStatus;
  usedAt?: string; // ISO datetime
  themeId: string;
  createdAt: string; // ISO datetime
  previousCodes?: string[];
}

export interface TicketOrder {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketTypeName: string;
  quantity: number;
  totalPesewas: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  status: "pending" | "confirmed" | "cancelled" | "refunded";
  createdAt: string; // ISO datetime
  tickets: Ticket[];
}

export interface TicketTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  bgPattern: string; // CSS background property
  borderStyle: string; // CSS border property
  fontFamily: string;
}

export interface ScanResult {
  type: ScanResultType;
  ticket: Ticket | null;
  message: string;
  scannedAt: string; // ISO datetime
}

export type LookupMode = "email" | "phone" | "code";

export interface EventTicketInfo {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  themeId: string;
  ticketTypes: TicketType[];
}
