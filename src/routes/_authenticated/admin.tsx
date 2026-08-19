import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { formatDate, formatFee, slugify } from "@/lib/format";
import { useCourses, useNotices, useSiteSettings } from "@/lib/queries";

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
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="settings">Site settings</TabsTrigger>
          </TabsList>

          <TabsContent value="admissions" className="pt-6">
            <AdmissionsTab />
          </TabsContent>
          <TabsContent value="messages" className="pt-6">
            <MessagesTab />
          </TabsContent>
          <TabsContent value="courses" className="pt-6">
            <CoursesTab />
          </TabsContent>
          <TabsContent value="notices" className="pt-6">
            <NoticesTab />
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

function CoursesTab() {
  const queryClient = useQueryClient();
  const { data: courses, isLoading } = useCourses({ activeOnly: false });
  const [saving, setSaving] = useState(false);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Course deleted");
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "").trim();
    if (name.length < 2) {
      toast.error("Course name is required");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("courses").insert({
      name,
      slug: slugify(name),
      short_description: String(form.get("short_description") ?? "").slice(0, 200),
      description: String(form.get("description") ?? "").slice(0, 4000),
      duration: String(form.get("duration") ?? "").slice(0, 60),
      fee: Number(form.get("fee") ?? 0),
      category: String(form.get("category") ?? "General").slice(0, 60) || "General",
      image_url: String(form.get("image_url") ?? "") || null,
      syllabus: String(form.get("syllabus") ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Course added");
    formElement.reset();
    void queryClient.invalidateQueries({ queryKey: ["courses"] });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={handleCreate} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-base font-semibold">Add course</h3>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="short_description">Short description</Label>
          <Input id="short_description" name="short_description" maxLength={200} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Full description</Label>
          <Textarea id="description" name="description" rows={4} maxLength={4000} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" name="duration" maxLength={60} placeholder="3 months" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fee">Fee</Label>
            <Input id="fee" name="fee" type="number" min={0} step={100} defaultValue={0} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" maxLength={60} placeholder="General" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" name="image_url" maxLength={500} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="syllabus">Syllabus (one item per line)</Label>
          <Textarea id="syllabus" name="syllabus" rows={4} maxLength={2000} />
        </div>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Add course"}
        </Button>
      </form>

      <div>
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <div className="space-y-3">
            {courses?.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">{course.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.category} · {course.duration || "—"} · {formatFee(course.fee)}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${course.name}`}
                  onClick={() => remove.mutate(course.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NoticesTab() {
  const queryClient = useQueryClient();
  const { data: notices, isLoading } = useNotices();
  const [saving, setSaving] = useState(false);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Notice deleted");
      void queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();
    if (title.length < 2) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("notices").insert({
      title,
      content: String(form.get("content") ?? "").slice(0, 3000),
      is_important: form.get("is_important") === "on",
    });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Notice published");
    formElement.reset();
    void queryClient.invalidateQueries({ queryKey: ["notices"] });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form onSubmit={handleCreate} className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-display text-base font-semibold">Publish notice</h3>
        <div className="space-y-2">
          <Label htmlFor="notice-title">Title</Label>
          <Input id="notice-title" name="title" required maxLength={150} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notice-content">Content</Label>
          <Textarea id="notice-content" name="content" rows={5} maxLength={3000} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_important" className="size-4 rounded border-border" />
          Mark as important
        </label>
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Publishing..." : "Publish notice"}
        </Button>
      </form>

      <div>
        {isLoading ? (
          <ListSkeleton />
        ) : (
          <div className="space-y-3">
            {notices?.map((notice) => (
              <div
                key={notice.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div>
                  <p className="font-medium">{notice.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(notice.notice_date)}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={`Delete ${notice.title}`}
                  onClick={() => remove.mutate(notice.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
