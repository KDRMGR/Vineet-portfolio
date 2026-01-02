import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdkyezqasgzksftfopet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZka3llenFhc2d6a3NmdGZvcGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDkzODgsImV4cCI6MjA4MjUyNTM4OH0.O1UNYeDLiV1WLr5BgAd4ArHnQ1xBKsSkcpTEP-GyLEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Database = {
  public: {
    Tables: {
      content: {
        Row: {
          id: string;
          section: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          key?: string;
          value?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      gallery_images: {
        Row: {
          id: string;
          category: string;
          image_url: string;
          title: string | null;
          description: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          image_url: string;
          title?: string | null;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          image_url?: string;
          title?: string | null;
          description?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      gallery_settings: {
        Row: {
          id: string;
          category: string;
          layout_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          layout_type?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          layout_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type LayoutType = 'grid' | 'masonry' | 'collage' | 'grouped';

export const CMS_PUBLISH_STORAGE_KEY = 'cms:lastPublish';
export const CMS_PUBLISH_EVENT = 'cms:published';

export function publishCmsUpdate() {
  const stamp = Date.now().toString();
  try {
    localStorage.setItem(CMS_PUBLISH_STORAGE_KEY, stamp);
  } catch {
    void 0;
  }
  window.dispatchEvent(new CustomEvent(CMS_PUBLISH_EVENT, { detail: { stamp } }));
}

export function subscribeToCmsUpdates(handler: (stamp: string) => void) {
  const onCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<{ stamp?: string }>).detail;
    if (detail?.stamp) handler(detail.stamp);
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== CMS_PUBLISH_STORAGE_KEY) return;
    if (!event.newValue) return;
    handler(event.newValue);
  };

  window.addEventListener(CMS_PUBLISH_EVENT, onCustomEvent);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(CMS_PUBLISH_EVENT, onCustomEvent);
    window.removeEventListener('storage', onStorage);
  };
}
