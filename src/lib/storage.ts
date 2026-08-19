import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";
const TEN_YEARS_SECONDS = 60 * 60 * 24 * 365 * 10;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export type UploadResult = { url: string; path: string };

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG, WEBP, GIF or PDF files are allowed.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "File is too large. Maximum size is 5 MB.";
  }
  return null;
}

/**
 * Uploads a file to the media bucket and returns a long-lived signed URL
 * that can be stored in the database and rendered on the public website.
 */
export async function uploadMedia(file: File, folder = "uploads"): Promise<UploadResult> {
  const validationError = validateFile(file);
  if (validationError) throw new Error(validationError);

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "uploads";
  const path = `${safeFolder}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (uploadError) throw new Error("Upload failed. Please try again.");

  const { data, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS_SECONDS);
  if (signError || !data?.signedUrl) throw new Error("Could not generate a link for the uploaded file.");

  return { url: data.signedUrl, path };
}
