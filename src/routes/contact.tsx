import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/queries";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Bhumiraj Computer Institute" },
      {
        name: "description",
        content: "Call, email or message Bhumiraj Computer Institute for course details, fees and admission help.",
      },
      { property: "og:title", content: "Contact Bhumiraj Computer Institute" },
      { property: "og:description", content: "Phone, email, address and enquiry form." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5, "Please write your message").max(1000),
});

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const parsed = schema.safeParse({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      subject: String(form.get("subject") ?? ""),
      message: String(form.get("message") ?? ""),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || "General enquiry",
      message: parsed.data.message,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    formElement.reset();
  };

  const details = [
    { Icon: MapPin, label: "Address", value: settings?.["address"] },
    { Icon: Phone, label: "Phone", value: settings?.["phone"] },
    { Icon: Mail, label: "Email", value: settings?.["email"] },
    { Icon: Clock, label: "Opening hours", value: settings?.["opening_hours"] },
  ].filter((item) => item.value);

  return (
    <PublicLayout>
      <PageHero eyebrow="Contact" title="Get in touch" description="We're happy to answer any question about courses, fees or schedules." />

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {details.map(({ Icon, label, value }) => (
            <div key={label} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
          {settings?.["map_embed_url"] ? (
            <iframe
              title="Institute location map"
              src={settings["map_embed_url"]}
              className="h-64 w-full rounded-2xl border border-border"
              loading="lazy"
            />
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required maxLength={255} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" maxLength={20} inputMode="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" maxLength={150} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" name="message" rows={6} required maxLength={1000} />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send message"}
          </Button>
        </form>
      </section>
    </PublicLayout>
  );
}
