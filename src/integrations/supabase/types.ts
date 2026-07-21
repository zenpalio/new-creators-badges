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
      cast_members: {
        Row: {
          created_at: string
          element_id: string | null
          id: string
          name: string
          notes: string | null
          personality: string | null
          preview_url: string | null
          role: string
          updated_at: string
          user_id: string | null
          voice_id: string | null
        }
        Insert: {
          created_at?: string
          element_id?: string | null
          id?: string
          name: string
          notes?: string | null
          personality?: string | null
          preview_url?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
          voice_id?: string | null
        }
        Update: {
          created_at?: string
          element_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          personality?: string | null
          preview_url?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
          voice_id?: string | null
        }
        Relationships: []
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
      dramas: {
        Row: {
          aspect_ratio: string
          created_at: string
          description: string | null
          genre: string | null
          id: string
          logline: string | null
          poster_url: string | null
          status: string
          target_episode_seconds: number
          title: string
          tone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          aspect_ratio?: string
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          logline?: string | null
          poster_url?: string | null
          status?: string
          target_episode_seconds?: number
          title: string
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          aspect_ratio?: string
          created_at?: string
          description?: string | null
          genre?: string | null
          id?: string
          logline?: string | null
          poster_url?: string | null
          status?: string
          target_episode_seconds?: number
          title?: string
          tone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      episodes: {
        Row: {
          created_at: string
          drama_id: string
          final_video_url: string | null
          hook: string | null
          id: string
          index: number
          status: string
          synopsis: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          drama_id: string
          final_video_url?: string | null
          hook?: string | null
          id?: string
          index: number
          status?: string
          synopsis?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          drama_id?: string
          final_video_url?: string | null
          hook?: string | null
          id?: string
          index?: number
          status?: string
          synopsis?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "episodes_drama_id_fkey"
            columns: ["drama_id"]
            isOneToOne: false
            referencedRelation: "dramas"
            referencedColumns: ["id"]
          },
        ]
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
      locations: {
        Row: {
          created_at: string
          description: string | null
          element_id: string | null
          id: string
          mood_tags: string[] | null
          name: string
          preview_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          element_id?: string | null
          id?: string
          mood_tags?: string[] | null
          name: string
          preview_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          element_id?: string | null
          id?: string
          mood_tags?: string[] | null
          name?: string
          preview_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
      scenes: {
        Row: {
          camera: string | null
          cast_ids: string[] | null
          created_at: string
          dialog: Json
          duration_seconds: number
          episode_id: string
          id: string
          location_id: string | null
          order_index: number
          shot_prompt: string | null
          status: string
          updated_at: string
          user_id: string | null
          variants: Json
        }
        Insert: {
          camera?: string | null
          cast_ids?: string[] | null
          created_at?: string
          dialog?: Json
          duration_seconds?: number
          episode_id: string
          id?: string
          location_id?: string | null
          order_index: number
          shot_prompt?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          variants?: Json
        }
        Update: {
          camera?: string | null
          cast_ids?: string[] | null
          created_at?: string
          dialog?: Json
          duration_seconds?: number
          episode_id?: string
          id?: string
          location_id?: string | null
          order_index?: number
          shot_prompt?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          variants?: Json
        }
        Relationships: [
          {
            foreignKeyName: "scenes_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scenes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
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
          arousal: number
          calm: number
          chat_xp_today: number
          comfort: number
          companion_id: string
          created_at: string
          current_outfit: string
          energy: number
          free_call_seconds_today: number
          hunger: number
          joy: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          stats_updated_at: string
          streak_days: number
          unlocked_tiers: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          affection?: number
          arousal?: number
          calm?: number
          chat_xp_today?: number
          comfort?: number
          companion_id: string
          created_at?: string
          current_outfit?: string
          energy?: number
          free_call_seconds_today?: number
          hunger?: number
          joy?: number
          last_chat_xp_date?: string | null
          last_free_call_date?: string | null
          last_visit_at?: string | null
          mood?: string
          stats_updated_at?: string
          streak_days?: number
          unlocked_tiers?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          affection?: number
          arousal?: number
          calm?: number
          chat_xp_today?: number
          comfort?: number
          companion_id?: string
          created_at?: string
          current_outfit?: string
          energy?: number
          free_call_seconds_today?: number
          hunger?: number
          joy?: number
          last_chat_xp_date?: string | null
          last_free_call_date?: string | null
          last_visit_at?: string | null
          mood?: string
          stats_updated_at?: string
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
          arousal: number
          calm: number
          chat_xp_today: number
          comfort: number
          companion_id: string
          created_at: string
          current_outfit: string
          energy: number
          free_call_seconds_today: number
          hunger: number
          joy: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          stats_updated_at: string
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
      nudge_companion_stats: {
        Args: {
          _arousal?: number
          _calm?: number
          _comfort?: number
          _companion_slug: string
          _energy?: number
          _hunger?: number
          _joy?: number
        }
        Returns: {
          affection: number
          arousal: number
          calm: number
          chat_xp_today: number
          comfort: number
          companion_id: string
          created_at: string
          current_outfit: string
          energy: number
          free_call_seconds_today: number
          hunger: number
          joy: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          stats_updated_at: string
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
      purchase_gift: {
        Args: { _companion_slug: string; _gift_id: string }
        Returns: {
          affection: number
          arousal: number
          calm: number
          chat_xp_today: number
          comfort: number
          companion_id: string
          created_at: string
          current_outfit: string
          energy: number
          free_call_seconds_today: number
          hunger: number
          joy: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          stats_updated_at: string
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
          arousal: number
          calm: number
          chat_xp_today: number
          comfort: number
          companion_id: string
          created_at: string
          current_outfit: string
          energy: number
          free_call_seconds_today: number
          hunger: number
          joy: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          stats_updated_at: string
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
      tick_companion_stats: {
        Args: { _companion_slug: string }
        Returns: {
          affection: number
          arousal: number
          calm: number
          chat_xp_today: number
          comfort: number
          companion_id: string
          created_at: string
          current_outfit: string
          energy: number
          free_call_seconds_today: number
          hunger: number
          joy: number
          last_chat_xp_date: string | null
          last_free_call_date: string | null
          last_visit_at: string | null
          mood: string
          stats_updated_at: string
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
