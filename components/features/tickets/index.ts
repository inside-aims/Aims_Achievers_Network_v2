// Ticket statuses
export type TicketStatus = "valid" | "used" | "cancelled";

// Scan result after QR verification
export type ScanResultType = "success" | "already_used" | "invalid" | "cancelled";

// A single ticket type offered for an event (e.g. "General", "VIP")
export interface TicketType {
  id: string;
  name: string;
  description: string;
  pricePesewas: number; // 0 = free
  quantityTotal: number; // -1 = unlimited
  quantitySold: number;
  salesStartAt?: string; // ISO date
  salesEndAt?: string; // ISO date
}

// An individual ticket belonging to a holder
export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string; // ISO date
  eventTime: string; // e.g. "7:00 PM"
  venue: string;
  orderId: string;
  ticketTypeName: string;
  ticketCode: string; // unique alphanumeric code e.g. "AIMS-A3K9X2B7"
  holderName: string;
  holderEmail: string;
  holderPhone?: string;
  status: TicketStatus;
  usedAt?: string; // ISO datetime
  themeId: string; // references a TicketTheme
  createdAt: string; // ISO datetime
  // Re-entry: previous codes that were invalidated for this ticket
  previousCodes?: string[];
}

// A purchase order (one order can contain multiple tickets)
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

// Theme preset for customizing ticket appearance
export interface TicketTheme {
  id: string;
  name: string;
  description: string;
  primaryColor: string; // hex or oklch
  accentColor: string;
  textColor: string;
  bgPattern: string; // CSS background property
  borderStyle: string; // CSS border style
  fontFamily: string;
}

// Result of scanning a QR code
export interface ScanResult {
  type: ScanResultType;
  ticket: Ticket | null;
  message: string;
  scannedAt: string; // ISO datetime
}

// Lookup form input modes
export type LookupMode = "email" | "phone" | "code";

// Props for ticket purchase section on event pages
export interface EventTicketInfo {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  themeId: string;
  ticketTypes: TicketType[];
}
