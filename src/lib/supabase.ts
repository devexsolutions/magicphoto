import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export type Database = {
  public: {
    Tables: {
      viral_templates: {
        Row: {
          id: string;
          title: string;
          description: string;
          prompt: string;
          reference_image_url: string;
          tags: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          prompt: string;
          reference_image_url: string;
          tags: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          prompt?: string;
          reference_image_url?: string;
          tags?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
      };
      generated_images: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          original_image_url: string;
          generated_image_url: string;
          status: 'pending' | 'completed' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id: string;
          original_image_url: string;
          generated_image_url?: string;
          status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string;
          original_image_url?: string;
          generated_image_url?: string;
          status?: 'pending' | 'completed' | 'failed';
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          credits: number;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          credits?: number;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          credits?: number;
          is_admin?: boolean;
          updated_at?: string;
        };
      };
      api_config: {
        Row: {
          id: string;
          openai_key: string;
          stability_key: string;
          default_credits: number;
          max_file_size: number;
          allowed_formats: string[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          openai_key: string;
          stability_key: string;
          default_credits: number;
          max_file_size: number;
          allowed_formats: string[];
          updated_at?: string;
        };
        Update: {
          id?: string;
          openai_key?: string;
          stability_key?: string;
          default_credits?: number;
          max_file_size?: number;
          allowed_formats?: string[];
          updated_at?: string;
        };
      };
    };
  };
};