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
      achievements: {
        Row: {
          code: string
          description: string
          icon: string
          id: string
          sort_order: number
          title: string
          xp_reward: number
        }
        Insert: {
          code: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title: string
          xp_reward?: number
        }
        Update: {
          code?: string
          description?: string
          icon?: string
          id?: string
          sort_order?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
      admissions: {
        Row: {
          address: string
          course_id: string | null
          course_name: string
          created_at: string
          date_of_birth: string | null
          document_url: string | null
          education: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          message: string | null
          phone: string
          reference_no: string
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string
          course_id?: string | null
          course_name?: string
          created_at?: string
          date_of_birth?: string | null
          document_url?: string | null
          education?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          message?: string | null
          phone: string
          reference_no?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string
          course_id?: string | null
          course_name?: string
          created_at?: string
          date_of_birth?: string | null
          document_url?: string | null
          education?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          message?: string | null
          phone?: string
          reference_no?: string
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admissions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          fee: number
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          requirements: string[]
          short_description: string
          slug: string
          sort_order: number
          syllabus: string[]
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          fee?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          requirements?: string[]
          short_description?: string
          slug: string
          sort_order?: number
          syllabus?: string[]
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          fee?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          requirements?: string[]
          short_description?: string
          slug?: string
          sort_order?: number
          syllabus?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          event_date: string
          id: string
          image_url: string | null
          is_published: boolean
          location: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          is_published?: boolean
          location?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string
          category_id: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean
          is_featured: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption?: string
          category_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean
          is_featured?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "gallery_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          is_published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notices: {
        Row: {
          content: string
          created_at: string
          id: string
          is_important: boolean
          is_published: boolean
          notice_date: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_important?: boolean
          is_published?: boolean
          notice_date?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_important?: boolean
          is_published?: boolean
          notice_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          body: string
          id: string
          image_url: string | null
          page: string
          section: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          id?: string
          image_url?: string | null
          page: string
          section: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          body?: string
          id?: string
          image_url?: string | null
          page?: string
          section?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      passed_students: {
        Row: {
          achievement: string
          completion_year: number | null
          course: string
          created_at: string
          grade: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          photo_url: string | null
          testimonial: string
          updated_at: string
        }
        Insert: {
          achievement?: string
          completion_year?: number | null
          course?: string
          created_at?: string
          grade?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          photo_url?: string | null
          testimonial?: string
          updated_at?: string
        }
        Update: {
          achievement?: string
          completion_year?: number | null
          course?: string
          created_at?: string
          grade?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          photo_url?: string | null
          testimonial?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          low_stock_threshold: number
          name: string
          purchase_price: number
          selling_price: number
          sku: string
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          low_stock_threshold?: number
          name: string
          purchase_price?: number
          selling_price?: number
          sku: string
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          low_stock_threshold?: number
          name?: string
          purchase_price?: number
          selling_price?: number
          sku?: string
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          last_test_date: string | null
          level: number
          streak_days: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          last_test_date?: string | null
          level?: number
          streak_days?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          last_test_date?: string | null
          level?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          product_id: string | null
          product_name: string
          quantity: number
          returned_quantity: number
          sale_id: string
          sku: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          product_id?: string | null
          product_name: string
          quantity: number
          returned_quantity?: number
          sale_id: string
          sku?: string
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          returned_quantity?: number
          sale_id?: string
          sku?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_return_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          product_id: string | null
          product_name: string
          quantity: number
          return_id: string
          sale_item_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          line_total: number
          product_id?: string | null
          product_name?: string
          quantity: number
          return_id: string
          sale_item_id: string
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          return_id?: string
          sale_item_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "sale_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_return_items_sale_item_id_fkey"
            columns: ["sale_item_id"]
            isOneToOne: false
            referencedRelation: "sale_items"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_returns: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          reason: string
          return_no: string
          sale_id: string
          total_refund: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string
          return_no: string
          sale_id: string
          total_refund?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          reason?: string
          return_no?: string
          sale_id?: string
          total_refund?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          client_token: string | null
          created_at: string
          created_by: string | null
          customer_name: string
          discount: number
          id: string
          invoice_no: string
          note: string
          payment_method: string
          refunded_total: number
          sale_date: string
          status: Database["public"]["Enums"]["sale_status"]
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          client_token?: string | null
          created_at?: string
          created_by?: string | null
          customer_name?: string
          discount?: number
          id?: string
          invoice_no: string
          note?: string
          payment_method?: string
          refunded_total?: number
          sale_date?: string
          status?: Database["public"]["Enums"]["sale_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          client_token?: string | null
          created_at?: string
          created_by?: string | null
          customer_name?: string
          discount?: number
          id?: string
          invoice_no?: string
          note?: string
          payment_method?: string
          refunded_total?: number
          sale_date?: string
          status?: Database["public"]["Enums"]["sale_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          balance_after: number
          created_at: string
          created_by: string | null
          id: string
          movement_type: Database["public"]["Enums"]["stock_movement_type"]
          product_id: string | null
          product_name: string
          quantity: number
          reason: string
          reference_id: string | null
          reference_type: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type: Database["public"]["Enums"]["stock_movement_type"]
          product_id?: string | null
          product_name?: string
          quantity: number
          reason?: string
          reference_id?: string | null
          reference_type?: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          created_by?: string | null
          id?: string
          movement_type?: Database["public"]["Enums"]["stock_movement_type"]
          product_id?: string | null
          product_name?: string
          quantity?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          bio: string
          created_at: string
          experience: string
          facebook_url: string | null
          id: string
          is_active: boolean
          linkedin_url: string | null
          name: string
          photo_url: string | null
          position: string
          qualification: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          experience?: string
          facebook_url?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          position?: string
          qualification?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          experience?: string
          facebook_url?: string | null
          id?: string
          is_active?: boolean
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          position?: string
          qualification?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          course: string
          created_at: string
          id: string
          is_active: boolean
          is_featured: boolean
          message: string
          name: string
          photo_url: string | null
          rating: number
          updated_at: string
        }
        Insert: {
          course?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          message?: string
          name: string
          photo_url?: string | null
          rating?: number
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_featured?: boolean
          message?: string
          name?: string
          photo_url?: string | null
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      typing_results: {
        Row: {
          accuracy: number
          correct_chars: number
          created_at: string
          difficulty: string
          duration_seconds: number
          errors: number
          id: string
          incorrect_chars: number
          language: string
          mode: string
          score: number
          user_id: string
          wpm: number
        }
        Insert: {
          accuracy?: number
          correct_chars?: number
          created_at?: string
          difficulty?: string
          duration_seconds?: number
          errors?: number
          id?: string
          incorrect_chars?: number
          language?: string
          mode?: string
          score?: number
          user_id: string
          wpm?: number
        }
        Update: {
          accuracy?: number
          correct_chars?: number
          created_at?: string
          difficulty?: string
          duration_seconds?: number
          errors?: number
          id?: string
          incorrect_chars?: number
          language?: string
          mode?: string
          score?: number
          user_id?: string
          wpm?: number
        }
        Relationships: []
      }
      typing_texts: {
        Row: {
          content: string
          created_at: string
          difficulty: string
          id: string
          is_active: boolean
          language: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          language?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          language?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_code: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_code: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_code?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_code_fkey"
            columns: ["achievement_code"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["code"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adjust_stock: {
        Args: {
          _movement_type: Database["public"]["Enums"]["stock_movement_type"]
          _product_id: string
          _quantity: number
          _reason?: string
        }
        Returns: number
      }
      create_sale: {
        Args: {
          _client_token?: string
          _customer_name?: string
          _discount?: number
          _items: Json
          _note?: string
          _payment_method?: string
        }
        Returns: string
      }
      delete_sale: { Args: { _sale_id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      process_sale_return: {
        Args: { _items: Json; _reason?: string; _sale_id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      sale_status: "completed" | "partially_returned" | "returned" | "void"
      stock_movement_type:
        | "opening"
        | "restock"
        | "sale"
        | "return"
        | "adjustment"
        | "damage"
        | "loss"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      sale_status: ["completed", "partially_returned", "returned", "void"],
      stock_movement_type: [
        "opening",
        "restock",
        "sale",
        "return",
        "adjustment",
        "damage",
        "loss",
      ],
    },
  },
} as const
