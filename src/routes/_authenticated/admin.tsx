import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ResourceManager, type ResourceConfig } from "@/components/admin/ResourceManager";
import { EmptyState, ListSkeleton } from "@/components/common/States";
import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { formatDate, slugify } from "@/lib/format";
import { useGalleryCategories, useSiteSettings } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Bhumiraj Computer Institute" },
      { name: "description", content: "Manage courses, notices, admissions, messages and site settings." },
      { property: "og:title", content: "Admin Panel — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Manage website content and enquiries." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <PublicLayout>
        <div className="container-page py-20">
          <ListSkeleton />
        </div>
      </PublicLayout>
    );
  }

  if (!isAdmin) {
    return (
      <PublicLayout>
        <div className="container-page py-20">
          <EmptyState
            title="Admin access required"
            description="Your account does not have administrator permissions."
            action={
              <Button asChild variant="outline">
                <Link to="/dashboard">Go to my dashboard</Link>
              </Button>
            }
          />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageHero eyebrow="Admin" title="Content management" description="Manage enquiries, courses, notices and settings." />
      <section className="container-page py-12">
        <Tabs defaultValue="admissions">
          <TabsList className="flex w-full flex-wrap justify-start">
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students">Passed students</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="typing">Typing texts</TabsTrigger>
            <TabsTrigger value="settings">Site settings</TabsTrigger>
          </TabsList>

          <TabsContent value="admissions" className="pt-6">
            <AdmissionsTab />
          </TabsContent>
          <TabsContent value="messages" className="pt-6">
            <MessagesTab />
          </TabsContent>
          <TabsContent value="courses" className="pt-6">
            <ResourceManager config={coursesConfig} />
          </TabsContent>
          <TabsContent value="gallery" className="pt-6">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="categories" className="pt-6">
            <ResourceManager config={galleryCategoryConfig} />
          </TabsContent>
          <TabsContent value="videos" className="pt-6">
            <ResourceManager config={videosConfig} />
          </TabsContent>
          <TabsContent value="news" className="pt-6">
            <ResourceManager config={newsConfig} />
          </TabsContent>
          <TabsContent value="notices" className="pt-6">
            <ResourceManager config={noticesConfig} />
          </TabsContent>
          <TabsContent value="events" className="pt-6">
            <ResourceManager config={eventsConfig} />
          </TabsContent>
          <TabsContent value="teachers" className="pt-6">
            <ResourceManager config={teachersConfig} />
          </TabsContent>
          <TabsContent value="students" className="pt-6">
            <ResourceManager config={passedStudentsConfig} />
          </TabsContent>
          <TabsContent value="testimonials" className="pt-6">
            <ResourceManager config={testimonialsConfig} />
          </TabsContent>
          <TabsContent value="facilities" className="pt-6">
            <ResourceManager config={facilitiesConfig} />
          </TabsContent>
          <TabsContent value="typing" className="pt-6">
            <ResourceManager config={typingTextsConfig} />
          </TabsContent>
          <TabsContent value="settings" className="pt-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </section>
    </PublicLayout>
  );
}

function AdmissionsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin_admissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("admissions").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Status updated");
      void queryClient.invalidateQueries({ queryKey: ["admin_admissions"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return <ListSkeleton />;
  if ((data?.length ?? 0) === 0) return <EmptyState title="No applications yet" />;

  return (
    <div className="space-y-3">
      {data?.map((row) => (
        <div key={row.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold">{row.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {row.reference_no} · {formatDate(row.created_at)}
              </p>
            </div>
            <Badge variant={row.status === "pending" ? "secondary" : "default"}>{row.status}</Badge>
          </div>
          <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <p>Course: {row.course_name || "—"}</p>
            <p>Phone: {row.phone}</p>
            <p>Email: {row.email ?? "—"}</p>
            <p>Address: {row.address}</p>
          </div>
          {row.message ? <p className="mt-2 text-sm">{row.message}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {["pending", "contacted", "enrolled", "rejected"].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={row.status === status ? "default" : "outline"}
                onClick={() => updateStatus.mutate({ id: row.id, status })}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesTab() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin_messages"] }),
    onError: (error: Error) => toast.error(error.message),
  });

  if (isLoading) return <ListSkeleton />;
  if ((data?.length ?? 0) === 0) return <EmptyState title="No messages yet" />;

  return (
    <div className="space-y-3">
      {data?.map((row) => (
        <div key={row.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-display text-base font-semibold">{row.subject}</p>
              <p className="text-xs text-muted-foreground">
                {row.name} · {row.email} {row.phone ? `· ${row.phone}` : ""} · {formatDate(row.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor={`read-${row.id}`} className="text-xs">
                Read
              </Label>
              <Switch
                id={`read-${row.id}`}
                checked={row.is_read}
                onCheckedChange={(checked) => toggleRead.mutate({ id: row.id, isRead: checked })}
              />
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm">{row.message}</p>
        </div>
      ))}
    </div>
  );
}


const coursesConfig: ResourceConfig = {
  table: "courses",
  title: "course",
  queryKey: "courses",
  orderBy: { column: "sort_order", ascending: true },
  titleKey: "name",
  imageKey: "image_url",
  folder: "courses",
  subtitle: (row) => `${String(row["category"] ?? "")} · ${String(row["duration"] ?? "")}`,
  derive: (values) => ({ slug: slugify(String(values["name"] ?? "")) }),
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "image_url", label: "Course image", type: "image" },
    { name: "short_description", label: "Short description" },
    { name: "description", label: "Full description", type: "textarea", rows: 5 },
    { name: "duration", label: "Duration", placeholder: "3 months" },
    { name: "fee", label: "Fee", type: "number" },
    { name: "category", label: "Category", defaultValue: "General" },
    { name: "syllabus", label: "Syllabus (one per line)", type: "list" },
    { name: "requirements", label: "Requirements (one per line)", type: "list" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const galleryCategoryConfig: ResourceConfig = {
  table: "gallery_categories",
  title: "category",
  queryKey: "gallery_categories",
  orderBy: { column: "sort_order", ascending: true },
  titleKey: "name",
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
};

const videosConfig: ResourceConfig = {
  table: "videos",
  title: "video",
  queryKey: "videos",
  orderBy: { column: "sort_order", ascending: true },
  titleKey: "title",
  imageKey: "thumbnail_url",
  folder: "videos",
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "video_url", label: "Video URL (YouTube/embed)", required: true },
    { name: "thumbnail_url", label: "Thumbnail", type: "image" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const newsConfig: ResourceConfig = {
  table: "news",
  title: "news article",
  queryKey: "news",
  orderBy: { column: "published_at", ascending: false },
  titleKey: "title",
  imageKey: "cover_image_url",
  folder: "news",
  subtitle: (row) => String(row["category"] ?? ""),
  derive: (values) => ({ slug: slugify(String(values["title"] ?? "")) }),
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "cover_image_url", label: "Cover image", type: "image" },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2 },
    { name: "content", label: "Content", type: "textarea", rows: 8 },
    { name: "category", label: "Category", defaultValue: "News" },
    { name: "author", label: "Author", defaultValue: "Bhumiraj Computer Institute" },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

const noticesConfig: ResourceConfig = {
  table: "notices",
  title: "notice",
  queryKey: "notices",
  orderBy: { column: "notice_date", ascending: false },
  titleKey: "title",
  subtitle: (row) => String(row["notice_date"] ?? ""),
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "content", label: "Content", type: "textarea", rows: 5 },
    { name: "notice_date", label: "Notice date", type: "date" },
    { name: "is_important", label: "Important", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

const eventsConfig: ResourceConfig = {
  table: "events",
  title: "event",
  queryKey: "events",
  orderBy: { column: "event_date", ascending: false },
  titleKey: "title",
  imageKey: "image_url",
  folder: "events",
  subtitle: (row) => String(row["location"] ?? ""),
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "image_url", label: "Image", type: "image" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "location", label: "Location" },
    { name: "event_date", label: "Event date", type: "datetime" },
    { name: "is_published", label: "Published", type: "boolean", defaultValue: true },
  ],
};

const teachersConfig: ResourceConfig = {
  table: "teachers",
  title: "teacher",
  queryKey: "teachers",
  orderBy: { column: "sort_order", ascending: true },
  titleKey: "name",
  imageKey: "photo_url",
  folder: "teachers",
  subtitle: (row) => String(row["position"] ?? ""),
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "photo_url", label: "Photo", type: "image" },
    { name: "position", label: "Position" },
    { name: "qualification", label: "Qualification" },
    { name: "experience", label: "Experience" },
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "facebook_url", label: "Facebook URL" },
    { name: "linkedin_url", label: "LinkedIn URL" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const passedStudentsConfig: ResourceConfig = {
  table: "passed_students",
  title: "passed student",
  queryKey: "passed_students",
  titleKey: "name",
  imageKey: "photo_url",
  folder: "students",
  subtitle: (row) => `${String(row["course"] ?? "")} · ${String(row["completion_year"] ?? "")}`,
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "photo_url", label: "Photo", type: "image" },
    { name: "course", label: "Course" },
    { name: "completion_year", label: "Completion year", type: "number" },
    { name: "grade", label: "Grade" },
    { name: "achievement", label: "Achievement" },
    { name: "testimonial", label: "Testimonial", type: "textarea" },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const testimonialsConfig: ResourceConfig = {
  table: "testimonials",
  title: "testimonial",
  queryKey: "testimonials",
  titleKey: "name",
  imageKey: "photo_url",
  folder: "testimonials",
  subtitle: (row) => String(row["course"] ?? ""),
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "photo_url", label: "Photo", type: "image" },
    { name: "course", label: "Course" },
    { name: "message", label: "Message", type: "textarea" },
    { name: "rating", label: "Rating (1-5)", type: "number", defaultValue: 5 },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const facilitiesConfig: ResourceConfig = {
  table: "facilities",
  title: "facility",
  queryKey: "facilities",
  orderBy: { column: "sort_order", ascending: true },
  titleKey: "title",
  subtitle: (row) => String(row["icon"] ?? ""),
  fields: [
    { name: "title", label: "Title", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "icon", label: "Lucide icon name", defaultValue: "Sparkles" },
    { name: "sort_order", label: "Sort order", type: "number" },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

const typingTextsConfig: ResourceConfig = {
  table: "typing_texts",
  title: "typing text",
  queryKey: "typing_texts",
  titleKey: "title",
  subtitle: (row) => `${String(row["language"] ?? "")} · ${String(row["difficulty"] ?? "")}`,
  fields: [
    { name: "title", label: "Title", required: true },
    {
      name: "language",
      label: "Language",
      type: "select",
      defaultValue: "english",
      options: [
        { value: "english", label: "English" },
        { value: "nepali", label: "Nepali" },
      ],
    },
    {
      name: "difficulty",
      label: "Difficulty",
      type: "select",
      defaultValue: "beginner",
      options: [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
      ],
    },
    { name: "content", label: "Content", type: "textarea", rows: 6, required: true },
    { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
  ],
};

function GalleryTab() {
  const { data: categories } = useGalleryCategories();
  const config: ResourceConfig = {
    table: "gallery_images",
    title: "photo",
    queryKey: "gallery_images",
    orderBy: { column: "sort_order", ascending: true },
    titleKey: "caption",
    imageKey: "image_url",
    folder: "gallery",
    fields: [
      { name: "image_url", label: "Photo", type: "image" },
      { name: "caption", label: "Caption" },
      {
        name: "category_id",
        label: "Category",
        type: "select",
        options: [
          { value: "", label: "Uncategorized" },
          ...(categories ?? []).map((c) => ({ value: c.id, label: c.name })),
        ],
      },
      { name: "sort_order", label: "Sort order", type: "number" },
      { name: "is_featured", label: "Featured", type: "boolean" },
      { name: "is_active", label: "Active", type: "boolean", defaultValue: true },
    ],
  };
  return <ResourceManager config={config} />;
}

const SETTING_FIELDS = [
  { key: "institute_name", label: "Institute name" },
  { key: "tagline", label: "Tagline" },
  { key: "announcement", label: "Announcement bar" },
  { key: "hero_title", label: "Hero title" },
  { key: "hero_subtitle", label: "Hero subtitle" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "opening_hours", label: "Opening hours" },
  { key: "facebook_url", label: "Facebook URL" },
  { key: "instagram_url", label: "Instagram URL" },
  { key: "youtube_url", label: "YouTube URL" },
  { key: "map_embed_url", label: "Map embed URL" },
  { key: "footer_text", label: "Footer text" },
];

function SettingsTab() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useSiteSettings();
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const rows = SETTING_FIELDS.map((field) => ({
      key: field.key,
      value: String(form.get(field.key) ?? "").slice(0, 1000),
    }));

    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
    void queryClient.invalidateQueries({ queryKey: ["site_settings"] });
  };

  if (isLoading) return <ListSkeleton />;

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-4 rounded-2xl border border-border bg-card p-5">
      {SETTING_FIELDS.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            name={field.key}
            defaultValue={settings?.[field.key] ?? ""}
            maxLength={1000}
          />
        </div>
      ))}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
