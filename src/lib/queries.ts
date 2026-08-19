import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Course = Tables<"courses">;
export type GalleryImage = Tables<"gallery_images">;
export type GalleryCategory = Tables<"gallery_categories">;
export type VideoItem = Tables<"videos">;
export type PassedStudent = Tables<"passed_students">;
export type NewsItem = Tables<"news">;
export type Notice = Tables<"notices">;
export type EventItem = Tables<"events">;
export type Teacher = Tables<"teachers">;
export type Facility = Tables<"facilities">;
export type Testimonial = Tables<"testimonials">;
export type PageContent = Tables<"page_content">;
export type TypingText = Tables<"typing_texts">;
export type Achievement = Tables<"achievements">;
export type Admission = Tables<"admissions">;
export type ContactMessage = Tables<"contact_messages">;
export type TypingResult = Tables<"typing_results">;

const STALE = 60 * 1000;

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return (result.data ?? []) as T;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw new Error(error.message);
      return Object.fromEntries((data ?? []).map((row) => [row.key, row.value])) as Record<string, string>;
    },
  });
}

export function useCourses(options: { activeOnly?: boolean; featuredOnly?: boolean } = {}) {
  const { activeOnly = true, featuredOnly = false } = options;
  return useQuery({
    queryKey: ["courses", activeOnly, featuredOnly],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase.from("courses").select("*").order("sort_order").order("created_at");
      if (activeOnly) query = query.eq("is_active", true);
      if (featuredOnly) query = query.eq("is_featured", true);
      return unwrap<Course[]>(await query);
    },
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ["course", slug],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("slug", slug).maybeSingle();
      if (error) throw new Error(error.message);
      return data as Course | null;
    },
  });
}

export function useGalleryCategories() {
  return useQuery({
    queryKey: ["gallery_categories"],
    staleTime: STALE,
    queryFn: async () =>
      unwrap<GalleryCategory[]>(await supabase.from("gallery_categories").select("*").order("sort_order")),
  });
}

export function useGalleryImages(options: { featuredOnly?: boolean; limit?: number } = {}) {
  const { featuredOnly = false, limit } = options;
  return useQuery({
    queryKey: ["gallery_images", featuredOnly, limit],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      if (limit) query = query.limit(limit);
      return unwrap<GalleryImage[]>(await query);
    },
  });
}

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    staleTime: STALE,
    queryFn: async () =>
      unwrap<VideoItem[]>(
        await supabase.from("videos").select("*").eq("is_active", true).order("sort_order"),
      ),
  });
}

export function usePassedStudents(options: { featuredOnly?: boolean; limit?: number } = {}) {
  const { featuredOnly = false, limit } = options;
  return useQuery({
    queryKey: ["passed_students", featuredOnly, limit],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase
        .from("passed_students")
        .select("*")
        .eq("is_active", true)
        .order("completion_year", { ascending: false, nullsFirst: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      if (limit) query = query.limit(limit);
      return unwrap<PassedStudent[]>(await query);
    },
  });
}

export function useNews(options: { limit?: number; featuredOnly?: boolean } = {}) {
  const { limit, featuredOnly = false } = options;
  return useQuery({
    queryKey: ["news", limit, featuredOnly],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (featuredOnly) query = query.eq("is_featured", true);
      if (limit) query = query.limit(limit);
      return unwrap<NewsItem[]>(await query);
    },
  });
}

export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: ["news_article", slug],
    staleTime: STALE,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as NewsItem | null;
    },
  });
}

export function useNotices(limit?: number) {
  return useQuery({
    queryKey: ["notices", limit],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase
        .from("notices")
        .select("*")
        .eq("is_published", true)
        .order("notice_date", { ascending: false });
      if (limit) query = query.limit(limit);
      return unwrap<Notice[]>(await query);
    },
  });
}

export function useEvents(limit?: number) {
  return useQuery({
    queryKey: ["events", limit],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true });
      if (limit) query = query.limit(limit);
      return unwrap<EventItem[]>(await query);
    },
  });
}

export function useTeachers() {
  return useQuery({
    queryKey: ["teachers"],
    staleTime: STALE,
    queryFn: async () =>
      unwrap<Teacher[]>(
        await supabase.from("teachers").select("*").eq("is_active", true).order("sort_order"),
      ),
  });
}

export function useFacilities() {
  return useQuery({
    queryKey: ["facilities"],
    staleTime: STALE,
    queryFn: async () =>
      unwrap<Facility[]>(
        await supabase.from("facilities").select("*").eq("is_active", true).order("sort_order"),
      ),
  });
}

export function useTestimonials(featuredOnly = false) {
  return useQuery({
    queryKey: ["testimonials", featuredOnly],
    staleTime: STALE,
    queryFn: async () => {
      let query = supabase.from("testimonials").select("*").eq("is_active", true);
      if (featuredOnly) query = query.eq("is_featured", true);
      return unwrap<Testimonial[]>(await query.order("created_at", { ascending: false }));
    },
  });
}

export function usePageContent(page: string) {
  return useQuery({
    queryKey: ["page_content", page],
    staleTime: STALE,
    queryFn: async () => {
      const rows = unwrap<PageContent[]>(
        await supabase.from("page_content").select("*").eq("page", page).order("sort_order"),
      );
      return rows;
    },
  });
}

export function useTypingTexts(language: string, difficulty: string) {
  return useQuery({
    queryKey: ["typing_texts", language, difficulty],
    staleTime: STALE,
    queryFn: async () =>
      unwrap<TypingText[]>(
        await supabase
          .from("typing_texts")
          .select("*")
          .eq("is_active", true)
          .eq("language", language)
          .eq("difficulty", difficulty),
      ),
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    staleTime: STALE,
    queryFn: async () =>
      unwrap<Achievement[]>(await supabase.from("achievements").select("*").order("sort_order")),
  });
}
