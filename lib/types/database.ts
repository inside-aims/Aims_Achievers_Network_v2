// Supabase database type definitions
// Tables use snake_case columns (Postgres convention)

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      events: {
        Row: EventRow;
        Insert: {
          id?: string;
          event_id: string;
          title: string;
          description?: string | null;
          image?: string | null;
          start_date: string;
          end_date: string;
          location?: string | null;
          organizer?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<EventRow>;
        Relationships: [];
      };
      event_categories: {
        Row: EventCategoryRow;
        Insert: {
          id?: string;
          category_id: string;
          event_id: string;
          name: string;
          description?: string | null;
          vote_price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<EventCategoryRow>;
        Relationships: [
          {
            foreignKeyName: "event_categories_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          }
        ];
      };
      nominees: {
        Row: NomineeRow;
        Insert: {
          id?: string;
          nominee_id: string;
          nominee_code?: string | null;
          category_id: string;
          event_id: string;
          full_name: string;
          description?: string | null;
          department?: string | null;
          program?: string | null;
          year?: string | null;
          phone?: string | null;
          image_url?: string | null;
          votes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<NomineeRow>;
        Relationships: [
          {
            foreignKeyName: "nominees_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "event_categories";
            referencedColumns: ["category_id"];
          },
          {
            foreignKeyName: "nominees_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["event_id"];
          }
        ];
      };
      nominations: {
        Row: NominationRow;
        Insert: {
          id?: string;
          nominator_name: string;
          nominator_email: string;
          nominator_phone?: string | null;
          nominator_relationship: string;
          event_id: string;
          category_id: string;
          nominee_name: string;
          nominee_phone?: string | null;
          nominee_department?: string | null;
          nominee_year?: string | null;
          nominee_program?: string | null;
          nominee_photo_url?: string | null;
          nomination_reason: string;
          achievements?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<NominationRow>;
        Relationships: [];
      };
      gallery: {
        Row: GalleryRow;
        Insert: {
          id?: string;
          urls: string[];
          category: string;
          event_name: string;
          university?: string | null;
          description: string;
          photographer?: string | null;
          upload_date: string;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<GalleryRow>;
        Relationships: [];
      };
      outlets: {
        Row: OutletRow;
        Insert: {
          id?: string;
          name: string;
          tagline?: string | null;
          description?: string | null;
          location?: string | null;
          rating?: number | null;
          reviews?: number;
          completed_orders?: number;
          specialties?: string[];
          phone?: string | null;
          whatsapp?: string | null;
          website?: string | null;
          portfolio_images?: string[];
          featured?: boolean;
          response_time?: string | null;
          years_experience?: number | null;
          client_satisfaction?: number | null;
          verified?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<OutletRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

// ─── events ──────────────────────────────────────────────────────────────────
export type EventRow = {
  id: string;                  // uuid pk
  event_id: string;            // unique slug e.g. "fast-awards-2025"
  title: string;
  description: string | null;
  image: string | null;
  start_date: string;          // ISO date
  end_date: string;            // ISO date
  location: string | null;
  organizer: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── event_categories ────────────────────────────────────────────────────────
export type EventCategoryRow = {
  id: string;                  // uuid pk
  category_id: string;         // unique slug e.g. "fast-student-of-year"
  event_id: string;            // fk → events.event_id
  name: string;
  description: string | null;
  vote_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── nominees ────────────────────────────────────────────────────────────────
export type NomineeRow = {
  id: string;                  // uuid pk
  nominee_id: string;          // unique slug
  nominee_code: string | null; // display code e.g. "FAST-101"
  category_id: string;         // fk → event_categories.category_id
  event_id: string;            // fk → events.event_id
  full_name: string;
  description: string | null;
  department: string | null;
  program: string | null;
  year: string | null;
  phone: string | null;
  image_url: string | null;
  votes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── nominations ─────────────────────────────────────────────────────────────
export type NominationRow = {
  id: string;                    // uuid pk
  nominator_name: string;
  nominator_email: string;
  nominator_phone: string | null;
  nominator_relationship: string;
  event_id: string;              // fk → events.event_id
  category_id: string;           // fk → event_categories.category_id
  nominee_name: string;
  nominee_phone: string | null;
  nominee_department: string | null;
  nominee_year: string | null;
  nominee_program: string | null;
  nominee_photo_url: string | null;
  nomination_reason: string;
  achievements: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

// ─── gallery ─────────────────────────────────────────────────────────────────
export type GalleryRow = {
  id: string;                  // uuid pk
  urls: string[];              // array of image URLs
  category: string;
  event_name: string;
  university: string | null;
  description: string;
  photographer: string | null;
  upload_date: string;         // ISO date
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ─── outlets ─────────────────────────────────────────────────────────────────
export type OutletRow = {
  id: string;                    // uuid pk
  name: string;
  tagline: string | null;
  description: string | null;
  location: string | null;
  rating: number | null;
  reviews: number;
  completed_orders: number;
  specialties: string[];
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  portfolio_images: string[];
  featured: boolean;
  response_time: string | null;
  years_experience: number | null;
  client_satisfaction: number | null;
  verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
