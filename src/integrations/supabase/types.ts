export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      call_log: {
        Row: {
          companion_id: string
          id: string
          seconds: number
          started_at: string
          tokens_spent: number
          user_id: string
        }
        Insert: {
          companion_id: string
          id?: string
          seconds: number
          started_at?: string
          tokens_spent: number
          user_id: string
        }
        Update: {
          companion_id?: string
          id?: string
          seconds?: number
          started_at?: string
          tokens_spent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_log_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          companion_id: string
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          companion_id: string
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          companion_id?: string
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      companions: {
        Row: {
          agent_id: string | null
          base_persona: string | null
          created_at: string
          id: string
          name: string
          slug: string
          voice_id: string | null
        }
        Insert: {
          agent_id?: string | null
          base_persona?: string | null
          created_at?: string
          id?: string
          name: string
          slug: string
          voice_id?: string | null
        }
        Update: {
          agent_id?: string | null
          base_persona?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      gift_log: {
        Row: {
          at: string
          companion_id: string
          gift_id: string
          id: string
          tokens_spent: number
          user_id: string
        }
        Insert: {
          at?: string
          companion_id: string
          gift_id: string
          id?: string
          tokens_spent: number
          user_id: string
        }
        Update: {
          at?: string
          companion_id?: string
          gift_id?: string
          id?: string
          tokens_spent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_log_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          tokens_balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          tokens_balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          tokens_balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      unlock_catalog: {
        Row: {
          affection_required: number
          asset_ref: string
          id: string
          kind: string
          label: string
          tier: string
        }
        Insert: {
          affection_required: number
          asset_ref: string
          id?: string
          kind: string
          label: string
          tier: string
        }
        Update: {
          affection_required?: number
          asset_ref?: string
          id?: string
          kind?: string
          label?: string
          tier?: string
        }
        Relationships: []
      }
      user_companion: {
        Row: {
          affection: number
          chat_xp_today: number
          companion_id: string
          created_at: string
          current_outfit: string
          free_call_seconds_today: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          streak_days: number
          unlocked_tiers: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          affection?: number
          chat_xp_today?: number
          companion_id: string
          created_at?: string
          current_outfit?: string
          free_call_seconds_today?: number
          last_chat_xp_date?: string | null
          last_free_call_date?: string | null
          last_visit_at?: string | null
          mood?: string
          streak_days?: number
          unlocked_tiers?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          affection?: number
          chat_xp_today?: number
          companion_id?: string
          created_at?: string
          current_outfit?: string
          free_call_seconds_today?: number
          last_chat_xp_date?: string | null
          last_free_call_date?: string | null
          last_visit_at?: string | null
          mood?: string
          streak_days?: number
          unlocked_tiers?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_companion_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_log: {
        Row: {
          companion_id: string
          duration_s: number | null
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          companion_id: string
          duration_s?: number | null
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          companion_id?: string
          duration_s?: number | null
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_log_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_chat_xp: {
        Args: { _companion_slug: string }
        Returns: {
          affection: number
          chat_xp_today: number
          companion_id: string
          created_at: string
          current_outfit: string
          free_call_seconds_today: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          streak_days: number
          unlocked_tiers: string[]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_companion"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      apply_decay: { Args: never; Returns: number }
      compute_mood: {
        Args: { _affection: number; _hours_since: number; _streak: number }
        Returns: string
      }
      consume_call_seconds: {
        Args: { _companion_slug: string; _intimate?: boolean; _seconds: number }
        Returns: {
          free_remaining: number
          stopped: boolean
          tokens_balance: number
        }[]
      }
      purchase_gift: {
        Args: { _companion_slug: string; _gift_id: string }
        Returns: {
          affection: number
          chat_xp_today: number
          companion_id: string
          created_at: string
          current_outfit: string
          free_call_seconds_today: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          streak_days: number
          unlocked_tiers: string[]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_companion"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      register_visit: {
        Args: { _companion_slug: string }
        Returns: {
          affection: number
          chat_xp_today: number
          companion_id: string
          created_at: string
          current_outfit: string
          free_call_seconds_today: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          streak_days: number
          unlocked_tiers: string[]
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "user_companion"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
