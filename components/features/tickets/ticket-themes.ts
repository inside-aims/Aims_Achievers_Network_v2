import { TicketTheme } from "./index";

// Ticket theme presets that organizers can choose from
// Each theme defines colors, patterns, and typography for the e-ticket card
export const TICKET_THEMES: TicketTheme[] = [
  {
    id: "royal-night",
    name: "Royal Night",
    description: "Elegant deep navy with gold accents for formal galas",
    primaryColor: "#1a1a40",
    accentColor: "#d4a843",
    textColor: "#f5f0e8",
    bgPattern:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212,168,67,0.05) 10px, rgba(212,168,67,0.05) 20px)",
    borderStyle: "2px solid #d4a843",
    fontFamily: "'Georgia', serif",
  },
  {
    id: "campus-vibes",
    name: "Campus Vibes",
    description: "Bold electric blue with lime for university events",
    primaryColor: "#0f2b5b",
    accentColor: "#84cc16",
    textColor: "#f0f4ff",
    bgPattern:
      "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(132,204,22,0.06) 8px, rgba(132,204,22,0.06) 16px)",
    borderStyle: "2px solid #84cc16",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "sunset-glow",
    name: "Sunset Glow",
    description: "Warm orange to deep purple gradient for entertainment",
    primaryColor: "#4c1d6e",
    accentColor: "#f97316",
    textColor: "#fef3e2",
    bgPattern:
      "radial-gradient(circle at 80% 20%, rgba(249,115,22,0.08) 0%, transparent 50%)",
    borderStyle: "2px solid #f97316",
    fontFamily: "'Georgia', serif",
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Crisp charcoal and white for corporate and professional events",
    primaryColor: "#1c1c1c",
    accentColor: "#6b7280",
    textColor: "#f9fafb",
    bgPattern: "none",
    borderStyle: "1px solid #374151",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "festival-pop",
    name: "Festival Pop",
    description: "Vibrant hot pink and cyan for fun celebrations",
    primaryColor: "#831843",
    accentColor: "#06b6d4",
    textColor: "#fdf2f8",
    bgPattern:
      "radial-gradient(circle, rgba(6,182,212,0.06) 1px, transparent 1px), radial-gradient(circle, rgba(6,182,212,0.04) 1px, transparent 1px)",
    borderStyle: "2px solid #06b6d4",
    fontFamily: "'Inter', sans-serif",
  },
  {
    id: "emerald-luxe",
    name: "Emerald Luxe",
    description: "Rich emerald green with champagne accents for premium events",
    primaryColor: "#064e3b",
    accentColor: "#d4c896",
    textColor: "#ecfdf5",
    bgPattern:
      "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(212,200,150,0.04) 20px, rgba(212,200,150,0.04) 21px)",
    borderStyle: "2px solid #d4c896",
    fontFamily: "'Georgia', serif",
  },
];

// Helper to get a theme by ID, falls back to first theme
export function getThemeById(themeId: string): TicketTheme {
  return TICKET_THEMES.find((t) => t.id === themeId) ?? TICKET_THEMES[0];
}
