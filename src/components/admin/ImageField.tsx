import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { SmartImage } from "@/components/common/Media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMedia } from "@/lib/storage";

export function ImageField({
  id,
  label,
  value,
  folder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadMedia(file, folder);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-start gap-3">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border">
          <SmartImage src={value} alt={label} className="size-20 object-cover" />
          {value ? (
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange("")}
              className="absolute right-0 top-0 rounded-bl-lg bg-background/90 p-1 text-destructive"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            id={id}
            value={value}
            placeholder="Paste an image URL or upload a file"
            onChange={(event) => onChange(event.target.value)}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
            {uploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>
      </div>
    </div>
  );
}
