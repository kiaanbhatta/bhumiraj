import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useCourses } from "@/lib/queries";
import { uploadMedia } from "@/lib/storage";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [
      { title: "Online Admission — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Apply online for any course at Bhumiraj Computer Institute. Quick form, fast response.",
      },
      { property: "og:title", content: "Online Admission — Bhumiraj Computer Institute" },
      { property: "og:description", content: "Apply online for any course in a few minutes." },
    ],
  }),
  component: AdmissionPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().trim().min(3, "Please enter your address").max(200),
  education: z.string().trim().max(120).optional(),
  course_id: z.string().min(1, "Please choose a course"),
  message: z.string().trim().max(1000).optional(),
});

function AdmissionPage() {
  const { data: courses } = useCourses();
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [courseId, setCourseId] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      full_name: String(form.get("full_name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      email: String(form.get("email") ?? ""),
      date_of_birth: String(form.get("date_of_birth") ?? ""),
      gender,
      address: String(form.get("address") ?? ""),
      education: String(form.get("education") ?? ""),
      course_id: courseId,
      message: String(form.get("message") ?? ""),
    };

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSubmitting(true);
    try {
      let documentUrl: string | null = null;
      if (file) {
        const uploaded = await uploadMedia(file, "admissions");
        documentUrl = uploaded.url;
      }

      const course = (courses ?? []).find((item) => item.id === parsed.data.course_id);
      const { data, error } = await supabase
        .from("admissions")
        .insert({
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          whatsapp: parsed.data.whatsapp || null,
          email: parsed.data.email || null,
          date_of_birth: parsed.data.date_of_birth || null,
          gender: parsed.data.gender || null,
          address: parsed.data.address,
          education: parsed.data.education || null,
          course_id: parsed.data.course_id,
          course_name: course?.name ?? "",
          message: parsed.data.message || null,
          document_url: documentUrl,
        })
        .select("reference_no")
        .single();

      if (error) throw new Error(error.message);
      setReference(data.reference_no);
      toast.success("Application submitted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit the form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Admission"
        title="Online admission form"
        description="Fill the form below and our team will contact you with batch and fee details."
      />

      <section className="container-page max-w-3xl py-12">
        {reference ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <h2 className="font-display text-xl font-semibold">Application received</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save your reference number — mention it when you contact us.
            </p>
            <p className="mt-5 inline-block rounded-xl bg-primary-soft px-5 py-3 font-display text-lg font-bold text-primary">
              {reference}
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setReference(null)}>
                Submit another application
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name *</Label>
                <Input id="full_name" name="full_name" required maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" name="phone" required maxLength={20} inputMode="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" maxLength={20} inputMode="tel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of birth</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input id="education" name="education" maxLength={120} placeholder="e.g. SEE, +2, Bachelor" />
              </div>
              <div className="space-y-2">
                <Label>Course *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {(courses ?? []).map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="document">Document (optional, max 5 MB)</Label>
                <Input
                  id="document"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={4} maxLength={1000} />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </Button>
          </form>
        )}
      </section>
    </PublicLayout>
  );
}
