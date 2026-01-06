export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_categories: {
        Row: {
          allows_nominations: boolean
          created_at: string
          event_id: string
          id: string
          name: string
        }
        Insert: {
          allows_nominations: boolean
          created_at?: string
          event_id: string
          id?: string
          name: string
        }
        Update: {
          allows_nominations?: boolean
          created_at?: string
          event_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_categories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_organizers: {
        Row: {
          created_at: string
          event_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      event_settings: {
        Row: {
          allow_bulk_votes: boolean
          created_at: string
          event_id: string
          nomination_requires_auth: boolean
          nominations_open: boolean
          vote_visibility: string
        }
        Insert: {
          allow_bulk_votes: boolean
          created_at?: string
          event_id: string
          nomination_requires_auth: boolean
          nominations_open: boolean
          vote_visibility: string
        }
        Update: {
          allow_bulk_votes?: boolean
          created_at?: string
          event_id?: string
          nomination_requires_auth?: boolean
          nominations_open?: boolean
          vote_visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_settings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_shortcode_sequences: {
        Row: {
          event_id: string
          last_value: number
        }
        Insert: {
          event_id: string
          last_value: number
        }
        Update: {
          event_id?: string
          last_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_shortcode_sequences_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: true
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          avatar_image_url: string | null
          commission_rate: number
          created_at: string
          description: string | null
          event_code: string
          event_date: string | null
          id: string
          location: string | null
          slug: string
          status: string
          title: string
          voting_ends_at: string | null
          voting_starts_at: string | null
        }
        Insert: {
          avatar_image_url?: string | null
          commission_rate: number
          created_at?: string
          description?: string | null
          event_code: string
          event_date?: string | null
          id?: string
          location?: string | null
          slug: string
          status: string
          title: string
          voting_ends_at?: string | null
          voting_starts_at?: string | null
        }
        Update: {
          avatar_image_url?: string | null
          commission_rate?: number
          created_at?: string
          description?: string | null
          event_code?: string
          event_date?: string | null
          id?: string
          location?: string | null
          slug?: string
          status?: string
          title?: string
          voting_ends_at?: string | null
          voting_starts_at?: string | null
        }
        Relationships: []
      }
      nomination_submissions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          avatar_image_url: string | null
          category_id: string
          created_at: string
          event_id: string
          id: string
          nominee_id: string | null
          nominee_identifier: string | null
          nominee_name: string
          status: string
          submitted_by_user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_image_url?: string | null
          category_id: string
          created_at?: string
          event_id: string
          id?: string
          nominee_id?: string | null
          nominee_identifier?: string | null
          nominee_name: string
          status: string
          submitted_by_user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          avatar_image_url?: string | null
          category_id?: string
          created_at?: string
          event_id?: string
          id?: string
          nominee_id?: string | null
          nominee_identifier?: string | null
          nominee_name?: string
          status?: string
          submitted_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nomination_submissions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nomination_submissions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      nominees: {
        Row: {
          avatar_image_url: string | null
          category_id: string
          created_at: string
          display_name: string
          event_id: string
          id: string
          shortcode: string
          status: string
        }
        Insert: {
          avatar_image_url?: string | null
          category_id: string
          created_at?: string
          display_name: string
          event_id: string
          id?: string
          shortcode: string
          status: string
        }
        Update: {
          avatar_image_url?: string | null
          category_id?: string
          created_at?: string
          display_name?: string
          event_id?: string
          id?: string
          shortcode?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "nominees_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nominees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      organizer_profiles: {
        Row: {
          avatar_image_url: string | null
          created_at: string
          display_name: string
          role: string
          user_id: string
        }
        Insert: {
          avatar_image_url?: string | null
          created_at?: string
          display_name: string
          role: string
          user_id: string
        }
        Update: {
          avatar_image_url?: string | null
          created_at?: string
          display_name?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      outlets: {
        Row: {
          avatar_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_platform_global: boolean
          name: string
        }
        Insert: {
          avatar_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_platform_global: boolean
          name: string
        }
        Update: {
          avatar_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_platform_global?: boolean
          name?: string
        }
        Relationships: []
      }
      payment_intents: {
        Row: {
          amount: number
          created_at: string
          event_id: string
          id: string
          nominee_id: string
          provider: string
          reference: string
          status: string
          vote_quantity: number
        }
        Insert: {
          amount: number
          created_at?: string
          event_id: string
          id?: string
          nominee_id: string
          provider: string
          reference: string
          status: string
          vote_quantity: number
        }
        Update: {
          amount?: number
          created_at?: string
          event_id?: string
          id?: string
          nominee_id?: string
          provider?: string
          reference?: string
          status?: string
          vote_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "payment_intents_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_intents_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          confirmed_at: string
          gross_amount: number
          id: string
          payment_intent_id: string
          provider_reference: string
        }
        Insert: {
          confirmed_at: string
          gross_amount: number
          id?: string
          payment_intent_id: string
          provider_reference: string
        }
        Update: {
          confirmed_at?: string
          gross_amount?: number
          id?: string
          payment_intent_id?: string
          provider_reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_payment_intent_id_fkey"
            columns: ["payment_intent_id"]
            isOneToOne: true
            referencedRelation: "payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_breakdown: {
        Row: {
          organizer_amount: number
          payment_id: string
          platform_fee: number
        }
        Insert: {
          organizer_amount: number
          payment_id: string
          platform_fee: number
        }
        Update: {
          organizer_amount?: number
          payment_id?: string
          platform_fee?: number
        }
        Relationships: [
          {
            foreignKeyName: "revenue_breakdown_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          event_id: string
          id: string
          nominee_id: string
          payment_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          nominee_id: string
          payment_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          nominee_id?: string
          payment_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "votes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: true
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

